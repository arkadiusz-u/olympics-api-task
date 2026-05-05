import { ExampleMatch, FullScore, OlympicsApiScheduleUnit, ScorerEventType } from "./lib/types";

export type MatchViewModel = {
    id: string;
    match: OlympicsApiScheduleUnit;
    homeTeam: string;
    awayTeam: string;
    kickoffDate: string;
    kickoffTime: string;
    result: string;
    sortTime: number;
    genderLabel: "Men" | "Women"
    statusLabel: string;
    venueLabel: string;
};

export type EndpointPayload = ExampleMatch;

export type Lineup = {
    team: string;
    formation: string;
    coach: string;
    startingXI: LinePlayer[];
    bench: LinePlayer[];
};

export type LinePlayer = {
    name: string;
    number: number;
    position: string;
};

export type Scorer = {
    team: string;
    player: string;
    minute: number;
    assist?: string;
    type: ScorerEventType;
};

// export type FilterParams = {
//     searchTerm: string;
//     genderFilter: GenderFilter;
//     sortOrder: SortOrder;
// };