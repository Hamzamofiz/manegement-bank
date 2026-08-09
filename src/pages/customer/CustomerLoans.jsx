import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getAll, addOne } from '../../firestoreService'
import { showToast } from '../../components/Toast'

const statusBadge = (s) => {
  if (s === 'approved') return <span className="badge badge-success">Approved</span>
  if (s === 'rejected') return <span className="badge badge-danger">Rejected</span>
  return <span className="badge badge-warning">Pending</span>
}

export default function CustomerLoans() {
  const { user } = useSelector((s) => s.auth)
  const [loans, setLoans]     = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]       = useState({ amount: '', purpose: '', duration: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)

  const load = () =>
    getAll('loans', [{ field: 'customerId', op: '==', value: user.id }])
      .then((d) => { setLoans(d); setLoading(false) })

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await addOne('loans', {
      customerId:   user.id,
      customerName: user.name,
      amount:       Number(form.amount),
      purpose:      form.purpose,
      duration:     form.duration,
      notes:        form.notes,
      status:       'pending',
      approvedBy:   null,
      approvedById: null,
      date:         new Date().toISOString().split('T')[0],
    })
    showToast('Loan request submitted successfully', 'success')
    setForm({ amount: '', purpose: '', duration: '', notes: '' })
    setShowForm(false)
    setLoading(true)
    load()
    setSubmitting(false)
  }

  if (loading) return <div className="loading-spinner"><div className="spinner"/></div>

  return (
    <>
      <div className="page-header">
        <div><h2>My Loans</h2><p>View loan history and submit new requests</p></div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Request Loan
        </button>
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">Loan History ({loans.length})</span></div>
        {loans.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            <p>No loan records found</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Amount</th><th>Purpose</th><th>Duration</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {loans.map((l, i) => (
                  <tr key={l.id}>
                    <td className="text-muted">{i + 1}</td>
                    <td className="fw-600">PKR {Number(l.amount).toLocaleString()}</td>
                    <td>{l.purpose}</td>
                    <td>{l.duration} months</td>
                    <td className="text-muted">{l.date}</td>
                    <td>{statusBadge(l.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Request a Loan</span>
              <button className="modal-close" onClick={() => setShowForm(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Loan Amount (PKR)</label>
                    <input className="form-control" type="number" placeholder="e.g. 500000" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required min="1000"/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Duration (Months)</label>
                    <input className="form-control" type="number" placeholder="e.g. 12" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required min="1"/>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Purpose of Loan</label>
                  <input className="form-control" type="text" placeholder="e.g. Business Expansion" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} required/>
                </div>
                <div className="form-group">
                  <label className="form-label">Additional Notes (Optional)</label>
                  <textarea className="form-control" rows="3" placeholder="Any additional information..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={{ resize: 'vertical' }}/>
                </div>
                <div style={{ padding: '12px', background: 'rgba(217,119,6,0.08)', borderRadius: 8, border: '1px solid rgba(217,119,6,0.2)', fontSize: 12, color: '#92400e' }}>
                  Loans above PKR 1,000,000 require Manager approval.
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Request'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
