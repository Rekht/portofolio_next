import { getCertifications } from './actions'
import CertificationsClient from './CertificationsClient'

export const dynamic = 'force-dynamic'

export default async function CertificationsPage() {
  const certs = await getCertifications()

  return (
    <CertificationsClient initialCertifications={certs || []} />
  )
}
