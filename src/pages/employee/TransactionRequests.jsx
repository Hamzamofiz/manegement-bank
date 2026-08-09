import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getAll, updateOne, getOne } from '../../firestoreService'
import { showToast } from '../../components/Toast'

export default function TransactionRequests() {
  const { user } = useSelector((s) => s.auth)
  const [txns, setTxns]       = useState([])
  const [loading, setLoading] = useState(true)

  const load = () =>
    getAll('transactions', [{ field: 'status', op: '==', value: 'pending' }])
      .then((d) => { setTxns(d); setLoading(false) })

  useEffect(() => { load() }, [])

  const handle = async (txn, action) => {
    await updateOne('transactions', txn.id, { status: action, processedBy: user.id })
    if (action === 'approved') {
      const cust = await getOne('customers', txn.customerId)
      if (cust) {
        const newBal = txn.type === 'deposit'
          ? cust.balance + txn.amount
          : Math.max(0, cust.balance - txn.amount)
        await updateOne('customers', cust.id, { balance: newBal })
      }
    }
    showToast(`Transaction ${action}`, action === 'approved' ? 'success' : 'error')
    setLoading(true)
    load()
  }

  if (loading) return <div className="loading-spinner"><div className="spinner"/></div>

  return (
    <>
      <div className="page-header">
        <div><h2>Transaction Requests</h2><p>Pending deposit and withdrawal requests</p></div>
      </div>
      <div className="card">
        <div className="card-header"><span className="card-title">Pending Requests ({txns.length})</span></div>
        {txns.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            <p>No pending transaction requests</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Customer</th><th>Type</th><th>Amount</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {txns.map((t, i) => (
                  <tr key={t.id}>
                    <td className="text-muted">{i + 1}</td>
                    <td className="fw-600">{t.customerName}</td>
                    <td><span className={`badge ${t.type === 'deposit' ? 'badge-success' : t.type === 'withdraw' ? 'badge-danger' : 'badge-info'}`} style={{ textTransform: 'capitalize' }}>{t.type}</span></td>
                    <td className="fw-600">PKR {Number(t.amount).toLocaleString()}</td>
                    <td className="text-muted">{t.date}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-success btn-sm" onClick={() => handle(t, 'approved')}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          Approve
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handle(t, 'rejected')}>
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
