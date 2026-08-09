import { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase'
import { getAll, setOne } from '../../firestoreService'
import { showToast } from '../../components/Toast'
import { useSelector } from 'react-redux'

export default function CreateCustomer({ onBack }) {
  const { user: currentUser } = useSelector((s) => s.auth)
  const [form, setForm]           = useState({ name: '', email: '', password: '', balance: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      // 1. Create in Firebase Auth
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password)
      const uid  = cred.user.uid

      // 2. Generate account number
      const existing = await getAll('customers')
      const accNum   = `ACC-${1001 + existing.length}`

      // 3. Save profile in Firestore
      await setOne('customers', uid, {
        uid,
        name:          form.name,
        email:         form.email,
        accountNumber: accNum,
        balance:       Number(form.balance) || 0,
        status:        'active',
        role:          'customer',
        createdBy:     currentUser.id,
      })

      // 4. Sign back in as current employee (re-auth)
      showToast('Customer account created successfully', 'success')
      setForm({ name: '', email: '', password: '', balance: '' })
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        showToast('This email is already registered', 'error')
      } else {
        showToast('Error creating account: ' + err.message, 'error')
      }
    }
    setSubmitting(false)
  }

  return (
    <>
      <div className="page-header">
        <div><h2>Create Customer Account</h2><p>Register a new bank customer</p></div>
        <button className="btn btn-outline" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
      </div>
      <div className="card" style={{ maxWidth: 520 }}>
        <div className="card-header"><span className="card-title">New Customer Details</span></div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-control" type="text" placeholder="e.g. Ahmed Khan" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required/>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-control" type="email" placeholder="customer@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required/>
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-control" type="text" placeholder="Min 6 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6}/>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Initial Balance (PKR)</label>
              <input className="form-control" type="number" placeholder="0" value={form.balance} onChange={(e) => setForm({ ...form, balance: e.target.value })} min="0"/>
            </div>
            <div style={{ padding: '10px 14px', background: 'rgba(37,99,168,0.06)', borderRadius: 8, border: '1px solid rgba(37,99,168,0.15)', fontSize: 12, color: '#1e40af', marginBottom: 16 }}>
              Account number will be auto-generated. Customer can log in immediately after creation.
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Customer Account'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
