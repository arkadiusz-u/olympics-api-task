"use client";

import { useCallback, useState } from "react";

import { MatchViewModel } from "@/types";
import { MatchList } from "@/components/MatchList/MatchList";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useFilters } from "@/hooks/useFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { Filters } from "@/lib/parseFilters";
import { TopBar } from "./TopBar/TopBar";

type HomeProps = {
  matches: MatchViewModel[];
  filteredMatches: MatchViewModel[];
  search: Filters['search'];
  gender: Filters['gender'];
  sortOrder: Filters['sortOrder'];
};

export const Home = ({ filteredMatches, search, gender, sortOrder }: HomeProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { isPending, setFilter, setSearchTerm } = useFilters();

  const generateEndpointDataForMatch = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-muted/30">
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <TopBar />
        <SearchBar
          search={search}
          gender={gender}
          sortOrder={sortOrder}
          setFilter={setFilter}
          setSearchTerm={setSearchTerm}
        />

        {isPending ? (
          <MatchListSkeleton />
        ) : (
          <MatchList filteredMatches={filteredMatches} generateEndpointDataForMatch={generateEndpointDataForMatch} />
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>JSON endpoint data</DialogTitle>
                    <DialogDescription>
                        The JSON endpoint data for the match.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

const MatchListSkeleton = () => {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-px w-full" />
            <div className="space-y-3 rounded-lg border p-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
