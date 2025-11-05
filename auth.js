import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  verifyBeforeUpdateEmail,
  updatePassword,
} from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export const signUp = async (email, password, userData = {}) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    
    const user = userCredential.user;
    
    await setDoc(doc(db, 'users', user.uid), {
      email: email,
      createdAt: new Date(),
      emailVerified: false,
      ...userData 
    });
    
    await sendEmailVerification(user);
    
    return user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (!userCredential.user.emailVerified) {
      await signOut(auth);
      throw new Error("EMAIL_NOT_VERIFIED");
    }
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error("No user logged in");
    }

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    await reauthenticateWithCredential(user, credential);

    await updatePassword(user, newPassword);
    console.log("Password updated successfully!");
  } catch (error) {
    throw error;
  }
};

export const changeEmail = async (currentPassword, newEmail) => {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error("No user logged in");
    }

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    await reauthenticateWithCredential(user, credential);

   await verifyBeforeUpdateEmail(user, newEmail);

    console.log("Email updated successfully! Verification email sent.");
  } catch (error) {
    throw error;
  }
};

export const checkEmailVerified = async () => {
  const user = auth.currentUser;
  if (user) {
    await user.reload(); 
    return user.emailVerified;
  }
  return false;
};

export const getCurrentUser = () => {
  return auth.currentUser;
};