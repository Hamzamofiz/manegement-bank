import Sidebar from './Sidebar'

export default function Layout({ activePage, onNavigate, title, children }) {
  const now = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-title">{title}</div>
          <div className="topbar-right">
            <span className="topbar-date">{now}</span>
          </div>
        </header>
        <main className="page-body">{children}</main>
      </div>
    </div>
  )
}
