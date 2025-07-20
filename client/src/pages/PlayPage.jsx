import './PlayPage.css';
import { useState, useEffect } from 'react';
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

    const startNewQuiz = async () => {
        try {
            setLoading(true);
            setError('');
            setQuizCompleted(false);
            setQuizResults(null);
            
            const newQuiz = await generateQuiz(user.uid, 10); // 10 questions
            setQuiz(newQuiz);
            setUserAnswer('');
            setShowResult(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSubmit = (e) => {
        e.preventDefault();
        
        if (isEmptyAnswer(userAnswer)) {
            setError('Please enter an answer');
            return;
        }

        const sanitizedAnswer = sanitizeAnswer(userAnswer);
        const currentQuestion = quiz.questions[quiz.currentQuestion];
        const isCorrect = validateAnswer(sanitizedAnswer, currentQuestion.correctAnswer);

        // Update the current question with user's answer
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[quiz.currentQuestion] = {
            ...currentQuestion,
            userAnswer: sanitizedAnswer,
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

        // Auto-advance to next question after 2 seconds
        setTimeout(() => {
            if (quiz.currentQuestion < quiz.totalQuestions - 1) {
                nextQuestion();
            } else {
                completeQuiz(updatedQuiz);
            }
        }, 2000);
    };

    const nextQuestion = () => {
        if (quiz.currentQuestion < quiz.totalQuestions - 1) {
            setQuiz({
                ...quiz,
                currentQuestion: quiz.currentQuestion + 1
            });
            setShowResult(false);
            setError('');
        }
    };

    const completeQuiz = async (finalQuiz) => {
        try {
            const completedQuiz = {
                ...finalQuiz,
                completed: true
            };
            
            // Save results to Firestore
            const results = await saveQuizResults(user.uid, completedQuiz);
            setQuizResults(results);
            setQuizCompleted(true);
        } catch (err) {
            setError('Failed to save quiz results: ' + err.message);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !showResult && !isEmptyAnswer(userAnswer)) {
            handleAnswerSubmit(e);
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
                    
                    <div className="results-summary">
                        <h3>Quiz Summary</h3>
                        <p>Duration: {Math.round(quizResults.duration / 1000)} seconds</p>
                        <p>Completed: {new Date(quizResults.endTime.toDate()).toLocaleString()}</p>
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
                <p>Test your German vocabulary knowledge!</p>
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
            <h1>Quiz</h1>
            
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
                <h2>Translate this word:</h2>
                <div className="question-text">
                    {currentQuestion.question}
                </div>
                <div className="question-type">
                    {currentQuestion.type === 'german-to-english' ? 'German → English' : 'English → German'}
                </div>
            </div>

            {/* Answer Form */}
            {!showResult && (
                <form onSubmit={handleAnswerSubmit} className="answer-form">
                    <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Enter your answer..."
                        className="answer-input"
                        onKeyPress={handleKeyPress}
                        autoFocus
                    />
                    <button type="submit" className="submit-button" disabled={isEmptyAnswer(userAnswer)}>
                        Submit Answer
                    </button>
                </form>
            )}

            {/* Result Display */}
            {showResult && (
                <div className={`result-display ${currentQuestion.isCorrect ? 'correct' : 'incorrect'}`}>
                    <h3>{currentQuestion.isCorrect ? 'Correct!' : 'Incorrect!'}</h3>
                    <p>Your answer: {currentQuestion.userAnswer}</p>
                    {!currentQuestion.isCorrect && (
                        <p>Correct answer: {currentQuestion.correctAnswer}</p>
                    )}
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