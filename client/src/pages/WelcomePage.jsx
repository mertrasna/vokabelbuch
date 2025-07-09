import './WelcomePage.css';
import { Link } from 'react-router-dom';

function WelcomePage() {
  return (
    <div className="welcome-page">
        <header>
            <h1 className="vokabelbuch">Vokabelbuch</h1>
            <p>Your personal vocabulary book to learn and practice new words.</p>
        </header>
        <main>
            <div className="button-container">
                <Link to="/my-list" className="list-button">My List</Link> 
                <Link to="/play" className="play-button">Play</Link>
            </div>    
        </main>
        <footer>
            <p>© 2025 Vokabelbuch. All rights reserved.</p>
        </footer>

    </div>
  );
}

export default WelcomePage;