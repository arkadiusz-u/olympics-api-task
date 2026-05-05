import React, { useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { EndpointPayload, MatchViewModel } from "@/types";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { exportEndpointPayload, getMatchApiEndpoint } from "@/lib/endpointPayload";

interface JSONDataDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMatch: MatchViewModel;
  endpointPayload: EndpointPayload | null;
  payloadError: string | null;
  isPayloadLoading: boolean;
}

export const ApiEndpointDialog = ({
  isOpen,
  onOpenChange,
  selectedMatch,
  endpointPayload,
  payloadError,
  isPayloadLoading,
}: JSONDataDialogProps) => {
  const apiEndpoint = getMatchApiEndpoint(selectedMatch);

  const exportEndpointPayloadData = useCallback(() => {
    if (!endpointPayload) {
      return;
    }

    exportEndpointPayload(endpointPayload, selectedMatch);
  }, [endpointPayload, selectedMatch]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>JSON endpoint data</DialogTitle>
          <DialogDescription>
            {selectedMatch
              ? `${selectedMatch.homeTeam} vs ${selectedMatch.awayTeam}`
              : "Generated JSON endpoint data for the match."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg border bg-muted/50 p-3 text-sm">
            <p className="font-medium">API endpoint</p>
            <code className="mt-2 block overflow-x-auto rounded bg-background px-2 py-1 text-xs">
              {apiEndpoint}
            </code>
          </div>

          {isPayloadLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : null}

          {payloadError ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {payloadError}
            </p>
          ) : null}

          {endpointPayload ? (
            <>
              <pre className="max-h-[60vh] overflow-auto rounded-lg border bg-muted p-4 text-xs">
                {JSON.stringify(endpointPayload, null, 2)}
              </pre>
              <div className="flex justify-end">
                <Button type="button" onClick={exportEndpointPayloadData}>
                  Export JSON file
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};
