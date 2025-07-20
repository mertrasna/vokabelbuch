import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase';

// Add a new word pair
export const addWord = async (userId, germanWord, englishWord) => {
  try {
    const docRef = await addDoc(collection(db, 'users', userId, 'words'), {
      german: germanWord.trim(),
      english: englishWord.trim(),
      createdAt: new Date(),
      lastReviewed: null,
      reviewCount: 0
    });
    return docRef;
  } catch (error) {
    console.error("Error adding word:", error);
    throw error;
  }
};

// Get all words for a user
export const getUserWords = async (userId) => {
  try {
    const q = query(
      collection(db, 'users', userId, 'words'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting words:", error);
    throw error;
  }
};

// Update a word
export const updateWord = async (userId, wordId, germanWord, englishWord) => {
  try {
    const wordRef = doc(db, 'users', userId, 'words', wordId);
    await updateDoc(wordRef, {
      german: germanWord.trim(),
      english: englishWord.trim(),
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error updating word:", error);
    throw error;
  }
};

// Delete a word
export const deleteWord = async (userId, wordId) => {
  try {
    await deleteDoc(doc(db, 'users', userId, 'words', wordId));
  } catch (error) {
    console.error("Error deleting word:", error);
    throw error;
  }
}; 