import { fetchProjects } from "@/lib/data";
import projectsDataFallback from "../../../data/projects.json";
import ProjectClient, { Project } from "./ProjectClient";

export const revalidate = 3600;

export default async function ProjectDetailPage() {
  const projectsData = await fetchProjects();
  
  return (
    <ProjectClient 
      projectsData={projectsData ?? (projectsDataFallback as Project[])} 
    />
  );
}
