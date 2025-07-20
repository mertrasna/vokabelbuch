// Utility functions for quiz mode

/**
 * Validates if a user's answer matches the correct answer
 * Handles case-insensitive matching and trims whitespace
 * @param {string} userAnswer - The user's input
 * @param {string} correctAnswer - The correct answer
 * @returns {boolean} - True if the answer is correct
 */
export const validateAnswer = (userAnswer, correctAnswer) => {
  if (!userAnswer || !correctAnswer) return false;
  
  const trimmedUserAnswer = userAnswer.trim().toLowerCase();
  const trimmedCorrectAnswer = correctAnswer.trim().toLowerCase();
  
  return trimmedUserAnswer === trimmedCorrectAnswer;
};

/**
 * Sanitizes user input for quiz answers
 * @param {string} input - Raw user input
 * @returns {string} - Sanitized input
 */
export const sanitizeAnswer = (input) => {
  return input.trim();
};

/**
 * Checks if an answer is empty or only contains whitespace
 * @param {string} answer - User's answer
 * @returns {boolean} - True if answer is empty
 */
export const isEmptyAnswer = (answer) => {
  return !answer || !answer.trim();
}; 