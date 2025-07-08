import './WelcomePage.css';

function WelcomePage() {
  return (
    <div className="welcome-page">
        <header>
            <h1>Vokabelbuch</h1>
            <p>Your personal vocabulary book to learn and practice new words.</p>
        </header>
        <main>
            <div className="button-container">
                <button className="list-button">My List</button>
                <button className="play-button">Play</button>
            </div>    
        </main>
        <footer>
            <p>© 2025 Vokabelbuch. All rights reserved.</p>
        </footer>

    </div>
  );
}

export default WelcomePage;