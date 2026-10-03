import { fetchRecords as fetch } from '../api.js'
import ResourcePage from './ResourcePage.jsx'

const endpoint = '/api/leaderboard/'

export default function Leaderboard() {
  return (
    <ResourcePage
      description="Celebrate individual effort and friendly competition."
      endpoint={endpoint}
      fetcher={fetch}
      fields={['rank', 'userId', 'teamId', 'points']}
      title="Leaderboard"
    />
  )
}
