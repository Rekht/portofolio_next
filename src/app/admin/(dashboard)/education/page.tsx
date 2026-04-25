import { getEducation } from './actions'
import EducationClient from './EducationClient'

export const dynamic = 'force-dynamic'

export default async function EducationPage() {
  const edu = await getEducation()

  return (
    <EducationClient initialEducation={edu || []} />
  )
}
