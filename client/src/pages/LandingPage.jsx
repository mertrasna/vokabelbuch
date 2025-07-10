import './LandingPage.css'; 
import { Link } from 'react-router-dom';

function LandingPage() {
    return (
        <div className="landing-page">
          <div className="landing-card">
            <header className='landing-header'>
                <h1 className='landing-vokabelbuch'>Vokabelbuch</h1>
            </header>    
            <div className='landing-form'>
                <input className='username' type="text" placeholder='username' />
                <input className='password' type="password" placeholder='password' />
               <div className='landing-checkout'> 
                <button className="login-button">LOG IN</button>
                <button className='signup-button'>SIGN UP</button>
               </div> 
            </div>
          </div>    
        </div>
    );
}

export default LandingPage;