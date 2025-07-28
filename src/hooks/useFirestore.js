import { useState, useEffect } from 'react'
import { collection, onSnapshot, query, orderBy, getDocs, limit } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'

export const useFirestore = () => {
  const { user, firebaseAvailable } = useAuth()

  const getDocuments = async (collectionPath, orderByField = null, orderDirection = 'desc', limitCount = null) => {
    if (!user || !firebaseAvailable || !db) {
      return []
    }

    try {
      const fullPath = `users/${user.uid}/${collectionPath}`
      const collectionRef = collection(db, fullPath)
      
      let q = collectionRef
      
      if (orderByField) {
        q = query(collectionRef, orderBy(orderByField, orderDirection))
      }
      
      if (limitCount) {
        q = query(q, limit(limitCount))
      }

      const snapshot = await getDocs(q)
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      // If ordering by 'order' field, sort by order and fallback to createdAt
      if (orderByField === 'order') {
        docs.sort((a, b) => {
          const orderA = a.order ?? 999999
          const orderB = b.order ?? 999999
          if (orderA !== orderB) {
            return orderA - orderB
          }
          // Fallback to createdAt if order is the same
          const createdAtA = a.createdAt?.seconds || 0
          const createdAtB = b.createdAt?.seconds || 0
          return createdAtB - createdAtA
        })
      }
      
      return docs
    } catch (error) {
      return []
    }
  }

  return { getDocuments }
}

export const useFirestoreCollection = (collectionPath, orderByField = null, orderDirection = 'desc') => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user, firebaseAvailable } = useAuth()

  useEffect(() => {
    if (!user || !firebaseAvailable) {
      setData([])
      setLoading(false)
      return
    }

    if (!db) {
      setError('Firestore not available')
      setLoading(false)
      return
    }

    try {
      const fullPath = `users/${user.uid}/${collectionPath}`
      const collectionRef = collection(db, fullPath)
      
      const q = orderByField 
        ? query(collectionRef, orderBy(orderByField, orderDirection))
        : collectionRef

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const docs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          
          // If ordering by 'order' field, sort by order and fallback to createdAt
          if (orderByField === 'order') {
            docs.sort((a, b) => {
              const orderA = a.order ?? 999999
              const orderB = b.order ?? 999999
              if (orderA !== orderB) {
                return orderA - orderB
              }
              // Fallback to createdAt if order is the same
              const createdAtA = a.createdAt?.seconds || 0
              const createdAtB = b.createdAt?.seconds || 0
              return createdAtB - createdAtA
            })
          }
          
          setData(docs)
          setLoading(false)
          setError(null)
        },
        (err) => {
          setError(err)
          setLoading(false)
        }
      )

      return unsubscribe
    } catch (err) {
      setError(err)
      setLoading(false)
    }
  }, [user, firebaseAvailable, collectionPath, orderByField, orderDirection])

  return { data, loading, error }
} 