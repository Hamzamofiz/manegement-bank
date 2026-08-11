import { useState } from 'react'
import Sidebar from './Sidebar'

export default function Layout({ activePage, onNavigate, title, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const now = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const close = () => setSidebarOpen(false)

  return (
    <div className="app-layout">
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={close} />
      <Sidebar activePage={activePage} onNavigate={(k) => { onNavigate(k); close() }} isOpen={sidebarOpen} onClose={close} />
      <div className="main-content">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="hamburger" onClick={() => setSidebarOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div className="topbar-title">{title}</div>
          </div>
          <div className="topbar-right">
            <span className="topbar-date">{now}</span>
          </div>
        </header>
        <main className="page-body">{children}</main>
      </div>
    </div>
  )
}
