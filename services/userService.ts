import {
  doc,
  getDoc,
  serverTimestamp,
  getDocs,
  updateDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { UserData } from "../interfaces/index"


export async function createUserProfile(uid: string, userData: UserData): Promise<void> {
  try {

    const isAvailable = await isUsernameAvailable(userData.username);
    if (!isAvailable) {
      throw new Error("USERNAME_TAKEN");
    }

    await updateDoc(doc(db, "users", uid), {
      username: userData.username.toLowerCase(),
      postalCode: userData.postalCode || "",
      lon: userData.lon || "",
      lat: userData.lat|| "",
      bio: userData.bio || "",
      profileImageUrl: userData.profileImageUrl || "",
      credits: 0,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
}

export async function getUserProfile(uid: string): Promise<any> {
  try {
    const docSnap = await getDoc(doc(db, "users", uid));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
}

export async function updateUserProfile(uid: string, updates: Partial<UserData>): Promise<void> {
  try {
        if (updates.username) {
      const isAvailable = await isUsernameAvailable(updates.username, uid);
      if (!isAvailable) {
        throw new Error("USERNAME_TAKEN");
      }
      updates.username = updates.username.toLowerCase();
    }

    await updateDoc(doc(db, "users", uid), updates);
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}

export async function isUsernameAvailable(username: string, currentUserId?: string): Promise<boolean> {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username.toLowerCase()));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return true;
    }

    if (currentUserId) {
      const existingDoc = querySnapshot.docs[0];
      return existingDoc.id === currentUserId;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking username availability:", error);
    throw error;
  }
}

export async function addCredits(uid: string, amount: number): Promise<void> {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    const currentCredits = userSnap.data()?.credits || 0;

    await updateDoc(userRef, {
      credits: currentCredits + amount,
    });
  } catch (error) {
    console.error("Error adding credits:", error);
    throw error;
  }
}