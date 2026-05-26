import { fetchExperience, fetchProjects, fetchSkills } from "@/lib/data";
import experienceDataFallback from "../../data/experience.json";
import projectsDataFallback from "../../data/projects.json";
import skillsDataFallback from "../../data/skills.json";
import ExperienceClient from "./ExperienceClient";

export const revalidate = 3600;

export default async function ExperiencePage() {
  const [experienceData, projectsData, skillsData] = await Promise.all([
    fetchExperience(), fetchProjects(), fetchSkills()
  ]);

  return (
    <ExperienceClient
      experienceData={experienceData ?? (experienceDataFallback as any)}
      projectsData={projectsData ?? (projectsDataFallback as any)}
      skillsData={skillsData ?? (skillsDataFallback as any)}
    />
  );
}
