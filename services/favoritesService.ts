import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export async function addToFavorites(userId: string, plantId: string): Promise<void> {
  try {
    await setDoc(doc(db, "users", userId, "favorites", plantId), {
      plantId: plantId,
      addedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw error;
  }
}

export async function removeFromFavorites(userId: string, plantId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "users", userId, "favorites", plantId));
  } catch (error) {
    console.error("Error removing from favorites:", error);
    throw error;
  }
}

export async function getUserFavorites(userId: string): Promise<string[]> {
  try {
    const querySnapshot = await getDocs(
      collection(db, "users", userId, "favorites"),
    );
    const favorites: string[] = [];
    querySnapshot.forEach((doc) => {
      favorites.push(doc.data().plantId);
    });
    return favorites;
  } catch (error) {
    console.error("Error getting favorites:", error);
    throw error;
  }
}

export async function isPlantFavorited(userId: string, plantId: string): Promise<boolean> {
  try {
    const docSnap = await getDoc(
      doc(db, "users", userId, "favorites", plantId),
    );
    return docSnap.exists();
  } catch (error) {
    console.error("Error checking favorite:", error);
    throw error;
  }
}

export async function getFavoriteCount(plantId: string): Promise<number> {
  try {
    let count = 0;
    const usersSnapshot = await getDocs(collection(db, "users"));
    
    for (const userDoc of usersSnapshot.docs) {
      const favoriteDoc = await getDoc(
        doc(db, "users", userDoc.id, "favorites", plantId)
      );
      if (favoriteDoc.exists()) {
        count++;
      }
    }
    
    return count;
  } catch (error) {
    console.error("Error getting favorite count:", error);
    throw error;
  }
}