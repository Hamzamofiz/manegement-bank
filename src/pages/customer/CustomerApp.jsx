import { useState } from 'react'
import Layout from '../../components/Layout'
import CustomerDashboard from './CustomerDashboard'
import CustomerTransactions from './CustomerTransactions'
import CustomerLoans from './CustomerLoans'
import RequestForm from './RequestForm'

const titles = {
  dashboard: 'Dashboard',
  transactions: 'Transaction History',
  loans: 'My Loans',
  deposit: 'Deposit Request',
  withdraw: 'Withdrawal Request',
  donation: 'Donation Request',
  'request-loan': 'Request Loan',
}

export default function CustomerApp() {
  const [page, setPage] = useState('dashboard')

  const renderPage = () => {
    if (page === 'dashboard') return <CustomerDashboard onNavigate={setPage} />
    if (page === 'transactions') return <CustomerTransactions />
    if (page === 'loans' || page === 'request-loan') return <CustomerLoans />
    if (['deposit', 'withdraw', 'donation'].includes(page)) return <RequestForm type={page} onBack={() => setPage('dashboard')} />
    return <CustomerDashboard onNavigate={setPage} />
  }

  const navPage = ['deposit', 'withdraw', 'donation', 'request-loan'].includes(page) ? 'dashboard' : page

  return (
    <Layout activePage={navPage} onNavigate={setPage} title={titles[page] || 'Dashboard'}>
      {renderPage()}
    </Layout>
  )
}
