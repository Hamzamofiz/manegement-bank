import { useSelector } from 'react-redux'
import Login from './pages/Login'
import CustomerApp from './pages/customer/CustomerApp'
import EmployeeApp from './pages/employee/EmployeeApp'
import ManagerApp from './pages/manager/ManagerApp'
import FirebaseSetup from './pages/FirebaseSetup'
import Toast from './components/Toast'

export default function App() {
  const { isAuthenticated, role } = useSelector((s) => s.auth)

  // One-time setup page — visit http://localhost:5173/setup
  if (window.location.pathname === '/setup') return <FirebaseSetup />

  const renderApp = () => {
    if (!isAuthenticated) return <Login />
    if (role === 'customer') return <CustomerApp />
    if (role === 'employee') return <EmployeeApp />
    if (role === 'manager') return <ManagerApp />
    return <Login />
  }

  return (
    <>
      {renderApp()}
      <Toast />
    </>
  )
}
