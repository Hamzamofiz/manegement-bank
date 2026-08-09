import {
  collection, doc, getDocs, getDoc,
  addDoc, updateDoc, deleteDoc,
  query, where, setDoc
} from "firebase/firestore"
import { db } from "./firebase"

// GET all docs from a collection with optional filters
// filters = [{ field, op, value }]
export const getAll = async (col, filters = []) => {
  let q = collection(db, col)
  if (filters.length > 0) {
    q = query(q, ...filters.map((f) => where(f.field, f.op, f.value)))
  }
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

// GET single doc by id
export const getOne = async (col, id) => {
  const snap = await getDoc(doc(db, col, id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

// ADD new doc (auto id)
export const addOne = async (col, data) => {
  const ref = await addDoc(collection(db, col), data)
  return { id: ref.id, ...data }
}

// SET doc with custom id
export const setOne = async (col, id, data) => {
  await setDoc(doc(db, col, id), data)
  return { id, ...data }
}

// UPDATE doc
export const updateOne = async (col, id, data) => {
  await updateDoc(doc(db, col, id), data)
}

// DELETE doc
export const deleteOne = async (col, id) => {
  await deleteDoc(doc(db, col, id))
}
