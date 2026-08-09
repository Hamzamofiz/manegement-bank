import { useDispatch, useSelector } from 'react-redux'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { logout } from '../store/authSlice'

const Icons = {
  dashboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  transactions: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  loans: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  employees: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  addUser: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
  logout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
}

const navConfig = {
  customer: [
    { label: 'Dashboard',           key: 'dashboard',             icon: Icons.dashboard },
    { label: 'Transaction History', key: 'transactions',          icon: Icons.transactions },
    { label: 'My Loans',            key: 'loans',                 icon: Icons.loans },
  ],
  employee: [
    { label: 'Dashboard',           key: 'dashboard',             icon: Icons.dashboard },
    { label: 'Customer List',       key: 'customers',             icon: Icons.users },
    { label: 'Create Customer',     key: 'create-customer',       icon: Icons.addUser },
    { label: 'Loan Requests',       key: 'loan-requests',         icon: Icons.loans },
    { label: 'Transaction Requests',key: 'transaction-requests',  icon: Icons.transactions },
  ],
  manager: [
    { label: 'Dashboard',           key: 'dashboard',             icon: Icons.dashboard },
    { label: 'Customer Management', key: 'customers',             icon: Icons.users },
    { label: 'Employee Management', key: 'employees',             icon: Icons.employees },
    { label: 'Loan Requests',       key: 'loan-requests',         icon: Icons.loans },
    { label: 'Transaction Oversight',key:'transaction-requests',  icon: Icons.transactions },
  ],
}

export default function Sidebar({ activePage, onNavigate }) {
  const dispatch = useDispatch()
  const { user, role } = useSelector((s) => s.auth)
  const navItems = navConfig[role] || []
  const initials = user?.name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'U'

  const handleLogout = async () => {
    await signOut(auth)
    dispatch(logout())
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="bank-name">Enterprise Bank</div>
        <div className="bank-sub">Management System</div>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">{initials}</div>
        <div className="user-name">{user?.name}</div>
        <div className="user-role">{role}</div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        {navItems.map((item) => (
          <div
            key={item.key}
            className={`nav-item ${activePage === item.key ? 'active' : ''}`}
            onClick={() => onNavigate(item.key)}
          >
            {item.icon}
            {item.label}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          {Icons.logout}
          Sign Out
        </button>
      </div>
    </aside>
  )
}
