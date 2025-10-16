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
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

interface PlantData {
  name: string;
  description?: string;
  readyToAdopt?: boolean;
  categoryId: string;
  imageUrl?: string;
  imageUrls?: string[];
}

interface Plant {
  id: string;
  name: string;
  description?: string;
  readyToAdopt: boolean;
  userId: string;
  categoryId: string;
  imageUrl: string;
  createdAt: any;
  adoptedBy: string | null;
  imageUrls: string[];
}

export async function createPlant(userId: string, plantData: PlantData): Promise<string> {
  try {
    const plantRef = doc(collection(db, "plants"));
    await setDoc(plantRef, {
      name: plantData.name,
      description: plantData.description,
      readyToAdopt: plantData.readyToAdopt || false,
      userId: userId,
      categoryId: plantData.categoryId,
      imageUrl: plantData.imageUrl || "",
      createdAt: serverTimestamp(),
      adoptedBy: null,
      imageUrls: plantData.imageUrls || [],
    });
    console.log("Plant created!");
    return plantRef.id;
  } catch (error) {
    console.error("Error creating plant:", error);
    throw error;
  }
}

export async function getUserPlants(userId: string): Promise<Plant[]> {
  try {
    const q = query(collection(db, "plants"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const plants: Plant[] = [];
    querySnapshot.forEach((doc) => {
      plants.push({ id: doc.id, ...doc.data() } as Plant);
    });
    return plants;
  } catch (error) {
    console.error("Error getting user plants:", error);
    throw error;
  }
}

export async function getAvailablePlants(): Promise<Plant[]> {
  try {
    const q = query(
      collection(db, "plants"),
      where("readyToAdopt", "==", true)
    );
    const querySnapshot = await getDocs(q);
    const plants: Plant[] = [];
    querySnapshot.forEach((doc) => {
      plants.push({ id: doc.id, ...doc.data() } as Plant);
    });
    return plants;
  } catch (error) {
    console.error("Error getting available plants:", error);
    throw error;
  }
}

export async function getPlantById(plantId: string): Promise<Plant | null> {
  try {
    const docSnap = await getDoc(doc(db, "plants", plantId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Plant;
    } else {
      console.log("No plant found");
      return null;
    }
  } catch (error) {
    console.error("Error getting plant:", error);
    throw error;
  }
}

export async function updatePlant(plantId: string, updates: Partial<PlantData>): Promise<void> {
  try {
    await updateDoc(doc(db, "plants", plantId), updates);
    console.log("Plant updated!");
  } catch (error) {
    console.error("Error updating plant:", error);
    throw error;
  }
}

export async function deletePlant(plantId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "plants", plantId));
    console.log("Plant deleted!");
  } catch (error) {
    console.error("Error deleting plant:", error);
    throw error;
  }
}

export async function getOtherUsersPlants(userId: string): Promise<Plant[]> {
  try {
    const q = query(collection(db, "plants"), where("userId", "!=", userId));
    const querySnapshot = await getDocs(q);
    const plants: Plant[] = [];
    querySnapshot.forEach((doc) => {
      plants.push({ id: doc.id, ...doc.data() } as Plant);
    });
    return plants;
  } catch (error) {
    console.error("Error getting other users' plants:", error);
    throw error;
  }
}