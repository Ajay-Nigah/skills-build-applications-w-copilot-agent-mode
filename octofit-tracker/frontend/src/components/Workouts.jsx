import { fetchRecords as fetch } from '../api.js'
import ResourcePage from './ResourcePage.jsx'

const endpoint = '/api/workouts/'

export default function Workouts() {
  return (
    <ResourcePage
      description="Browse workout ideas matched to different goals and experience levels."
      endpoint={endpoint}
      fetcher={fetch}
      fields={['name', 'category', 'difficulty', 'duration', 'description']}
      title="Workouts"
    />
  )
}
