import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  runTransaction,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Transfer } from "../interfaces/index"

//5 tecken
function generateCode(): string {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

// Skapa en ny transfer (när någon ger bort en stickling)
export async function createTransfer(
  plantId: string,
  plantName: string,
  giverId: string
): Promise<string> {
  try {
    const code = generateCode();

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24h

    const transferData = {
      code,
      plantId,
      plantName,
      giverId,
      credits: 100,
      createdAt: serverTimestamp(),
      expiresAt: Timestamp.fromDate(expiresAt),
      used: false,
    };
    await setDoc(doc(db, "transfers", code), transferData);

    return code;
  } catch (error: any) {
    console.error("❌ Error message:", error.message);
    throw error;
  }
}

export async function redeemTransfer(
  code: string,
  receiverId: string
): Promise<{ success: boolean; error?: string; credits?: number }> {
  try {
    const result = await runTransaction(db, async (transaction) => {
      const transferRef = doc(db, "transfers", code);
      const transferDoc = await transaction.get(transferRef);

      // Validering
      if (!transferDoc.exists()) {
        throw new Error("Ogiltig kod");
      }

      const transferData = transferDoc.data() as Transfer;
      console.log("🔍 Transfer data:", transferData);

      if (transferData.used) {
        throw new Error("Koden är redan använd");
      }

      if (new Date() > transferData.expiresAt.toDate()) {
        throw new Error("Koden har gått ut");
      }

      if (transferData.giverId === receiverId) {
        throw new Error("Du kan inte lösa in din egen kod");
      }

      // Tilldela credits till givaren
      const giverRef = doc(db, "users", transferData.giverId);
      const giverDoc = await transaction.get(giverRef);
      console.log("Giver doc exists:", giverDoc.exists());
      
      const currentCredits = giverDoc.data()?.credits || 0;
      console.log("Current credits:", currentCredits);

      transaction.update(giverRef, {
        credits: currentCredits + transferData.credits,
      });

      // Markera transfer som använd
      transaction.update(transferRef, {
        used: true,
        redeemedBy: receiverId,
        redeemedAt: serverTimestamp(),
      });

      console.log("Transaction complete");
      return { credits: transferData.credits };
    });

    return { success: true, credits: result.credits };
  } catch (error: any) {
    console.error("❌ Error message:", error.message);
    return { success: false, error: error.message };
  }
}


export async function getTransfer(code: string): Promise<Transfer | null> {
  try {
    const docSnap = await getDoc(doc(db, "transfers", code));
    if (docSnap.exists()) {
      return docSnap.data() as Transfer;
    }
    return null;
  } catch (error) {
    console.error("Error getting transfer:", error);
    throw error;
  }
}
