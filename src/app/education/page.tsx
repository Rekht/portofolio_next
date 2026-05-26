import { fetchEducation, fetchAchievements, fetchCertifications, fetchOrganizations } from "@/lib/data";
import educationDataFallback from "../../data/education.json";
import achievementsDataFallback from "../../data/achievements.json";
import certificationsDataFallback from "../../data/certifications.json";
import organizationsDataFallback from "../../data/organizations.json";
import EducationClient from "./EducationClient";

export const revalidate = 3600;

export default async function EducationPage() {
  const [educationData, achievementsData, certificationsData, organizationsData] = await Promise.all([
    fetchEducation(), fetchAchievements(), fetchCertifications(), fetchOrganizations()
  ]);
  
  return (
    <EducationClient
      educationData={educationData ?? (educationDataFallback as any)}
      achievementsData={achievementsData ?? (achievementsDataFallback as any)}
      certificationsData={certificationsData ?? (certificationsDataFallback as any)}
      organizationsData={organizationsData ?? (organizationsDataFallback as any)}
    />
  );
}
