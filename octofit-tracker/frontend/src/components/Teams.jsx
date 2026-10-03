import { fetchRecords as fetch } from '../api.js'
import ResourcePage from './ResourcePage.jsx'

const endpoint = '/api/teams/'

export default function Teams() {
  return (
    <ResourcePage
      description="Find your team and see how everyone is progressing."
      endpoint={endpoint}
      fetcher={fetch}
      fields={['name', 'description', 'members', 'points']}
      title="Teams"
    />
  )
}
