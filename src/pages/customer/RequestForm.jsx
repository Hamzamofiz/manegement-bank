import { useState } from 'react'
import { useSelector } from 'react-redux'
import { addOne } from '../../firestoreService'
import { showToast } from '../../components/Toast'

const typeConfig = {
  deposit:  { label: 'Deposit Request',    color: '#16a34a', bg: 'rgba(22,163,74,0.08)',  border: 'rgba(22,163,74,0.2)' },
  withdraw: { label: 'Withdrawal Request', color: '#dc2626', bg: 'rgba(220,38,38,0.08)',  border: 'rgba(220,38,38,0.2)' },
  donation: { label: 'Donation Request',   color: '#7c3aed', bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.2)' },
}

export default function RequestForm({ type, onBack }) {
  const { user } = useSelector((s) => s.auth)
  const [amount, setAmount]       = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone]           = useState(false)
  const cfg = typeConfig[type] || typeConfig.deposit

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await addOne('transactions', {
      customerId:   user.id,
      customerName: user.name,
      type,
      amount:       Number(amount),
      status:       'pending',
      date:         new Date().toISOString().split('T')[0],
      processedBy:  null,
    })
    showToast(`${cfg.label} submitted successfully`, 'success')
    setDone(true)
    setSubmitting(false)
  }

  return (
    <>
      <div className="page-header">
        <div><h2>{cfg.label}</h2><p>Submit a request — it will be processed by bank staff</p></div>
        <button className="btn btn-outline" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
      </div>
      <div className="card" style={{ maxWidth: 480 }}>
        <div className="card-header"><span className="card-title">{cfg.label}</span></div>
        <div className="card-body">
          {done ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(22,163,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" width="28" height="28"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Request Submitted</div>
              <div className="text-muted" style={{ marginBottom: 20 }}>Your request is pending approval from bank staff.</div>
              <button className="btn btn-primary" onClick={onBack}>Back to Dashboard</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ padding: '12px 14px', background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 8, marginBottom: 20, fontSize: 13, color: cfg.color, fontWeight: 500 }}>
                This request will be reviewed and processed by an authorized bank employee.
              </div>
              <div className="form-group">
                <label className="form-label">Amount (PKR)</label>
                <input className="form-control" type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} required min="1"/>
              </div>
              <div className="profile-detail-row">
                <span className="detail-label">Account Holder</span>
                <span className="detail-value">{user.name}</span>
              </div>
              <div className="profile-detail-row">
                <span className="detail-label">Account Number</span>
                <span className="detail-value">{user.accountNumber}</span>
              </div>
              <div className="profile-detail-row">
                <span className="detail-label">Request Type</span>
                <span className="detail-value" style={{ color: cfg.color, textTransform: 'capitalize' }}>{type}</span>
              </div>
              <div className="divider"/>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting}>
                {submitting ? 'Submitting...' : `Submit ${cfg.label}`}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
