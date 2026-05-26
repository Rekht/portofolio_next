// Server Component — data fetched on the server, cached via ISR
import {
  fetchAbout,
  fetchExperience,
  fetchProjects,
  fetchEducation,
  fetchCertifications,
  fetchAchievements,
  fetchOrganizations,
  fetchSkills,
} from "@/lib/data";

// Fallback data (used if Supabase is unavailable)
import aboutDataFallback from "@/data/about.json";
import experienceDataFallback from "@/data/experience.json";
import projectsDataFallback from "@/data/projects.json";
import educationDataFallback from "@/data/education.json";
import certificationsDataFallback from "@/data/certifications.json";
import achievementsDataFallback from "@/data/achievements.json";
import organizationsDataFallback from "@/data/organizations.json";
import skillsDataFallback from "@/data/skills.json";

import HomeClient from "./HomeClient";

// ISR: revalidate every 1 hour (3600 seconds)
// Vercel will cache the fully-rendered HTML at edge locations worldwide
export const revalidate = 3600;

export default async function HomePage() {
  // Fetch all data on the server in parallel
  const [
    aboutData,
    experienceData,
    projectsData,
    educationData,
    certificationsData,
    achievementsData,
    organizationsData,
    skillsData,
  ] = await Promise.all([
    fetchAbout(),
    fetchExperience(),
    fetchProjects(),
    fetchEducation(),
    fetchCertifications(),
    fetchAchievements(),
    fetchOrganizations(),
    fetchSkills(),
  ]);

  return (
    <HomeClient
      aboutData={aboutData ?? (aboutDataFallback as any)}
      experienceData={experienceData ?? (experienceDataFallback as any)}
      projectsData={projectsData ?? (projectsDataFallback as any)}
      educationData={educationData ?? (educationDataFallback as any)}
      certificationsData={certificationsData ?? (certificationsDataFallback as any)}
      achievementsData={achievementsData ?? (achievementsDataFallback as any)}
      organizationsData={organizationsData ?? (organizationsDataFallback as any)}
      skillsData={skillsData ?? (skillsDataFallback as any)}
    />
  );
}
