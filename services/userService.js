import {
	doc,
	getDoc,
	serverTimestamp,
	setDoc,
	updateDoc
} from 'firebase/firestore'
import { db } from '../firebaseConfig'

export async function createUserProfile(uid, userData) {
	try {
		await setDoc(doc(db, 'users', uid), {
			username: userData.username,
			postalCode: userData.postalCode || '',
			bio: userData.bio || '',
			profileImageUrl: userData.profileImageUrl || '',
			credits: 0,
			createdAt: serverTimestamp()
		})
		console.log('User profile created!')
	} catch (error) {
		console.error('Error creating user profile:', error)
		throw error
	}
}

export async function getUserProfile(uid) {
	try {
		const docSnap = await getDoc(doc(db, 'users', uid))
		if (docSnap.exists()) {
			return { id: docSnap.id, ...docSnap.data() }
		} else {
			console.log('No user found')
			return null
		}
	} catch (error) {
		console.error('Error getting user:', error)
		throw error
	}
}

export async function updateUserProfile(uid, updates) {
	try {
		await updateDoc(doc(db, 'users', uid), updates)
		console.log('Profile updated!')
	} catch (error) {
		console.error('Error updating profile:', error)
		throw error
	}
}

export async function addCredits(uid, amount) {
	try {
		const userRef = doc(db, 'users', uid)
		const userSnap = await getDoc(userRef)
		const currentCredits = userSnap.data().credits || 0

		await updateDoc(userRef, {
			credits: currentCredits + amount
		})
		console.log(`Added ${amount} credits!`)
	} catch (error) {
		console.error('Error adding credits:', error)
		throw error
	}
}
