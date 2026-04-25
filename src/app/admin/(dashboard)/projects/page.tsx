import { getProjects } from './actions'
import ProjectsClient from './ProjectsClient'

export const dynamic = 'force-dynamic' // Ensure we always fetch fresh data on the admin side

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <ProjectsClient initialProjects={projects || []} />
  )
}
