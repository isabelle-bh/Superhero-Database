import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = ({ isAuthenticated, setIsAuthenticated }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
  
    const handleLogin = async () => {
      try {
        const response = await fetch('/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // If login is successful, update isAuthenticated state and redirect to the dashboard
          setIsAuthenticated(true);
          localStorage.setItem('isAuthenticated', 'true');
  
          const token = data.token; // Replace with the actual token
          // Fetch the currently logged-in user
          const userResponse = await fetch('/api/users/current', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Assuming the token is sent in the response
            },
          });
  
          const userData = await userResponse.json();
  
          // Assuming the user data includes the username
          const loggedInUsername = userData.user.username;
  
          // Store the username in localStorage (replace 'username' with the actual key you want to use)
          localStorage.setItem('username', loggedInUsername);
  
          // Redirect to the dashboard
          navigate('/dashboard');
        } else {
          console.error('Login failed:', data.message);
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    };

  return (
    <div className="login-page">
        <Link to="/"><button className="back-button">back to menu</button></Link>
        <div className="login">
            <h1>welcome to my superhero database!</h1>
            <hr></hr>
            <h2>login</h2>
            {isAuthenticated ? (
                <Link to="/dashboard"><button>go to dashboard</button></Link>
            ) : (
                <div>
                <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Submit</button>
                </div>
            )}
        </div>
    </div>
  );
};

export default LoginPage;
