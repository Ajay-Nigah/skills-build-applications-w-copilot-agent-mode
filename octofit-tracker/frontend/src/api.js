const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const validCodespaceName = /^[a-zA-Z0-9-]+$/.test(codespaceName ?? '')

export const apiBaseUrl = validCodespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

export function getRecords(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.results)) return payload.results
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.data?.results)) return payload.data.results
  if (Array.isArray(payload?.data?.items)) return payload.data.items
  throw new Error('The API response did not contain a record list.')
}

export async function fetchRecords(endpoint, signal) {
  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    throw new Error(`Request failed (${response.status} ${response.statusText}).`)
  }

  return getRecords(await response.json())
}
