import './Register.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { registerUser } from '../services/authService'; 

function RegisterPage() {

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        setError('');
        setSuccess('');

        if (!email || !username || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await registerUser(email, username, password);
            setSuccess('Account created! Redirecting to login...');
            
            setTimeout(() => {
                navigate('/'); // Redirect to landing page after successful registration
            }, 2000);
        } catch (err) {
            setError('Registration failed: ' + err.message);
        }
    }

    return (
        <div className="register-page">
           <div className='register-card'> 
            <header className='register-header'>
                <h1 className='register-h1'>Register</h1>
                <p className='register-p'>Create a new account to start using Vokabelbuch.</p>
            </header>
            <div className='register-form'>
                <input className='register-email' type="email" placeholder='you@example.com' 
                    value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete='email'
                 />
                <input className='register-username' type="text" placeholder='username'
                    value={username} onChange={(e) => setUsername(e.target.value)} 
                />    
                <input className='register-password' type="password" placeholder='password' 
                    value={password} onChange={(e) => setPassword(e.target.value)}
                />
                <input className='register-confirm-password' type="password" placeholder='confirm password'
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button className='register-button' onClick={handleRegister}>REGISTER</button>

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

            </div>
           </div> 
        </div>    
    )
}

export default RegisterPage;