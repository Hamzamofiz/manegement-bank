import { useState } from 'react'
import Layout from '../../components/Layout'
import ManagerDashboard from './ManagerDashboard'
import CustomerList from '../employee/CustomerList'
import EmployeeManagement from './EmployeeManagement'
import LoanRequests from '../employee/LoanRequests'
import TransactionRequests from '../employee/TransactionRequests'

const titles = {
  dashboard: 'Dashboard',
  customers: 'Customer Management',
  employees: 'Employee Management',
  'loan-requests': 'High-Value Loan Requests',
  'transaction-requests': 'Transaction Oversight',
}

export default function ManagerApp() {
  const [page, setPage] = useState('dashboard')

  const renderPage = () => {
    if (page === 'dashboard') return <ManagerDashboard onNavigate={setPage} />
    if (page === 'customers') return <CustomerList />
    if (page === 'employees') return <EmployeeManagement />
    if (page === 'loan-requests') return <LoanRequests managerView={true} />
    if (page === 'transaction-requests') return <TransactionRequests />
    return <ManagerDashboard onNavigate={setPage} />
  }

  return (
    <Layout activePage={page} onNavigate={setPage} title={titles[page] || 'Dashboard'}>
      {renderPage()}
    </Layout>
  )
}
