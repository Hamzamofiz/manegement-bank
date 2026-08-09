import { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import { auth } from '../firebase'
import { getAll, setOne } from '../firestoreService'
import { login } from '../store/authSlice'

const ROLES = ['customer', 'employee', 'manager']

const DEMO = {
  customer: { email: 'ahmed@gmail.com',  password: 'ahmed123'   },
  employee: { email: 'ali@bank.com',     password: 'ali123'     },
  manager:  { email: 'manager@bank.com', password: 'manager123' },
}

const DEMO_PROFILES = {
  'ahmed@gmail.com':   { role: 'customer', name: 'Ahmed Khan',  accountNumber: 'ACC-1001', balance: 250000, status: 'active' },
  'sara@gmail.com':    { role: 'customer', name: 'Sara Malik',  accountNumber: 'ACC-1002', balance: 180000, status: 'active' },
  'ali@bank.com':      { role: 'employee', name: 'Ali Raza',    salary: 60000, status: 'active' },
  'fatima@bank.com':   { role: 'employee', name: 'Fatima Noor', salary: 55000, status: 'active' },
  'manager@bank.com':  { role: 'manager',  name: 'Usman Malik', status: 'active' },
}

export default function Login() {
  const dispatch                = useDispatch()
  const [role, setRole]         = useState('customer')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const emailLower = email.toLowerCase().trim()

    try {
      let uid = null

      // Step 1: Firebase Auth - try login, if not exists create
      try {
        const cred = await signInWithEmailAndPassword(auth, emailLower, password)
        uid = cred.user.uid
      } catch (authErr) {
        if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential') {
          // User nahi hai - create karo
          const cred = await createUserWithEmailAndPassword(auth, emailLower, password)
          uid = cred.user.uid
        } else {
          throw authErr
        }
      }

      // Step 2: Firestore mein profile check karo
      const col   = role === 'manager' ? 'managers' : role === 'employee' ? 'employees' : 'customers'
      let users   = await getAll(col, [{ field: 'email', op: '==', value: emailLower }])

      // Step 3: Profile nahi mili - auto create karo
      if (users.length === 0) {
        const profile = DEMO_PROFILES[emailLower]
        if (profile && profile.role === role) {
          await setOne(col, uid, { ...profile, uid, email: emailLower })
          users = await getAll(col, [{ field: 'email', op: '==', value: emailLower }])
        } else if (profile && profile.role !== role) {
          setError(`Ye account "${profile.role}" role ka hai. "${profile.role}" select karo.`)
          setLoading(false)
          return
        } else {
          setError('Account profile nahi mili. Admin se contact karo.')
          setLoading(false)
          return
        }
      }

      dispatch(login({ user: users[0], role }))

    } catch (err) {
      const msgs = {
        'auth/wrong-password':         'Password galat hai.',
        'auth/too-many-requests':      'Zyada attempts. Thodi der baad try karo.',
        'auth/network-request-failed': 'Internet connection check karo.',
        'auth/operation-not-allowed':  'Firebase mein Email/Password enable karo!',
        'auth/weak-password':          'Password kam az kam 6 characters ka hona chahiye.',
        'auth/email-already-in-use':   'Ye email pehle se registered hai.',
      }
      setError(msgs[err.code] || `Error: ${err.code || err.message}`)
    }

    setLoading(false)
  }

  const [showPass, setShowPass] = useState(false)

  const fillDemo = () => {
    setEmail(DEMO[role].email)
    setPassword(DEMO[role].password)
    setError('')
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <div className="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="22" x2="21" y2="22"/>
              <line x1="6" y1="18" x2="6" y2="11"/>
              <line x1="10" y1="18" x2="10" y2="11"/>
              <line x1="14" y1="18" x2="14" y2="11"/>
              <line x1="18" y1="18" x2="18" y2="11"/>
              <polygon points="12 2 20 7 4 7"/>
            </svg>
          </div>
          <h1>Enterprise Banking<br />Management System</h1>
          <p>A secure, role-based digital banking platform for modern financial operations.</p>
        </div>
        <div className="login-features">
          {[
            'Firebase secured authentication',
            'Firestore real-time database',
            'Role-based access control',
            'Structured approval workflows',
          ].map((f) => (
            <div className="login-feature-item" key={f}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {f}
            </div>
          ))}
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-box">
          <h2>Welcome Back</h2>
          <p className="login-sub">Sign in to access your banking portal</p>

          <div className="login-role-tabs">
            {ROLES.map((r) => (
              <button
                key={r}
                className={`role-tab ${role === r ? 'active' : ''}`}
                onClick={() => { setRole(r); setEmail(''); setPassword(''); setError('') }}
                type="button"
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          {error && (
            <div className="login-error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-control"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-control"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: 44 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, display: 'flex' }}
                >
                  {showPass
                    ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>
            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>

          {role !== 'customer' && (
            <div className="demo-creds">
              <div className="demo-creds-title">Demo Credentials — {role}</div>
              <div className="demo-cred-item">Email: <span>{DEMO[role].email}</span></div>
              <div className="demo-cred-item">Password: <span>{DEMO[role].password}</span></div>
              <button
                type="button"
                className="btn btn-outline btn-sm mt-4"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={fillDemo}
              >
                Use Demo Credentials
              </button>
            </div>
          )}

          <div style={{ marginTop: 16, textAlign: 'center', fontSize: 11, color: 'var(--text-muted)' }}>
            Secured by Firebase Authentication + Firestore
          </div>
        </div>
      </div>
    </div>
  )
}
