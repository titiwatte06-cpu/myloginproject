import { useNavigate, useParams } from 'react-router-dom'
import PropertyDetail from '../components/PropertyDetail'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <section className="property-detail-page">
      <PropertyDetail propertyId={id} onClose={() => navigate('/search')} />
    </section>
  )
}
