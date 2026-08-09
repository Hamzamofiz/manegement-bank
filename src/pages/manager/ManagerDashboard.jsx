import { useEffect, useState } from 'react'
import { getAll, getOne } from '../../firestoreService'

export default function ManagerDashboard({ onNavigate }) {
  const [stats, setStats] = useState({ totalBalance: 0, totalLoans: 0, customers: 0, employees: 0, pendingLoans: 0, pendingTxns: 0 })

  useEffect(() => {
    Promise.all([
      getAll('customers'),
      getAll('employees'),
      getAll('loans',        [{ field: 'status', op: '==', value: 'pending' }]),
      getAll('transactions', [{ field: 'status', op: '==', value: 'pending' }]),
      getOne('bankSummary', 'main'),
    ]).then(([c, e, pl, pt, bs]) => {
      setStats({
        totalBalance:  bs?.totalBalance || 0,
        totalLoans:    bs?.totalLoansIssued || 0,
        customers:     c.length,
        employees:     e.length,
        pendingLoans:  pl.filter((l) => l.amount > 1000000).length,
        pendingTxns:   pt.length,
      })
    })
  }, [])

  const cards = [
    { label: 'Total Bank Balance',       value: `PKR ${Number(stats.totalBalance).toLocaleString()}`, icon: 'gold',   sub: 'Bank reserves',
      svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
    { label: 'Total Loans Issued',        value: `PKR ${Number(stats.totalLoans).toLocaleString()}`,  icon: 'blue',   sub: 'Approved loans',
      svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
    { label: 'Active Customers',          value: stats.customers,  icon: 'green',  sub: 'Registered accounts', nav: 'customers',
      svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { label: 'Total Employees',           value: stats.employees,  icon: 'purple', sub: 'Bank staff', nav: 'employees',
      svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    { label: 'High-Value Loan Requests',  value: stats.pendingLoans, icon: 'red',  sub: 'Awaiting approval', nav: 'loan-requests',
      svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
    { label: 'Pending Transactions',      value: stats.pendingTxns,  icon: 'gold', sub: 'Awaiting processing', nav: 'transaction-requests',
      svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  ]

  return (
    <>
      <div className="page-header">
        <div><h2>Manager Dashboard</h2><p>Complete bank operations overview</p></div>
      </div>
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        {cards.map((c) => (
          <div className="stat-card" key={c.label} style={{ cursor: c.nav ? 'pointer' : 'default' }} onClick={() => c.nav && onNavigate(c.nav)}>
            <div className={`stat-icon ${c.icon}`}>{c.svg}</div>
            <div className="stat-info">
              <div className="stat-label">{c.label}</div>
              <div className="stat-value" style={{ fontSize: typeof c.value === 'string' && c.value.length > 12 ? 16 : 26 }}>{c.value}</div>
              <div className="stat-sub">{c.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
