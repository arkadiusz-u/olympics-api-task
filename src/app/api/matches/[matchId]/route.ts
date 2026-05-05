import { NextResponse } from "next/server";

import { fetchFullScheduleData, fetchMatchDetails } from "@/lib/api";
import { buildEndpointPayload } from "@/lib/endpointPayload";

type RouteContext = {
  params: Promise<{
    matchId: string;
  }>;
};

export const GET = async (_request: Request, { params }: RouteContext) => {
  const { matchId } = await params;
  const decodedMatchId = decodeURIComponent(matchId);
  const schedule = await fetchFullScheduleData();
  const match = schedule.find((item) => item.id === decodedMatchId);

  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  const details = await fetchMatchDetails(decodedMatchId);
  const payload = buildEndpointPayload(match, details);

  return NextResponse.json(payload);
};
