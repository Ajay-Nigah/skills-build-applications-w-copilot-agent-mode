import { fetchRecords as fetch } from '../api.js'
import ResourcePage from './ResourcePage.jsx'

const endpoint = '/api/users/'

export default function Users() {
  return (
    <ResourcePage
      description="Meet the people building healthy habits together."
      endpoint={endpoint}
      fetcher={fetch}
      fields={['name', 'username', 'email', 'teamId']}
      title="Users"
    />
  )
}
