import { useState } from 'react'
import Layout from '../../components/Layout'
import EmployeeDashboard from './EmployeeDashboard'
import CustomerList from './CustomerList'
import CreateCustomer from './CreateCustomer'
import LoanRequests from './LoanRequests'
import TransactionRequests from './TransactionRequests'

const titles = {
  dashboard: 'Dashboard',
  customers: 'Customer List',
  'create-customer': 'Create Customer',
  'loan-requests': 'Loan Requests',
  'transaction-requests': 'Transaction Requests',
}

export default function EmployeeApp() {
  const [page, setPage] = useState('dashboard')

  const renderPage = () => {
    if (page === 'dashboard') return <EmployeeDashboard onNavigate={setPage} />
    if (page === 'customers') return <CustomerList />
    if (page === 'create-customer') return <CreateCustomer onBack={() => setPage('customers')} />
    if (page === 'loan-requests') return <LoanRequests />
    if (page === 'transaction-requests') return <TransactionRequests />
    return <EmployeeDashboard onNavigate={setPage} />
  }

  return (
    <Layout activePage={page} onNavigate={setPage} title={titles[page] || 'Dashboard'}>
      {renderPage()}
    </Layout>
  )
}
