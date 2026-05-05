import { useCallback, useState } from "react";

import { EndpointPayload, MatchViewModel } from "@/types";

export const useEndpointPayload = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchViewModel | null>(null);
  const [endpointPayload, setEndpointPayload] = useState<EndpointPayload | null>(null);
  const [payloadError, setPayloadError] = useState<string | null>(null);
  const [isPayloadLoading, setIsPayloadLoading] = useState(false);

  const generateEndpointDataForMatch = useCallback(async (match: MatchViewModel) => {
    setSelectedMatch(match);
    setEndpointPayload(null);
    setPayloadError(null);
    setIsPayloadLoading(true);
    setIsDialogOpen(true);

    try {
      const response = await fetch(`/api/matches/${encodeURIComponent(match.id)}`);

      if (!response.ok) {
        throw new Error("Could not generate JSON endpoint data.");
      }

      const payload = await response.json() as EndpointPayload;
      setEndpointPayload(payload);
    } catch (error) {
      setPayloadError(error instanceof Error ? error.message : "Could not generate JSON endpoint data.");
    } finally {
      setIsPayloadLoading(false);
    }
  }, []);

  return {
    endpointPayload,
    generateEndpointDataForMatch,
    isDialogOpen,
    isPayloadLoading,
    payloadError,
    selectedMatch,
    setIsDialogOpen,
  }
};
