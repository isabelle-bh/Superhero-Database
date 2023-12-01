// SignupPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = ({ isAuthenticated, setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      // Make an API request to your server to create a new user
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // If sign-up is successful, update isAuthenticated state and redirect to the dashboard
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        // If sign-up fails, you can handle the error, show a message, or redirect to another page
        console.error('Sign-up failed:', data.message);
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
    }
  };

  return (
    <div className="signup-page">
        <Link to="/"><button className="back-button">back to menu</button></Link>
        <div className="signup">
            <h1>welcome to my superhero database!</h1>
            <hr></hr>
            <h2>Sign Up</h2>
            {isAuthenticated ? (
                <Link to="/dashboard"><button>go to dashboard</button></Link>
            ) : (
                <div>
                <input
                    type="text"
                    placeholder="enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleSignup}>submit</button>
                </div>
            )}
      </div>
    </div>
  );
};

export default SignupPage;
