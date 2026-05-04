import Home from "@/components/Home";
import { fetchFullScheduleData } from "@/lib/api";

export default async function HomePage() {
  const data = await fetchFullScheduleData();
  return <Home data={data} />;
}
