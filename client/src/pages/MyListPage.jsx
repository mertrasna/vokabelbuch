import './MyListPage.css';
import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext.jsx';
import { addWord, getUserWords, updateWord, deleteWord } from '../services/wordService.js';

function MyListPage() {
    const { user } = useAuth();
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Form states
    const [germanWord, setGermanWord] = useState('');
    const [englishWord, setEnglishWord] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    
    // Edit states
    const [editingId, setEditingId] = useState(null);
    const [editGerman, setEditGerman] = useState('');
    const [editEnglish, setEditEnglish] = useState('');

    // Load words on component mount
    useEffect(() => {
        if (user) {
            loadWords();
        }
    }, [user]);

    const loadWords = async () => {
        try {
            setLoading(true);
            const userWords = await getUserWords(user.uid);
            setWords(userWords);
        } catch (err) {
            setError('Failed to load words: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddWord = async (e) => {
        e.preventDefault();
        const trimmedGerman = germanWord.trim();
        const trimmedEnglish = englishWord.trim();
        
        if (!trimmedGerman || !trimmedEnglish) {
            setError('Please fill in both German and English words');
            return;
        }

        try {
            setIsAdding(true);
            setError('');
            await addWord(user.uid, trimmedGerman, trimmedEnglish);
            setGermanWord('');
            setEnglishWord('');
            setSuccess('Word added successfully!');
            loadWords(); // Reload the list
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to add word: ' + err.message);
        } finally {
            setIsAdding(false);
        }
    };

    const handleEditWord = async (wordId) => {
        const trimmedGerman = editGerman.trim();
        const trimmedEnglish = editEnglish.trim();
        
        if (!trimmedGerman || !trimmedEnglish) {
            setError('Please fill in both German and English words');
            return;
        }

        try {
            setError('');
            await updateWord(user.uid, wordId, trimmedGerman, trimmedEnglish);
            setEditingId(null);
            setEditGerman('');
            setEditEnglish('');
            setSuccess('Word updated successfully!');
            loadWords(); // Reload the list
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to update word: ' + err.message);
        }
    };

    const handleDeleteWord = async (wordId) => {
        if (window.confirm('Are you sure you want to delete this word?')) {
            try {
                setError('');
                await deleteWord(user.uid, wordId);
                setSuccess('Word deleted successfully!');
                loadWords(); // Reload the list
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                setError('Failed to delete word: ' + err.message);
            }
        }
    };

    const startEdit = (word) => {
        setEditingId(word.id);
        setEditGerman(word.german);
        setEditEnglish(word.english);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditGerman('');
        setEditEnglish('');
        setError('');
    };

    if (loading) {
        return (
            <div className="my-list-page">
                <h1>My List</h1>
                <p>Loading your words...</p>
            </div>
        );
    }

    return (
        <div className="my-list-page">
            <h1>My Vocabulary List</h1>
            
            {/* Add Word Form */}
            <div className="add-word-section">
                <h2>Add New Word</h2>
                <form onSubmit={handleAddWord} className="add-word-form">
                    <input
                        type="text"
                        placeholder="German word"
                        value={germanWord}
                        onChange={(e) => setGermanWord(e.target.value)}
                        className="word-input"
                        disabled={isAdding}
                        onBlur={(e) => setGermanWord(e.target.value.trim())}
                    />
                    <input
                        type="text"
                        placeholder="English translation"
                        value={englishWord}
                        onChange={(e) => setEnglishWord(e.target.value)}
                        className="word-input"
                        disabled={isAdding}
                        onBlur={(e) => setEnglishWord(e.target.value.trim())}
                    />
                    <button type="submit" className="add-button" disabled={isAdding}>
                        {isAdding ? 'Adding...' : 'Add Word'}
                    </button>
                </form>
            </div>

            {/* Messages */}
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            {/* Words List */}
            <div className="words-section">
                <h2>Your Words ({words.length})</h2>
                {words.length === 0 ? (
                    <p className="no-words">No words added yet. Start by adding your first German word!</p>
                ) : (
                    <div className="words-list">
                        {words.map((word) => (
                            <div key={word.id} className="word-item">
                                {editingId === word.id ? (
                                    // Edit mode
                                    <div className="word-edit">
                                        <input
                                            type="text"
                                            value={editGerman}
                                            onChange={(e) => setEditGerman(e.target.value)}
                                            className="edit-input"
                                            onBlur={(e) => setEditGerman(e.target.value.trim())}
                                        />
                                        <input
                                            type="text"
                                            value={editEnglish}
                                            onChange={(e) => setEditEnglish(e.target.value)}
                                            className="edit-input"
                                            onBlur={(e) => setEditEnglish(e.target.value.trim())}
                                        />
                                        <button 
                                            onClick={() => handleEditWord(word.id)}
                                            className="save-button"
                                        >
                                            Save
                                        </button>
                                        <button 
                                            onClick={cancelEdit}
                                            className="cancel-button"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    // Display mode
                                    <div className="word-display">
                                        <div className="word-content">
                                            <span className="german-word">{word.german}</span>
                                            <span className="arrow">→</span>
                                            <span className="english-word">{word.english}</span>
                                        </div>
                                        <div className="word-actions">
                                            <button 
                                                onClick={() => startEdit(word)}
                                                className="edit-button"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteWord(word.id)}
                                                className="delete-button"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyListPage;
