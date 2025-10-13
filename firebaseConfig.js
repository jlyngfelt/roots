import { initializeApp } from 'firebase/app'
import { getReactNativePersistence, initializeAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

import AsyncStorage from '@react-native-async-storage/async-storage'

const firebaseConfig = {
	apiKey: 'AIzaSyD6SCHQ-4fUscJS8-UWMJdngtqFQtsJ0zI',
	authDomain: 'roots-cd39a.firebaseapp.com',
	projectId: 'roots-cd39a',
	storageBucket: 'roots-cd39a.firebasestorage.app',
	messagingSenderId: '872631865213',
	appId: '1:872631865213:web:f134fe9fb5cdf2fe4c0614',
	measurementId: 'G-YNGG0LDKX4'
}

const app = initializeApp(firebaseConfig)

export const auth = initializeAuth(app, {
	persistence: getReactNativePersistence(AsyncStorage)
})
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app
