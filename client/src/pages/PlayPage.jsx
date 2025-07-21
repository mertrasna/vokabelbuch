import './PlayPage.css';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../AuthContext.jsx';
import { generateQuiz, saveQuizResults } from '../services/quizService.js';
import { validateAnswer, sanitizeAnswer, isEmptyAnswer } from '../utils/quizUtils.js';

function PlayPage() {
    const { user } = useAuth();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [userAnswer, setUserAnswer] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [quizResults, setQuizResults] = useState(null);
    
    const inputRef = useRef(null);

    const startNewQuiz = async () => {
        try {
            setLoading(true);
            setError('');
            setQuizCompleted(false);
            setQuizResults(null);
            setUserAnswer('');
            setShowResult(false);
            
            const newQuiz = await generateQuiz(user.uid, 10);
            setQuiz(newQuiz);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        const currentQuestion = quiz?.questions[quiz.currentQuestion];
        
        if (!currentQuestion) return;

        setUserAnswer(value);

        // Auto-submit when answer is complete
        if (value.length >= currentQuestion.correctAnswer.length) {
            const isCorrect = validateAnswer(value, currentQuestion.correctAnswer);
            if (isCorrect) {
                setTimeout(() => handleAnswerComplete(value, isCorrect), 100);
            }
        }
    };

    const handleAnswerComplete = (finalAnswer, isCorrect) => {
        const currentQuestion = quiz.questions[quiz.currentQuestion];
        
        // Update the current question with user's answer
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[quiz.currentQuestion] = {
            ...currentQuestion,
            userAnswer: finalAnswer,
            isCorrect: isCorrect
        };

        const updatedQuiz = {
            ...quiz,
            questions: updatedQuestions,
            score: isCorrect ? quiz.score + 1 : quiz.score
        };

        setQuiz(updatedQuiz);
        setUserAnswer('');
        setShowResult(true);
        setError('');

        // Auto-advance to next question after 1.5 seconds
        setTimeout(() => {
            if (quiz.currentQuestion < quiz.totalQuestions - 1) {
                nextQuestion();
            } else {
                completeQuiz(updatedQuiz);
            }
        }, 1500);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !showResult && !isEmptyAnswer(userAnswer)) {
            handleAnswerComplete(userAnswer, validateAnswer(userAnswer, quiz.questions[quiz.currentQuestion].correctAnswer));
        }
    };

    const nextQuestion = () => {
        if (quiz.currentQuestion < quiz.totalQuestions - 1) {
            setQuiz({
                ...quiz,
                currentQuestion: quiz.currentQuestion + 1
            });
            setUserAnswer('');
            setShowResult(false);
            setError('');
            
            // Focus on input for next question
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const completeQuiz = async (finalQuiz) => {
        try {
            const completedQuiz = {
                ...finalQuiz,
                completed: true
            };
            
            const results = await saveQuizResults(user.uid, completedQuiz);
            setQuizResults(results);
            setQuizCompleted(true);
        } catch (err) {
            setError('Failed to save quiz results: ' + err.message);
        }
    };

    if (loading) {
        return (
            <div className="play-page">
                <h1>Play</h1>
                <p>Generating your quiz...</p>
            </div>
        );
    }

    if (error && !quiz) {
        return (
            <div className="play-page">
                <h1>Play</h1>
                <p className="error-message">{error}</p>
                <button onClick={startNewQuiz} className="start-quiz-button">
                    Try Again
                </button>
            </div>
        );
    }

    if (quizCompleted && quizResults) {
        return (
            <div className="play-page">
                <h1>Quiz Complete!</h1>
                <div className="results-container">
                    <div className="score-display">
                        <h2>Your Score</h2>
                        <div className="score-circle">
                            <span className="score-number">{quizResults.score}</span>
                            <span className="score-total">/ {quizResults.totalQuestions}</span>
                        </div>
                        <p className="score-percentage">{quizResults.percentage}%</p>
                    </div>

                    <div className="question-review">
                        <h3>Question Review</h3>
                        {quizResults.questions.map((question, index) => (
                            <div key={index} className={`review-item ${question.isCorrect ? 'correct' : 'incorrect'}`}>
                                <div className="review-question">
                                    <strong>Q{index + 1}:</strong> {question.question}
                                </div>
                                <div className="review-answers">
                                    <span className="correct-answer">Correct: {question.correctAnswer}</span>
                                    {!question.isCorrect && (
                                        <span className="user-answer">Your answer: {question.userAnswer}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <button onClick={startNewQuiz} className="new-quiz-button">
                    Start New Quiz
                </button>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="play-page">
                <h1>Play</h1>
                <p>Test your German vocabulary with speed typing!</p>
                <button onClick={startNewQuiz} className="start-quiz-button">
                    Start Quiz
                </button>
            </div>
        );
    }

    const currentQuestion = quiz.questions[quiz.currentQuestion];
    const progress = ((quiz.currentQuestion + 1) / quiz.totalQuestions) * 100;

    return (
        <div className="play-page">
            <h1>Speed Quiz</h1>
            
            {/* Progress Bar */}
            <div className="progress-container">
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="progress-text">
                    Question {quiz.currentQuestion + 1} of {quiz.totalQuestions}
                </p>
            </div>

            {/* Score Display */}
            <div className="score-display">
                <p>Score: {quiz.score} / {quiz.totalQuestions}</p>
            </div>

            {/* Question */}
            <div className="question-container">
                <h2>Type the translation:</h2>
                <div className="question-text">
                    {currentQuestion.question}
                </div>
                <div className="question-type">
                    {currentQuestion.type === 'german-to-english' ? 'German → English' : 'English → German'}
                </div>
            </div>

            {/* Invisible Input with Character Feedback */}
            {!showResult && (
                <div className="typing-container">
                    <input
                        ref={inputRef}
                        type="text"
                        value={userAnswer}
                        onChange={handleInputChange}
                        placeholder="Start typing..."
                        className="invisible-input"
                        onKeyPress={handleKeyPress}
                        autoFocus
                    />
                    <div className="character-display">
                        {currentQuestion.correctAnswer.split('').map((char, index) => (
                            <span
                                key={index}
                                className={`char ${index < userAnswer.length ? 
                                    (userAnswer[index].toLowerCase() === char.toLowerCase() ? 'correct' : 'incorrect') : 
                                    'pending'}`}
                            >
                                {index < userAnswer.length ? userAnswer[index] : '_'}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Result Display */}
            {showResult && (
                <div className={`result-display ${currentQuestion.isCorrect ? 'correct' : 'incorrect'}`}>
                    <h3>{currentQuestion.isCorrect ? 'Perfect!' : 'Incorrect!'}</h3>
                    <p className="next-indicator">
                        {quiz.currentQuestion < quiz.totalQuestions - 1 ? 'Next question...' : 'Quiz complete!'}
                    </p>
                </div>
            )}

            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

export default PlayPage;