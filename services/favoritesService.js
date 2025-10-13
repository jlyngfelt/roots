import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	serverTimestamp,
	setDoc
} from 'firebase/firestore'
import { db } from '../firebase'

export async function addToFavorites(userId, plantId) {
	try {
		await setDoc(doc(db, 'users', userId, 'favorites', plantId), {
			plantId: plantId,
			addedAt: serverTimestamp()
		})
		console.log('Added to favorites!')
	} catch (error) {
		console.error('Error adding to favorites:', error)
		throw error
	}
}

export async function removeFromFavorites(userId, plantId) {
	try {
		await deleteDoc(doc(db, 'users', userId, 'favorites', plantId))
		console.log('Removed from favorites!')
	} catch (error) {
		console.error('Error removing from favorites:', error)
		throw error
	}
}

export async function getUserFavorites(userId) {
	try {
		const querySnapshot = await getDocs(
			collection(db, 'users', userId, 'favorites')
		)
		const favorites = []
		querySnapshot.forEach((doc) => {
			favorites.push(doc.data().plantId)
		})
		return favorites
	} catch (error) {
		console.error('Error getting favorites:', error)
		throw error
	}
}

export async function isPlantFavorited(userId, plantId) {
	try {
		const docSnap = await getDoc(doc(db, 'users', userId, 'favorites', plantId))
		return docSnap.exists()
	} catch (error) {
		console.error('Error checking favorite:', error)
		throw error
	}
}
