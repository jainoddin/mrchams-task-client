import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Logincss.css';
import { useUser } from './UserContext';

function Loginpage() {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();
  const { setUser } = useUser(); 

  const handleSignUpClick = () => {
    setIsRightPanelActive(true);
  };

  const handleSignInClick = () => {
    setIsRightPanelActive(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://task-server-1-wwb5.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);

        const tokenPayload = JSON.parse(atob(data.token.split('.')[1])); 
        const userId = tokenPayload.id;

        navigate(data.role === 'admin' ? '/adminlogin' : '/userlogin', {
          state: { userId },
        });
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      alert('Error logging in. Please try again.');
    }
  };

  // Registration form submit handler
  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://task-server-1-wwb5.onrender.com/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert('Registration successful! Redirecting...');
  
        if (data.user && role.toLowerCase() === 'user') { // Make sure 'user' role is lowercase
          const userId = data.user._id; // assuming the server response contains the user object with _id
          navigate('/reg', { state: { userId } });
        }
        
        setIsRightPanelActive(false);
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (error) {
      alert('Error registering. Please try again.');
    }
  };
  
  return (
    <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
      <div className="form-container sign-up-container">
        <form onSubmit={handleRegistrationSubmit}>
          <h1>Create Account</h1>
          <span>Registration</span>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <div className="form-container sign-in-container">
        <form onSubmit={handleLoginSubmit}>
          <h1>Sign in</h1>
          <span>or use your account</span>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <a href="#">Forgot your password?</a>
          <button type="submit">Sign In</button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost" onClick={handleSignInClick}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start your journey with us</p>
            <button className="ghost" onClick={handleSignUpClick}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loginpage;
