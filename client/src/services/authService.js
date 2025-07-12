import { signInWithEmailAndPassword } from 'firebase/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth,} from '../firebase.js'; // Importing Firebase auth and Firestore // db
// import { setDoc, doc } from 'firebase/firestore'; // Uncomment if you want to store user data in Firestore

export async function loginUser(email, password) {
   try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
   } 
} 

export async function registerUser(email, username, password) {
    try {
        const userCredintial = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredintial.user;

        // Store user data in Firestore
        // await setDoc(doc(db, 'users', user.uid), {
//   email,
//   username,
// });

        return user;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
}