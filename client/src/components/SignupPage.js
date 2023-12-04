import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = ({ isAuthenticated, setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const responseData = await response.json();

      if (responseData.status === 'EMPTY INPUTS') {
        alert('Please do not leave empty fields.');
      } else if (responseData.status === 'INVALID EMAIL') {
        alert('Please enter a valid email.');
      } else if (responseData.status === 'USER EMAIL ALREADY EXISTS') {
        alert('An account with this email already exists. Please try again.');
      } else if (responseData.status === 'INVALID CHARS') {
        alert('Username must be made of correct characters.');
      } else if (responseData.status === 'PASSWORD TOO SHORT') {
        alert('Password must be 8 characters or more.');
      } else if (response.ok) {
        // If sign-up is successful, update isAuthenticated state
        setIsAuthenticated(true);

        // Optionally, you can redirect to a login page or display a success message
        // navigate('/login');
        navigate('/');

        console.log('Sign-up successful!');

        if (username == 'administrator') {
          alert('Sign-up successful! You are an administrator.');
        } else {
          alert('Sign-up successful! Please click on the verification link sent to your email to confirm your account.');
        }
      } else {
        // If sign-up fails, you can handle the error, show a message, or redirect to another page
        console.error('Sign-up failed:', responseData.message);
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
    }
  };

  return (
    <div className="signup-page">
      <Link to="/">
        <button className="back-button">back to menu</button>
      </Link>
      <div className="signup">
        <h1>welcome to my superhero database!</h1>
        <hr></hr>
        <h2>Sign Up</h2>
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
      </div>
    </div>
  );
};

export default SignupPage;
