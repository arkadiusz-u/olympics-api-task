import { MatchViewModel } from "@/types";
import { MatchCard } from "../MatchCard/MatchCard";
import { Card, CardContent } from "../ui/card";
import { Search } from "lucide-react";

interface MatchListProps {
  filteredMatches: MatchViewModel[];
  generateEndpointDataForMatch: (match: MatchViewModel) => void;
}

export const MatchList = ({ filteredMatches, generateEndpointDataForMatch }: MatchListProps) => {
  if (filteredMatches.length === 0) {
    return (
      <Card className="items-center py-14 text-center">
        <CardContent className="max-w-md space-y-3">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
            <Search className="size-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-medium">No matches found</h2>
            <p className="text-sm text-muted-foreground">Adjust the filters or reload the Olympic schedule data.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredMatches.map((match) => (
        <MatchCard key={match.id} match={match} onGenerate={() => generateEndpointDataForMatch(match)} />
      ))}
    </section>
  );
};
