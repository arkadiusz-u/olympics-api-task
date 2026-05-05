# Paris 2024 Football Endpoint Builder

Web application for QA engineers to generate and review reference JSON API payloads for Paris 2024 Olympic football matches.

The app reads the official Olympic schedule data, keeps only football matches, displays them in a searchable UI, and exposes a generated JSON endpoint for each match.

## Requirements

- Node.js `20.x` or newer
- npm

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open the corresponding URL, default is `http://localhost:3000`.

## How To Use

1. Open the application in a browser.
2. Review the list of Paris 2024 football matches.
3. Use search, gender filter, and sort controls to narrow the list.
4. Each match card displays its generated API endpoint, for example `/api/matches/[matchId]`.
5. Click `Generate JSON` to fetch match details and review the generated payload.
6. Use `Export JSON file` to download the payload in a machine-readable format.

## Data Retrieval And Parsing

Schedule data is fetched from the official Olympic API:

```text
https://stacy.olympics.com/srm/data/oly/schedule/day/ENG/{date}.json
```

The app loads dates from `2024-07-24` to `2024-08-10` and keeps only entries where `disciplineName === "Football"`.

When a user generates JSON for a match, the app calls the local endpoint:

```text
/api/matches/[matchId]
```

That route fetches additional match details from:

```text
https://stacy.olympics.com/OG2024/data/RES_ByRSC_H2H~comp=OG2024~disc=FBL~rscResult={matchId}~lang=ENG.json
```

The final payload is built in `src/lib/endpointPayload.ts` and follows the shape of `example.json`.

## Output Ordering

Matches are ordered deterministically by kickoff timestamp (`startDate`) in ascending order by default.

If two matches have the same kickoff timestamp, `matchId` is used as a tie-breaker to keep the output stable between runs.

The UI also allows reversing the order with the sort control.

## Assumptions

- I beleive most of the data is complete and consistent although it was hard to review everything because offical olympics data source is really huge
- as stated in `example.json` ot might be the case of header score but I didn't really find how to distinguish it from the source, couldn't find it, so it's omitted. In the source there's mostly just "PEN" and "SHOT" which are penalty and just a shot so then it's defaulting to "open_play"
- even though in case if some is missing, there are fallbacks in code

## Deployment

The app can be deployed in several standard Next.js ways:

- Vercel, which is the recommended and simplest deployment target for Next.js apps.
- A custom Node.js server, using the production build and `next start`.
- Docker containers, by building the app inside an image and running the production server in the container.

General production flow for a Node.js server:

```bash
npm install
npm run build
npm run start
```
