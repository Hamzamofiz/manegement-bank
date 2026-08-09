import { useEffect, useState } from 'react'
import { getAll } from '../../firestoreService'

export default function EmployeeDashboard({ onNavigate }) {
  const [stats, setStats] = useState({ customers: 0, pendingLoans: 0, pendingTxns: 0 })

  useEffect(() => {
    Promise.all([
      getAll('customers'),
      getAll('loans',        [{ field: 'status', op: '==', value: 'pending' }]),
      getAll('transactions', [{ field: 'status', op: '==', value: 'pending' }]),
    ]).then(([c, l, t]) => setStats({ customers: c.length, pendingLoans: l.length, pendingTxns: t.length }))
  }, [])

  const cards = [
    { label: 'Total Customers',       value: stats.customers,   icon: 'blue',    nav: 'customers',
      svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { label: 'Pending Loans',         value: stats.pendingLoans, icon: 'gold',   nav: 'loan-requests',
      svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
    { label: 'Pending Transactions',  value: stats.pendingTxns,  icon: 'red',    nav: 'transaction-requests',
      svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  ]

  return (
    <>
      <div className="page-header">
        <div><h2>Employee Dashboard</h2><p>Overview of your operational tasks</p></div>
        <button className="btn btn-primary" onClick={() => onNavigate('create-customer')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Customer
        </button>
      </div>

      <div className="stats-grid">
        {cards.map((c) => (
          <div className="stat-card" key={c.label} style={{ cursor: 'pointer' }} onClick={() => onNavigate(c.nav)}>
            <div className={`stat-icon ${c.icon}`}>{c.svg}</div>
            <div className="stat-info">
              <div className="stat-label">{c.label}</div>
              <div className="stat-value">{c.value}</div>
              <div className="stat-sub">Click to view</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">Quick Actions</span></div>
        <div className="card-body">
          <div className="quick-actions" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
            {[
              { label: 'View Customers',  key: 'customers',             color: '#2563a8', bg: 'rgba(37,99,168,0.1)',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> },
              { label: 'Create Customer', key: 'create-customer',       color: '#16a34a', bg: 'rgba(22,163,74,0.1)',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg> },
              { label: 'Loan Requests',   key: 'loan-requests',         color: '#d97706', bg: 'rgba(217,119,6,0.1)',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
              { label: 'Transactions',    key: 'transaction-requests',  color: '#dc2626', bg: 'rgba(220,38,38,0.1)',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
            ].map((a) => (
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
