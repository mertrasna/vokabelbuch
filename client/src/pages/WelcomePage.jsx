import './WelcomePage.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

function WelcomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="welcome-page">
        <header className='welcome-header'>
            <h1 className="vokabelbuch">Vokabelbuch</h1>
            <p>Your personal vocabulary book to learn and practice new words.</p>
        </header>
        <main>
            <div className="button-container">
                <Link to="/my-list" className="list-button">My List</Link> 
                <Link to="/play" className="play-button">Play</Link>
                <button className="logout-button" onClick={handleLogout}>Log Out</button>
            </div>    
        </main>
        <footer>
            <p>© 2025 Vokabelbuch. All rights reserved.</p>
        </footer>
    </div>
  );
}

export default WelcomePage;