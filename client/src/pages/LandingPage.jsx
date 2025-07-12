import './LandingPage.css'; 
import { Link, useNavigate } from 'react-router-dom';
// Importing firebase authentication
import { useState } from 'react';
import { loginUser } from '../services/authService';


function LandingPage() { 

  // state management for email, password, and error
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error , setError] = useState('');
  const navigate = useNavigate();

  // Function to handle login
  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
          setError('Please fill in all fields');
          return;
      }

      try {
        await loginUser(email, password);
        navigate('/welcome'); // Redirect to welcome page on successful login
      } catch (err) {
        setError('Login failed.' + err.message);
      }
  }

    return (
        <div className="landing-page">
          <div className="landing-card">
            <header className='landing-header'>
                <h1 className='landing-vokabelbuch'>Vokabelbuch</h1>
            </header>    
            <div className='landing-form'>
                <input className='email' type="email" placeholder='email@example.com'
                  value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className='password' type="password" placeholder='password' 
                  value={password} onChange={(e) => setPassword(e.target.value)} />
               <div className='landing-checkout'> 
                <button className="login-button" onClick={handleLogin} >LOG IN</button>
                <Link to="/register" className="signup-link">SIGN UP</Link>
               </div> 

                {error && <p className="error-message">{error}</p>}
            </div>
          </div>    
        </div>
    );
}

export default LandingPage;