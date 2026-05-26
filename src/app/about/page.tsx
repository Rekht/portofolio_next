import { fetchAbout } from "@/lib/data";
import aboutDataFallback from "../../data/about.json";
import AboutClient from "./AboutClient";

export const revalidate = 3600;

export default async function AboutPage() {
  const aboutData = await fetchAbout();
  return <AboutClient aboutData={aboutData ?? (aboutDataFallback as any)} />;
}
