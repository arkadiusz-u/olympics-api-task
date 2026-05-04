import { OlympicsApiMatchDetailsResponse, OlympicsApiScheduleResponse, OlympicsApiScheduleUnit } from "./types";

const BASE_URL = "https://stacy.olympics.com";

export const olympicsFootballMatchesDateRange = {
  start: "2024-07-24",
  end: "2024-08-10",
}

export const fetchOlympicsFootballScheduleData = async (date: string): Promise<OlympicsApiScheduleUnit[]> => {
  const response = await fetch(`${BASE_URL}/srm/data/oly/schedule/day/ENG/${date}.json`);
  if (!response.ok) {
    throw "failed to fetch data";
  }
  const data = await response.json() as OlympicsApiScheduleResponse;

  const footballMatches = data.units.filter((unit) => unit.disciplineName === "Football");

  return footballMatches;
}

export const fetchMatchDetails = async (matchId: string): Promise<OlympicsApiMatchDetailsResponse> => {
  const response = await fetch(`${BASE_URL}/OG2024/data/RES_ByRSC_H2H~comp=OG2024~disc=FBL~rscResult=${matchId}~lang=ENG.json`);
  if (!response.ok) {
    throw "failed to fetch data";
  }
  const data = await response.json() as OlympicsApiMatchDetailsResponse;
  return data;
}

export const fetchFullScheduleData = async (): Promise<OlympicsApiScheduleUnit[]> => {
  const dates = [];
  const currentDate = new Date(olympicsFootballMatchesDateRange.start);
  while (currentDate <= new Date(olympicsFootballMatchesDateRange.end)) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  try {
    const fullFootballSchedule = await Promise.all(
      dates.map((date) => fetchOlympicsFootballScheduleData(date)),
    );
    return fullFootballSchedule.flat();
  } catch (e) {
    console.log('error', e);
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`Ładowanie pełnego harmonogramu nie powiodło się: ${msg}`);
  }
};
