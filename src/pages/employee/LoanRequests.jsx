import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getAll, updateOne, getOne } from '../../firestoreService'
import { showToast } from '../../components/Toast'

export default function LoanRequests({ managerView = false }) {
  const { user } = useSelector((s) => s.auth)
  const [loans, setLoans]     = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    getAll('loans', [{ field: 'status', op: '==', value: 'pending' }]).then((data) => {
      const filtered = managerView
        ? data.filter((l) => l.amount > 1000000)
        : data.filter((l) => l.amount <= 1000000)
      setLoans(filtered)
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  const handle = async (loan, action) => {
    await updateOne('loans', loan.id, {
      status:       action,
      approvedBy:   managerView ? 'manager' : 'employee',
      approvedById: user.id,
    })
    if (action === 'approved') {
      const cust = await getOne('customers', loan.customerId)
      if (cust) await updateOne('customers', cust.id, { balance: cust.balance + loan.amount })
    }
    showToast(`Loan ${action} successfully`, action === 'approved' ? 'success' : 'error')
    setLoading(true)
    load()
  }

  if (loading) return <div className="loading-spinner"><div className="spinner"/></div>

  return (
    <>
      <div className="page-header">
        <div>
          <h2>{managerView ? 'High-Value Loan Requests' : 'Loan Requests'}</h2>
          <p>{managerView ? 'Loans above PKR 1,000,000 requiring manager approval' : 'Pending loans up to PKR 1,000,000'}</p>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <span className="card-title">Pending Requests ({loans.length})</span>
          {managerView && <span className="badge badge-danger">High Value</span>}
        </div>
        {loans.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            <p>No pending loan requests</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Customer</th><th>Amount</th><th>Purpose</th><th>Duration</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {loans.map((l, i) => (
                  <tr key={l.id}>
                    <td className="text-muted">{i + 1}</td>
                    <td className="fw-600">{l.customerName}</td>
                    <td className="fw-600" style={{ color: managerView ? '#dc2626' : 'inherit' }}>PKR {Number(l.amount).toLocaleString()}</td>
                    <td>{l.purpose}</td>
                    <td>{l.duration} months</td>
                    <td className="text-muted">{l.date}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-success btn-sm" onClick={() => handle(l, 'approved')}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          Approve
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handle(l, 'rejected')}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          Reject
                        </button>
                      </div>
                    </td>
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
