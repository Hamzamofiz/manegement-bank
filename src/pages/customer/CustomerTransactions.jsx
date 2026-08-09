import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getAll } from '../../firestoreService'

const statusBadge = (s) => {
  if (s === 'approved') return <span className="badge badge-success">Approved</span>
  if (s === 'rejected') return <span className="badge badge-danger">Rejected</span>
  return <span className="badge badge-warning">Pending</span>
}

const typeBadge = (t) => {
  const map = { deposit: 'badge-success', withdraw: 'badge-danger', donation: 'badge-info' }
  return <span className={`badge ${map[t] || 'badge-info'}`}>{t}</span>
}

export default function CustomerTransactions() {
  const { user } = useSelector((s) => s.auth)
  const [txns, setTxns]       = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAll('transactions', [{ field: 'customerId', op: '==', value: user.id }])
      .then((data) => { setTxns(data); setLoading(false) })
  }, [user.id])

  if (loading) return <div className="loading-spinner"><div className="spinner"/></div>

  return (
    <>
      <div className="page-header">
        <div><h2>Transaction History</h2><p>All your past and pending transactions</p></div>
      </div>
      <div className="card">
        <div className="card-header"><span className="card-title">Transactions ({txns.length})</span></div>
        {txns.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            <p>No transactions found</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Type</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {txns.map((t, i) => (
                  <tr key={t.id}>
                    <td className="text-muted">{i + 1}</td>
                    <td>{typeBadge(t.type)}</td>
                    <td className="fw-600">PKR {Number(t.amount).toLocaleString()}</td>
                    <td className="text-muted">{t.date}</td>
                    <td>{statusBadge(t.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
