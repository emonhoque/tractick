import { createContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

const AuthContext = createContext(null)

export { AuthContext }

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [firebaseAvailable, setFirebaseAvailable] = useState(true)

  useEffect(() => {
    let unsubscribe
    try {
      // Check if Firebase is properly configured
      if (!auth || !db) {
        throw new Error('Firebase not available')
      }

      unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user)
        setLoading(false)

        if (user) {
          try {
            const userRef = doc(db, 'users', user.uid)
            await setDoc(userRef, {
              uid: user.uid,
              name: user.displayName || '',
              email: user.email || '',
              photoURL: user.photoURL || '',
              lastLogin: new Date().toISOString()
            }, { merge: true })
          } catch {
            // Silently handle user document update errors
            setError('Failed to update user profile')
          }
        }
      })
    } catch {
      setFirebaseAvailable(false)
      setLoading(false)
      setError('Firebase configuration error')
    }

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  const signInWithGoogle = async () => {
    if (!firebaseAvailable) {
      throw new Error('Firebase not available')
    }
    try {
      setError(null)
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const signInWithEmail = async (email, password) => {
    if (!firebaseAvailable) {
      throw new Error('Firebase not available')
    }
    try {
      setError(null)
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const signUpWithEmail = async (email, password, nickname = '') => {
    if (!firebaseAvailable) {
      throw new Error('Firebase not available')
    }
    try {
      setError(null)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update the user profile with nickname
      if (userCredential.user && nickname) {
        const userRef = doc(db, 'users', userCredential.user.uid)
        await setDoc(userRef, {
          uid: userCredential.user.uid,
          name: nickname,
          email: userCredential.user.email || '',
          photoURL: userCredential.user.photoURL || '',
          lastLogin: new Date().toISOString()
        }, { merge: true })
      }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const logout = async () => {
    if (!firebaseAvailable) {
      setUser(null)
      return
    }
    try {
      setError(null)
      await signOut(auth)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const value = {
    user,
    loading,
    error,
    firebaseAvailable,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

 