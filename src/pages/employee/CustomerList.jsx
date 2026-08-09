import { useEffect, useState } from 'react'
import { getAll } from '../../firestoreService'

const statusBadge = (s) => s === 'active'
  ? <span className="badge badge-success">Active</span>
  : <span className="badge badge-danger">Inactive</span>

export default function CustomerList() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading]     = useState(true)
  const [selected, setSelected]   = useState(null)
  const [txns, setTxns]           = useState([])
  const [loans, setLoans]         = useState([])
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    getAll('customers').then((d) => { setCustomers(d); setLoading(false) })
  }, [])

  const viewDetails = async (c) => {
    setSelected(c)
    setDetailLoading(true)
    const [t, l] = await Promise.all([
      getAll('transactions', [{ field: 'customerId', op: '==', value: c.id }]),
      getAll('loans',        [{ field: 'customerId', op: '==', value: c.id }]),
    ])
    setTxns(t); setLoans(l); setDetailLoading(false)
  }

  if (loading) return <div className="loading-spinner"><div className="spinner"/></div>

  return (
    <>
      <div className="page-header">
        <div><h2>Customer List</h2><p>All registered bank customers</p></div>
      </div>
      <div className="card">
        <div className="card-header"><span className="card-title">Customers ({customers.length})</span></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Name</th><th>Account No.</th><th>Balance</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={c.id}>
                  <td className="text-muted">{i + 1}</td>
                  <td className="fw-600">{c.name}</td>
                  <td className="text-muted">{c.accountNumber}</td>
                  <td className="fw-600">PKR {Number(c.balance).toLocaleString()}</td>
                  <td>{statusBadge(c.status)}</td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => viewDetails(c)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Customer Profile — {selected.name}</span>
              <button className="modal-close" onClick={() => setSelected(null)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="modal-body">
              {detailLoading ? <div className="loading-spinner"><div className="spinner"/></div> : (
                <>
                  <div className="card" style={{ marginBottom: 16 }}>
                    <div className="card-header"><span className="card-title">Account Info</span></div>
                    <div className="card-body" style={{ padding: '12px 20px' }}>
                      {[['Name', selected.name], ['Email', selected.email], ['Account No.', selected.accountNumber], ['Balance', `PKR ${Number(selected.balance).toLocaleString()}`], ['Status', selected.status]].map(([k, v]) => (
                        <div className="profile-detail-row" key={k}>
                          <span className="detail-label">{k}</span>
                          <span className="detail-value">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div className="card-title" style={{ marginBottom: 10 }}>Recent Transactions ({txns.length})</div>
                    {txns.length === 0 ? <p className="text-muted">No transactions</p> : (
                      <table style={{ width: '100%', fontSize: 13 }}>
                        <thead><tr><th>Type</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
                        <tbody>
                          {txns.slice(0, 5).map((t) => (
                            <tr key={t.id}>
                              <td style={{ textTransform: 'capitalize' }}>{t.type}</td>
                              <td>PKR {Number(t.amount).toLocaleString()}</td>
                              <td className="text-muted">{t.date}</td>
                              <td><span className={`badge badge-${t.status === 'approved' ? 'success' : t.status === 'rejected' ? 'danger' : 'warning'}`}>{t.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                  <div>
                    <div className="card-title" style={{ marginBottom: 10 }}>Loans ({loans.length})</div>
                    {loans.length === 0 ? <p className="text-muted">No loans</p> : (
                      <table style={{ width: '100%', fontSize: 13 }}>
                        <thead><tr><th>Amount</th><th>Purpose</th><th>Status</th></tr></thead>
                        <tbody>
                          {loans.map((l) => (
                            <tr key={l.id}>
                              <td>PKR {Number(l.amount).toLocaleString()}</td>
                              <td>{l.purpose}</td>
                              <td><span className={`badge badge-${l.status === 'approved' ? 'success' : l.status === 'rejected' ? 'danger' : 'warning'}`}>{l.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
