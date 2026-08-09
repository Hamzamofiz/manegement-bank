import { useSelector } from 'react-redux'

export default function CustomerDashboard({ onNavigate }) {
  const { user } = useSelector((s) => s.auth)

  const quickActions = [
    { label: 'Deposit', key: 'deposit', color: '#16a34a', bg: 'rgba(22,163,74,0.1)',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg> },
    { label: 'Withdraw', key: 'withdraw', color: '#dc2626', bg: 'rgba(220,38,38,0.1)',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg> },
    { label: 'Request Loan', key: 'request-loan', color: '#2563a8', bg: 'rgba(37,99,168,0.1)',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
    { label: 'Donation', key: 'donation', color: '#7c3aed', bg: 'rgba(124,58,237,0.1)',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
    { label: 'Transactions', key: 'transactions', color: '#d97706', bg: 'rgba(217,119,6,0.1)',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
    { label: 'My Loans', key: 'loans', color: '#0891b2', bg: 'rgba(8,145,178,0.1)',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  ]

  return (
    <>
      <div className="account-hero">
        <div className="account-hero-content">
          <div className="acc-label">Total Balance</div>
          <div className="acc-balance">PKR {Number(user?.balance || 0).toLocaleString()}</div>
          <div className="acc-number">{user?.accountNumber || 'ACC-XXXX'}</div>
          <div className={`acc-status ${user?.status !== 'active' ? 'inactive' : ''}`}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10"><circle cx="12" cy="12" r="10"/></svg>
            {user?.status === 'active' ? 'Account Active' : 'Account Inactive'}
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div className="stat-info">
            <div className="stat-label">Account Holder</div>
            <div className="stat-value" style={{ fontSize: 18 }}>{user?.name}</div>
            <div className="stat-sub">{user?.email}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon gold">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div className="stat-info">
            <div className="stat-label">Current Balance</div>
            <div className="stat-value">PKR {Number(user?.balance || 0).toLocaleString()}</div>
            <div className="stat-sub">Available funds</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          </div>
          <div className="stat-info">
            <div className="stat-label">Account Number</div>
            <div className="stat-value" style={{ fontSize: 18 }}>{user?.accountNumber}</div>
            <div className="stat-sub">Bank account ID</div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <span className="card-title">Quick Actions</span>
        </div>
        <div className="card-body">
          <div className="quick-actions">
            {quickActions.map((a) => (
              <button key={a.key} className="quick-action-btn" onClick={() => onNavigate(a.key)}>
                <div className="qa-icon" style={{ background: a.bg, color: a.color }}>{a.icon}</div>
                <div className="qa-label">{a.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
