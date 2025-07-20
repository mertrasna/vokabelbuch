import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase';
import { getUserWords } from './wordService.js';

// Generate a random quiz from user's words
export const generateQuiz = async (userId, questionCount = 10) => {
  try {
    const userWords = await getUserWords(userId);
    
    if (userWords.length === 0) {
      throw new Error('No words available for quiz. Please add some words first!');
    }

    // Shuffle the words and take the requested number
    const shuffledWords = shuffleArray([...userWords]);
    const quizWords = shuffledWords.slice(0, Math.min(questionCount, userWords.length));
    
    // Generate questions (mix of German→English and English→German)
    const questions = quizWords.map((word, index) => {
      const isGermanToEnglish = Math.random() > 0.5;
      
      return {
        id: index + 1,
        wordId: word.id,
        question: isGermanToEnglish ? word.german : word.english,
        correctAnswer: isGermanToEnglish ? word.english : word.german,
        type: isGermanToEnglish ? 'german-to-english' : 'english-to-german',
        userAnswer: '',
        isCorrect: null
      };
    });

    return {
      id: Date.now().toString(),
      questions,
      totalQuestions: questions.length,
      currentQuestion: 0,
      score: 0,
      startTime: new Date(),
      completed: false
    };
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};

// Save quiz results to Firestore
export const saveQuizResults = async (userId, quizData) => {
  try {
    const quizResults = {
      userId,
      quizId: quizData.id,
      totalQuestions: quizData.totalQuestions,
      score: quizData.score,
      percentage: Math.round((quizData.score / quizData.totalQuestions) * 100),
      startTime: quizData.startTime,
      endTime: new Date(),
      duration: new Date() - quizData.startTime,
      questions: quizData.questions.map(q => ({
        wordId: q.wordId,
        question: q.question,
        correctAnswer: q.correctAnswer,
        userAnswer: q.userAnswer,
        isCorrect: q.isCorrect,
        type: q.type
      }))
    };

    await addDoc(collection(db, 'users', userId, 'quizResults'), quizResults);
    return quizResults;
  } catch (error) {
    console.error("Error saving quiz results:", error);
    throw error;
  }
};

// Get user's quiz history
export const getQuizHistory = async (userId, limit = 10) => {
  try {
    const q = query(
      collection(db, 'users', userId, 'quizResults'),
      orderBy('endTime', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.slice(0, limit).map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting quiz history:", error);
    throw error;
  }
};

// Utility function to shuffle array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
} 