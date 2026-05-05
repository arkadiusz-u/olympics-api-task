import { Suspense } from "react";
import { cacheLife } from "next/cache";

import { Home } from "@/components/Home";
import { fetchFullScheduleData } from "@/lib/api";
import { filter } from "@/lib/filter";
import { Filters, parseFilters } from "@/lib/parseFilters";
import { GenderCode, OlympicsApiScheduleUnit } from "@/lib/types";
import { MatchViewModel } from "@/types";
import { dateFormatterOptions, formatDate, timeFormatterOptions } from "@/utils";
import { SearchParams } from "next/dist/server/request/search-params";

const getOrderedCompetitors = (match: OlympicsApiScheduleUnit) =>
  [...match.competitors].sort((left, right) => left.order - right.order);

const getGenderLabel = (genderCode: GenderCode) => {
  if (genderCode === "M") {
    return "Men";
  }

  return "Women";
};

const toMatchViewModel = (match: OlympicsApiScheduleUnit): MatchViewModel => {
  const competitors = getOrderedCompetitors(match);
  const homeTeam = competitors[0]?.name || "Team TBD";
  const awayTeam = competitors[1]?.name || "Team TBD";
  const sortDate = new Date(match.startDate);

  return {
    id: match.id,
    match,
    homeTeam,
    awayTeam,
    kickoffDate: formatDate(match.startDate, dateFormatterOptions),
    kickoffTime: formatDate(match.startDate, timeFormatterOptions),
    result: `${match.competitors[0]?.results.mark || "0"} - ${match.competitors[1]?.results.mark}`,
    sortTime: sortDate.getTime(),
    genderLabel: getGenderLabel(match.genderCode),
    statusLabel: match.statusDescription || match.status || "Unknown",
    venueLabel: match.locationDescription || match.venueDescription || "Unknown",
  };
};

const filterData = (matches: MatchViewModel[], searchParams: Filters): MatchViewModel[] => {
  const filteredMatches = filter(matches, searchParams).sort((left, right) =>
    searchParams.sortOrder === "asc"
      ? left.sortTime - right.sortTime || left.id.localeCompare(right.id)
      : right.sortTime - left.sortTime || right.id.localeCompare(left.id),
  );

  return filteredMatches;
};

const getData = async () => {
  "use cache";
  cacheLife("max");

  const data = await fetchFullScheduleData();

  const matches = data.map(toMatchViewModel);
 
  return matches;
};

const HomePageFallback = () => (
  <div className="min-h-screen bg-muted/30">
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-3xl border bg-card p-8 shadow-sm">
        <div className="h-8 w-80 max-w-full rounded-md bg-muted" />
        <div className="mt-4 h-5 w-full max-w-2xl rounded-md bg-muted" />
      </section>
    </main>
  </div>
);

const HomePageContent = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const params = await searchParams;
  const filters = parseFilters(params);
  const matches = await getData();
  const filteredMatches = filterData(matches, filters);

  return (
    <Home
      matches={matches}
      filteredMatches={filteredMatches}
      search={filters.search}
      gender={filters.gender}
      sortOrder={filters.sortOrder}
    />
  );
};

export default function HomePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <Suspense fallback={<HomePageFallback />}>
      <HomePageContent searchParams={searchParams} />
    </Suspense>
  );
}
