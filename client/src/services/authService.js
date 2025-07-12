import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.js';

export async function loginUser(email, password) {
   try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
   } 
    
} 