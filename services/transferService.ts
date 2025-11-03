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

    await setDoc(doc(db, "transfers", code), {
      code,
      plantId,
      plantName,
      giverId,
      credits: 100,
      createdAt: serverTimestamp(),
      expiresAt: Timestamp.fromDate(expiresAt),
      used: false,
    });

    console.log("Transfer created with code:", code);
    return code;
  } catch (error) {
    console.error("Error creating transfer:", error);
    throw error;
  }
}

// Validera och lös in en transfer-kod
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
      const currentCredits = giverDoc.data()?.credits || 0;

      transaction.update(giverRef, {
        credits: currentCredits + transferData.credits,
      });

      // Markera transfer som använd
      transaction.update(transferRef, {
        used: true,
        redeemedBy: receiverId,
        redeemedAt: serverTimestamp(),
      });

      // Spara i historik (optional men rekommenderat)
      // const historyRef = doc(db, "transactions", `${code}_${Date.now()}`);
      // transaction.set(historyRef, {
      //   type: "plant_transfer",
      //   transferCode: code,
      //   plantId: transferData.plantId,
      //   plantName: transferData.plantName,
      //   giverId: transferData.giverId,
      //   receiverId: receiverId,
      //   credits: transferData.credits,
      //   timestamp: serverTimestamp(),
      // });

      return { credits: transferData.credits };
    });

    return { success: true, credits: result.credits };
  } catch (error: any) {
    console.error("Error redeeming transfer:", error);
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

// Hämta alla aktiva transfers för en användare
export async function getUserTransfers(userId: string): Promise<Transfer[]> {
  // Detta kan du implementera senare med en query
  // För nu kan du bara returnera en tom array
  return [];
}