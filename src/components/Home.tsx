"use client";

import { useEffect, useState } from "react";
import { fetchFullScheduleData } from "../lib/api";
import { OlympicsApiScheduleUnit } from "../lib/types";

export default function Home({ data }: { data: OlympicsApiScheduleUnit[] }) {

  return (
    <div>
      <h1>Olympics Football Matches</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.competitors[0].name} - {item.competitors[1].name}</li>
        ))}
      </ul>
    </div>
  );
}
