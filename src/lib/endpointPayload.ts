import { EndpointPayload, LinePlayer, Lineup, MatchViewModel, Scorer } from "@/types";
import {
  Action,
  OlympicsApiMatchDetailsResponse,
  OlympicsApiScheduleUnit,
  ScorerEventType,
  TeamAthlete,
} from "@/lib/types";

type MatchDetailsItem = OlympicsApiMatchDetailsResponse["results"]["items"][number];

type ActionCompetitor = {
  pbpc_code: string;
  athletes?: {
    pbpat_code: string;
    pbpat_role: string;
  }[];
};

type GoalAction = Action & {
  competitors?: ActionCompetitor[];
};

const parseScore = (score?: string): number => {
  const parsedScore = Number(score);
  return Number.isFinite(parsedScore) ? parsedScore : 0;
};

const getEntryValue = (
  entries: { eue_code: string; eue_value: string; eue_pos?: string }[],
  code: string,
  position?: string,
) => entries.find((entry) => entry.eue_code === code && (!position || entry.eue_pos === position))?.eue_value ?? "";

const isStarter = (athlete: TeamAthlete) =>
  athlete.eventUnitEntries.some((entry) => entry.eue_code === "STARTER" && entry.eue_value === "Y");

const toLinePlayer = (athlete: TeamAthlete): LinePlayer => ({
  name: athlete.athlete.name,
  number: parseScore(athlete.bib),
  position: getEntryValue(athlete.eventUnitEntries, "POSITION", "1"),
});

const getHeadCoach = (item: MatchDetailsItem) =>
  item.teamCoaches.find((coach) => coach.function.functionCode === "COACH")?.coach.name ?? "";

const buildLineup = (item: MatchDetailsItem): Lineup => {
  const sortedAthletes = [...item.teamAthletes].sort((left, right) => left.startSortOrder - right.startSortOrder);

  return {
    team: item.participant.name,
    formation: getEntryValue(item.eventUnitEntries, "FORMATION"),
    coach: getHeadCoach(item),
    startingXI: sortedAthletes.filter(isStarter).map(toLinePlayer),
    bench: sortedAthletes.filter((athlete) => !isStarter(athlete)).map(toLinePlayer),
  };
};

const getTeamSide = (item: MatchDetailsItem): "home" | "away" =>
  getEntryValue(item.eventUnitEntries, "HOME_AWAY") === "AWAY" ? "away" : "home";

const getPeriodScore = (
  details: OlympicsApiMatchDetailsResponse,
  periodCode: string,
): { home: number; away: number } => {
  const period = details.results.periods.find((item) => item.p_code === periodCode);

  return {
    home: parseScore(period?.home.score),
    away: parseScore(period?.away.score),
  };
};

const parseMinute = (value?: string): number => {
  const match = value?.match(/\d+/);
  return match ? Number(match[0]) : 0;
};

const getScorerType = (action: GoalAction): ScorerEventType => {
  if (action.pbpa_Action === "PEN") {
    return "penalty";
  }

  if (action.pbpa_Action === "SHOT") {
    return "open_play";
  }

  if (action.pbpa_Action === "HEADER") {
    return "header";
  }

  return "unknown";
};

const buildAthleteLookup = (items: MatchDetailsItem[]) =>
  new Map(
    items.flatMap((item) =>
      item.teamAthletes.map((athlete) => [
        athlete.athlete.code,
        {
          name: athlete.athlete.name,
          team: item.participant.name,
        },
      ]),
    ),
  );

const buildScorers = (details: OlympicsApiMatchDetailsResponse): Scorer[] => {
  const athleteLookup = buildAthleteLookup(details.results.items);

  return details.results.playByPlay
    .flatMap((period) => period.actions as GoalAction[])
    .filter((action) => action.pbpa_Result === "GOAL")
    .map((action) => {
      const scorerAthlete = action.competitors
        ?.flatMap((competitor) => competitor.athletes ?? [])
        .find((athlete) => athlete.pbpat_role === "SCR");
      const assistAthlete = action.competitors
        ?.flatMap((competitor) => competitor.athletes ?? [])
        .find((athlete) => athlete.pbpat_role === "ASSIST");
      const scorer = scorerAthlete ? athleteLookup.get(scorerAthlete.pbpat_code) : undefined;
      const assist = assistAthlete ? athleteLookup.get(assistAthlete.pbpat_code) : undefined;

      return {
        team: scorer?.team ?? "",
        player: scorer?.name ?? "Unknown scorer",
        minute: parseMinute(action.pbpa_When),
        assist: assist?.name,
        type: getScorerType(action),
      };
    });
};

export const buildEndpointPayload = (
  match: OlympicsApiScheduleUnit,
  details: OlympicsApiMatchDetailsResponse,
): EndpointPayload => {
  const homeItem = details.results.items.find((item) => getTeamSide(item) === "home");
  const awayItem = details.results.items.find((item) => getTeamSide(item) === "away");
  const totalScore = getPeriodScore(details, "TOT");
  const halfTimeScore = getPeriodScore(details, "H1");

  return {
    competition: {
      name: "Olympic Games Paris 2024",
      season: "2024",
      round: details.results.eventUnit.description || match.phaseName || match.eventUnitName || "Football",
    },
    venue: {
      name: details.results.schedule.venue.description || match.venueDescription || match.venue || "Venue TBD",
      city: details.results.schedule.location.description || match.locationDescription || match.location || "City TBD",
    },
    kickoff: details.results.schedule.startDate || match.startDate,
    status: details.results.status.description || match.statusDescription || match.status || "Unknown",
    teams: {
      home: homeItem?.participant.name ?? match.competitors[0]?.name ?? "Team TBD",
      away: awayItem?.participant.name ?? match.competitors[1]?.name ?? "Team TBD",
    },
    score: {
      home: totalScore.home,
      away: totalScore.away,
      halfTime: halfTimeScore,
    },
    scorers: buildScorers(details),
    lineups: {
      home: homeItem
        ? buildLineup(homeItem)
        : { team: match.competitors[0]?.name ?? "Team TBD", formation: "", coach: "", startingXI: [], bench: [] },
      away: awayItem
        ? buildLineup(awayItem)
        : { team: match.competitors[1]?.name ?? "Team TBD", formation: "", coach: "", startingXI: [], bench: [] },
    },
  };
};

export const getPayloadFilename = (match: MatchViewModel) =>
  `${match.homeTeam}-vs-${match.awayTeam}-${match.id}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .concat(".json");

export const getMatchApiEndpoint = (match: Pick<MatchViewModel, "id">) =>
  `/api/matches/${encodeURIComponent(match.id)}`;

export const exportEndpointPayload = (endpointPayload: EndpointPayload, selectedMatch: MatchViewModel) => {
  if (!endpointPayload || !selectedMatch) {
    return;
  }

  const blob = new Blob([JSON.stringify(endpointPayload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = getPayloadFilename(selectedMatch);
  link.click();
  URL.revokeObjectURL(url);
}