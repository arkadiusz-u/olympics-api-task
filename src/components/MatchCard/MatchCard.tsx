import { InfoRow } from "@/components/InfoRow/InfoRow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getMatchApiEndpoint } from "@/lib/endpointPayload";
import { MatchViewModel } from "@/types";

interface MatchCardProps {
  match: MatchViewModel;
  onGenerate: () => void;
}

export const MatchCard = ({
    match,
    onGenerate,
  }: MatchCardProps) => {
    const apiEndpoint = getMatchApiEndpoint(match);

    return (
      <Card>
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={match.genderLabel === "Women" ? "secondary" : "outline"}>
              {match.genderLabel}
            </Badge>
            <Badge variant="outline">{match.statusLabel}</Badge>
            <span className="text-sm text-muted-foreground">
              {match.kickoffDate} at {match.kickoffTime}
            </span>
          </div>
          <CardTitle className="text-xl">
            {match.homeTeam} <span className="text-muted-foreground">vs</span>{" "}
            {match.awayTeam}
          </CardTitle>
          <CardDescription>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="">
            <div className="grid gap-3 rounded-lg border p-4 text-sm">
              <InfoRow label="Match id" value={match.id} />
              <InfoRow label="Event unit" value={match.match.eventUnitName} />
              <InfoRow label="Venue" value={match.venueLabel} />
              <InfoRow label="Result" value={match.result.toString()} />
              <InfoRow label="API endpoint" value={apiEndpoint} />
            </div>
          </div>
        </CardContent>
        <div className="flex justify-end gap-2 px-4">
        <CardAction>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  onClick={onGenerate}
                  aria-label="Generate JSON endpoint data"
                >
                  Generate JSON
                </Button>
              </TooltipTrigger>
              <TooltipContent>Generate JSON endpoint data</TooltipContent>
            </Tooltip>
          </CardAction>
          </div>
      </Card>
    );
  }