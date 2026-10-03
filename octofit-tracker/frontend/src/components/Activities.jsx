import { fetchRecords as fetch } from '../api.js'
import ResourcePage from './ResourcePage.jsx'

const endpoint = '/api/activities/'

export default function Activities() {
  return (
    <ResourcePage
      description="See the latest movement and training sessions from your community."
      endpoint={endpoint}
      fetcher={fetch}
      fields={['type', 'userId', 'duration', 'calories', 'date']}
      title="Activities"
    />
  )
}
