import './Register.css';

function RegisterPage() {
    return (
        <div className="register-page">
           <div className='register-card'> 
            <header className='register-header'>
                <h1 className='register-h1'>Register</h1>
                <p className='register-p'>Create a new account to start using Vokabelbuch.</p>
            </header>
            <div className='register-form'>
                <input className='register-email' type="email" placeholder='you@example.com' required autoComplete='email'  />
                <input className='register-username' type="text" placeholder='username' />    
                <input className='register-password' type="password" placeholder='password' />
                <input className='register-confirm-password' type="password" placeholder='confirm password' />
                <button className='register-button'>REGISTER</button>
            </div>
           </div> 
        </div>    
    )
}

export default RegisterPage;