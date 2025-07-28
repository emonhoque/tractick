import { collection, getDocs, doc, updateDoc, writeBatch } from 'firebase/firestore'
import { db } from '../lib/firebase'

export const migrateClockOrder = async (userId) => {
  if (!userId || !db) return

  try {
    const clocksRef = collection(db, `users/${userId}/clocks`)
    const snapshot = await getDocs(clocksRef)
    
    const clocks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Filter clocks that don't have an order field
    const clocksWithoutOrder = clocks.filter(clock => clock.order === undefined)
    
    if (clocksWithoutOrder.length === 0) {
      return
    }

    const batch = writeBatch(db)
    
    // Add order field based on createdAt timestamp
    clocksWithoutOrder.forEach((clock, index) => {
      const clockRef = doc(db, `users/${userId}/clocks/${clock.id}`)
      const order = clock.createdAt?.seconds ? clock.createdAt.seconds * 1000 : Date.now() + index
      batch.update(clockRef, { order })
    })

    await batch.commit()
  } catch (error) {
    console.error('Migration failed:', error)
  }
} 