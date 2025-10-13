import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
	where
} from 'firebase/firestore'
import { db } from '../firebaseConfig'

export async function createPlant(userId, plantData) {
	try {
		const plantRef = doc(collection(db, 'plants'))
		await setDoc(plantRef, {
			name: plantData.name,
			description: plantData.description,
			readyToAdopt: plantData.readyToAdopt || false,
			userId: userId,
			categoryId: plantData.categoryId,
			imageUrl: plantData.imageUrl || '',
			createdAt: serverTimestamp(),
			adoptedBy: null
		})
		console.log('Plant created!')
		return plantRef.id
	} catch (error) {
		console.error('Error creating plant:', error)
		throw error
	}
}

export async function getUserPlants(userId) {
	try {
		const q = query(collection(db, 'plants'), where('userId', '==', userId))
		const querySnapshot = await getDocs(q)
		const plants = []
		querySnapshot.forEach((doc) => {
			plants.push({ id: doc.id, ...doc.data() })
		})
		return plants
	} catch (error) {
		console.error('Error getting user plants:', error)
		throw error
	}
}

export async function getAvailablePlants() {
	try {
		const q = query(collection(db, 'plants'), where('readyToAdopt', '==', true))
		const querySnapshot = await getDocs(q)
		const plants = []
		querySnapshot.forEach((doc) => {
			plants.push({ id: doc.id, ...doc.data() })
		})
		return plants
	} catch (error) {
		console.error('Error getting available plants:', error)
		throw error
	}
}

export async function getPlantById(plantId) {
	try {
		const docSnap = await getDoc(doc(db, 'plants', plantId))
		if (docSnap.exists()) {
			return { id: docSnap.id, ...docSnap.data() }
		} else {
			console.log('No plant found')
			return null
		}
	} catch (error) {
		console.error('Error getting plant:', error)
		throw error
	}
}

export async function updatePlant(plantId, updates) {
	try {
		await updateDoc(doc(db, 'plants', plantId), updates)
		console.log('Plant updated!')
	} catch (error) {
		console.error('Error updating plant:', error)
		throw error
	}
}

export async function deletePlant(plantId) {
	try {
		await deleteDoc(doc(db, 'plants', plantId))
		console.log('Plant deleted!')
	} catch (error) {
		console.error('Error deleting plant:', error)
		throw error
	}
}
