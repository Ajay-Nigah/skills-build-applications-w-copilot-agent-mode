import { useEffect, useState } from 'react'

function formatLabel(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^./, (character) => character.toUpperCase())
}

function formatValue(value) {
  if (value === null || value === undefined || value === '') return '—'
  if (Array.isArray(value)) return value.length ? value.map(formatValue).join(', ') : '—'
  if (typeof value === 'object') {
    if (value.name) return value.name
    if (value.username) return value.username
    if (value._id) return value._id
    return JSON.stringify(value)
  }

  return String(value)
}

export default function ResourcePage({ title, description, endpoint, fields, fetcher }) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadRecords() {
      try {
        setError('')
        setRecords(await fetcher(endpoint, controller.signal))
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load records.')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadRecords()
    return () => controller.abort()
  }, [endpoint, fetcher])

  return (
    <section aria-labelledby="page-title">
      <div className="page-heading mb-4">
        <div>
          <p className="eyebrow mb-2">OctoFit Tracker</p>
          <h1 className="h2 mb-2" id="page-title">{title}</h1>
          <p className="text-secondary mb-0">{description}</p>
        </div>
        <span className="record-count badge rounded-pill">{records.length} records</span>
      </div>

      {loading && (
        <div className="alert alert-info d-flex align-items-center gap-2" role="status">
          <span aria-hidden="true" className="spinner-border spinner-border-sm" />
          Loading {title.toLowerCase()}…
        </div>
      )}

      {!loading && error && (
        <div className="alert alert-danger" role="alert">
          <strong>Could not load {title.toLowerCase()}.</strong> {error}
          <p className="mb-0 mt-2">Confirm the API is running and VITE_CODESPACE_NAME is set correctly.</p>
        </div>
      )}

      {!loading && !error && records.length === 0 && (
        <div className="empty-state card">
          <div className="card-body py-5 text-center">
            <h2 className="h5">Nothing here yet</h2>
            <p className="text-secondary mb-0">No {title.toLowerCase()} have been added.</p>
          </div>
        </div>
      )}

      {!loading && !error && records.length > 0 && (
        <div className="card data-card">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  {fields.map((field) => <th key={field} scope="col">{formatLabel(field)}</th>)}
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => (
                  <tr key={record._id ?? record.id ?? `${endpoint}-${index}`}>
                    {fields.map((field) => (
                      <td key={field}>{formatValue(record[field])}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}
