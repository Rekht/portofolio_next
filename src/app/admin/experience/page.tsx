import { getExperience } from './actions'
import ExperienceClient from './ExperienceClient'

export const dynamic = 'force-dynamic'

export default async function ExperiencePage() {
  const exp = await getExperience()

  return (
    <ExperienceClient initialExperience={exp || []} />
  )
}
