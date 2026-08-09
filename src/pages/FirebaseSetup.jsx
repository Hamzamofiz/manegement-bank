import { useState } from 'react'
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { setOne } from '../firestoreService'

const USERS = [
  { email: 'ahmed@gmail.com',  password: 'ahmed123',   role: 'customer', name: 'Ahmed Khan',   accountNumber: 'ACC-1001', balance: 250000, status: 'active' },
  { email: 'sara@gmail.com',   password: 'sara123',    role: 'customer', name: 'Sara Malik',   accountNumber: 'ACC-1002', balance: 180000, status: 'active' },
  { email: 'ali@bank.com',     password: 'ali123',     role: 'employee', name: 'Ali Raza',     salary: 60000, status: 'active' },
  { email: 'fatima@bank.com',  password: 'fatima123',  role: 'employee', name: 'Fatima Noor',  salary: 55000, status: 'active' },
  { email: 'manager@bank.com', password: 'manager123', role: 'manager',  name: 'Usman Malik' },
]

export default function FirebaseSetup() {
  const [results, setResults] = useState([])
  const [running, setRunning] = useState(false)
  const [done, setDone]       = useState(false)

  const registerAll = async () => {
    setRunning(true)
    const log = []

    for (const u of USERS) {
      try {
        // 1. Firebase Auth mein register karo
        const cred = await createUserWithEmailAndPassword(auth, u.email, u.password)
        const uid = cred.user.uid

        // 2. Firestore mein profile save karo (uid as doc id)
        const col = u.role === 'manager' ? 'managers' : u.role === 'employee' ? 'employees' : 'customers'
        const { password, ...profileData } = u
        await setOne(col, uid, { ...profileData, uid })

        await signOut(auth)
        log.push({ name: u.name, email: u.email, role: u.role, status: 'success', msg: 'Registered' })

      } catch (err) {
        if (err.code === 'auth/email-already-in-use') {
          log.push({ name: u.name, email: u.email, role: u.role, status: 'info', msg: 'Already exists' })
        } else if (err.code === 'auth/operation-not-allowed') {
          log.push({ name: u.name, email: u.email, role: u.role, status: 'error', msg: 'Email/Password NOT enabled!' })
          setResults([...log])
          setRunning(false)
          return
        } else {
          log.push({ name: u.name, email: u.email, role: u.role, status: 'error', msg: err.code })
        }
      }
      setResults([...log])
    }

    // Firestore mein bankSummary bhi save karo
    await setOne('bankSummary', 'main', { totalBalance: 15000000, totalLoansIssued: 6500000 })

    setRunning(false)
    setDone(true)
  }

  const colors = {
    success: { bg: 'rgba(22,163,74,0.08)',  border: 'rgba(22,163,74,0.25)',  color: '#16a34a' },
    info:    { bg: 'rgba(37,99,168,0.08)',  border: 'rgba(37,99,168,0.25)',  color: '#2563a8' },
    error:   { bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.25)', color: '#dc2626' },
    pending: { bg: '#f8fafc', border: '#e2e8f0', color: '#94a3b8' },
  }

  const roleColor = { customer: '#2563a8', employee: '#16a34a', manager: '#c9a84c' }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 36, maxWidth: 520, width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, background: '#1a3c5e', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="28" height="28">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#1e293b', marginBottom: 6 }}>Firebase Setup</div>
          <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
            Sab users Firebase Auth + Firestore mein register honge.<br/>
            <strong style={{ color: '#dc2626' }}>Sirf ek baar chalao.</strong>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {USERS.map((u, i) => {
            const r = results[i]
            const c = r ? colors[r.status] : colors.pending
            return (
              <div key={u.email} style={{ padding: '12px 16px', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: c.bg, border: `1px solid ${c.border}` }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: '#1e293b' }}>{u.name}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: `${roleColor[u.role]}20`, color: roleColor[u.role], textTransform: 'uppercase' }}>{u.role}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{u.email}</div>
                </div>
                <span style={{ fontWeight: 700, fontSize: 12, color: c.color }}>
                  {r ? r.msg : 'Pending'}
                </span>
              </div>
            )
          })}
        </div>

        {done ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#16a34a', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
              Sab users register ho gaye! Firebase ready hai.
            </div>
            <a href="/" style={{ display: 'inline-block', padding: '12px 32px', background: '#1a3c5e', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
              Login Page pe Jao
            </a>
          </div>
        ) : (
          <button
            onClick={registerAll}
            disabled={running}
            style={{ width: '100%', padding: 13, background: running ? '#94a3b8' : '#1a3c5e', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: running ? 'not-allowed' : 'pointer' }}
          >
            {running ? 'Registering...' : 'Register All Users in Firebase'}
          </button>
        )}
      </div>
    </div>
  )
}
