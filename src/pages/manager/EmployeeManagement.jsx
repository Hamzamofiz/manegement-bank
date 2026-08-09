import { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase'
import { getAll, setOne, updateOne, deleteOne } from '../../firestoreService'
import { showToast } from '../../components/Toast'

const empty = { name: '', email: '', password: '', salary: '' }

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(empty)
  const [submitting, setSubmitting] = useState(false)

  const load = () => getAll('employees').then((d) => { setEmployees(d); setLoading(false) })
  useEffect(() => { load() }, [])

  const openAdd  = () => { setEditing(null); setForm(empty); setShowModal(true) }
  const openEdit = (emp) => { setEditing(emp); setForm({ name: emp.name, email: emp.email, password: '', salary: emp.salary }); setShowModal(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editing) {
        const updates = { name: form.name, email: form.email, salary: Number(form.salary) }
        await updateOne('employees', editing.id, updates)
        showToast('Employee updated successfully', 'success')
      } else {
        // Create in Firebase Auth
        const cred = await createUserWithEmailAndPassword(auth, form.email, form.password)
        const uid  = cred.user.uid
        // Save in Firestore
        await setOne('employees', uid, {
          uid,
          name:   form.name,
          email:  form.email,
          salary: Number(form.salary),
          role:   'employee',
          status: 'active',
        })
        showToast('Employee created successfully', 'success')
      }
      setShowModal(false)
      setLoading(true)
      load()
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        showToast('This email is already registered', 'error')
      } else {
        showToast('Error: ' + err.message, 'error')
      }
    }
    setSubmitting(false)
  }

  const handleDelete = async (emp) => {
    if (!window.confirm(`Delete employee ${emp.name}?`)) return
    await deleteOne('employees', emp.id)
    showToast('Employee removed', 'error')
    setLoading(true)
    load()
  }

  if (loading) return <div className="loading-spinner"><div className="spinner"/></div>

  return (
    <>
      <div className="page-header">
        <div><h2>Employee Management</h2><p>Manage bank staff accounts</p></div>
        <button className="btn btn-primary" onClick={openAdd}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Employee
        </button>
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">Employees ({employees.length})</span></div>
        {employees.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <p>No employees found</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Salary</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {employees.map((emp, i) => (
                  <tr key={emp.id}>
                    <td className="text-muted">{i + 1}</td>
                    <td className="fw-600">{emp.name}</td>
                    <td className="text-muted">{emp.email}</td>
                    <td className="fw-600">PKR {Number(emp.salary).toLocaleString()}</td>
                    <td><span className={`badge ${emp.status === 'active' ? 'badge-success' : 'badge-danger'}`}>{emp.status}</span></td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(emp)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(emp)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Edit Employee' : 'Add New Employee'}</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-control" type="text" placeholder="Employee name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required/>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-control" type="email" placeholder="employee@bank.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required disabled={!!editing}/>
                  </div>
                  {!editing && (
                    <div className="form-group">
                      <label className="form-label">Password</label>
                      <input className="form-control" type="text" placeholder="Min 6 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6}/>
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Monthly Salary (PKR)</label>
                  <input className="form-control" type="number" placeholder="e.g. 60000" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} required min="0"/>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : editing ? 'Update Employee' : 'Create Employee'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
