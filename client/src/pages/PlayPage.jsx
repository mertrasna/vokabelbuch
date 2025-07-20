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
    const [startTime, setStartTime] = useState(null);
    const [currentSpeed, setCurrentSpeed] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [totalTyped, setTotalTyped] = useState(0);
    const [correctChars, setCorrectChars] = useState(0);
    
    const inputRef = useRef(null);
    const intervalRef = useRef(null);

    const startNewQuiz = async () => {
        try {
            setLoading(true);
            setError('');
            setQuizCompleted(false);
            setQuizResults(null);
            setUserAnswer('');
            setShowResult(false);
            setStartTime(null);
            setCurrentSpeed(0);
            setAccuracy(100);
            setTotalTyped(0);
            setCorrectChars(0);
            
            const newQuiz = await generateQuiz(user.uid, 10);
            setQuiz(newQuiz);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const startTimer = () => {
        if (!startTime) {
            setStartTime(Date.now());
            intervalRef.current = setInterval(updateSpeed, 100);
        }
    };

    const updateSpeed = () => {
        if (startTime && totalTyped > 0) {
            const elapsed = (Date.now() - startTime) / 1000; // seconds
            const wpm = Math.round((totalTyped / 5) / (elapsed / 60)); // words per minute (5 chars = 1 word)
            setCurrentSpeed(wpm);
        }
    };

    const calculateAccuracy = (input, target) => {
        if (!target) return 100;
        
        let correct = 0;
        const minLength = Math.min(input.length, target.length);
        
        for (let i = 0; i < minLength; i++) {
            if (input[i].toLowerCase() === target[i].toLowerCase()) {
                correct++;
            }
        }
        
        return Math.round((correct / Math.max(input.length, target.length)) * 100);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        const currentQuestion = quiz?.questions[quiz.currentQuestion];
        
        if (!currentQuestion) return;

        setUserAnswer(value);
        setTotalTyped(value.length);
        
        // Calculate accuracy in real-time
        const currentAccuracy = calculateAccuracy(value, currentQuestion.correctAnswer);
        setAccuracy(currentAccuracy);
        
        // Count correct characters
        let correct = 0;
        const minLength = Math.min(value.length, currentQuestion.correctAnswer.length);
        for (let i = 0; i < minLength; i++) {
            if (value[i].toLowerCase() === currentQuestion.correctAnswer[i].toLowerCase()) {
                correct++;
            }
        }
        setCorrectChars(correct);
        
        // Start timer on first character
        if (value.length === 1 && !startTime) {
            startTimer();
        }

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
            isCorrect: isCorrect,
            speed: currentSpeed,
            accuracy: accuracy,
            timeSpent: startTime ? (Date.now() - startTime) / 1000 : 0
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

        // Clear timer
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

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
            setStartTime(null);
            setCurrentSpeed(0);
            setAccuracy(100);
            setTotalTyped(0);
            setCorrectChars(0);
            
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
            
            // Calculate overall stats
            const totalTime = finalQuiz.questions.reduce((sum, q) => sum + (q.timeSpent || 0), 0);
            const avgSpeed = finalQuiz.questions.reduce((sum, q) => sum + (q.speed || 0), 0) / finalQuiz.questions.length;
            const avgAccuracy = finalQuiz.questions.reduce((sum, q) => sum + (q.accuracy || 100), 0) / finalQuiz.questions.length;
            
            const results = await saveQuizResults(user.uid, completedQuiz);
            setQuizResults({
                ...results,
                totalTime,
                avgSpeed: Math.round(avgSpeed),
                avgAccuracy: Math.round(avgAccuracy)
            });
            setQuizCompleted(true);
        } catch (err) {
            setError('Failed to save quiz results: ' + err.message);
        }
    };

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

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
                        <h2>Your Performance</h2>
                        <div className="score-circle">
                            <span className="score-number">{quizResults.score}</span>
                            <span className="score-total">/ {quizResults.totalQuestions}</span>
                        </div>
                        <p className="score-percentage">{quizResults.percentage}%</p>
                    </div>
                    
                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-label">Average Speed</span>
                            <span className="stat-value">{quizResults.avgSpeed} WPM</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Average Accuracy</span>
                            <span className="stat-value">{quizResults.avgAccuracy}%</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Total Time</span>
                            <span className="stat-value">{Math.round(quizResults.totalTime)}s</span>
                        </div>
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
                                <div className="review-stats">
                                    <span className="speed-stat">{question.speed || 0} WPM</span>
                                    <span className="accuracy-stat">{question.accuracy || 100}% accuracy</span>
                                    <span className="time-stat">{Math.round(question.timeSpent || 0)}s</span>
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

            {/* Live Stats */}
            <div className="live-stats">
                <div className="stat">
                    <span className="stat-label">Speed</span>
                    <span className="stat-value">{currentSpeed} WPM</span>
                </div>
                <div className="stat">
                    <span className="stat-label">Accuracy</span>
                    <span className="stat-value">{accuracy}%</span>
                </div>
                <div className="stat">
                    <span className="stat-label">Score</span>
                    <span className="stat-value">{quiz.score}/{quiz.totalQuestions}</span>
                </div>
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

            {/* Answer Input */}
            {!showResult && (
                <div className="answer-container">
                    <input
                        ref={inputRef}
                        type="text"
                        value={userAnswer}
                        onChange={handleInputChange}
                        placeholder="Start typing..."
                        className="answer-input"
                        onKeyPress={handleKeyPress}
                        autoFocus
                    />
                    <div className="answer-preview">
                        {currentQuestion.correctAnswer.split('').map((char, index) => (
                            <span
                                key={index}
                                className={`char ${index < userAnswer.length ? 
                                    (userAnswer[index].toLowerCase() === char.toLowerCase() ? 'correct' : 'incorrect') : 
                                    'pending'}`}
                            >
                                {char}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Result Display */}
            {showResult && (
                <div className={`result-display ${currentQuestion.isCorrect ? 'correct' : 'incorrect'}`}>
                    <h3>{currentQuestion.isCorrect ? 'Perfect!' : 'Incorrect!'}</h3>
                    <div className="result-stats">
                        <span>Speed: {currentQuestion.speed || 0} WPM</span>
                        <span>Accuracy: {currentQuestion.accuracy || 100}%</span>
                        <span>Time: {Math.round(currentQuestion.timeSpent || 0)}s</span>
                    </div>
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