import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = ({ isAuthenticated, setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showResendLink, setShowResendLink] = useState(false); // New state
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await response.json();
      console.log(responseData);

      if (responseData.status === 'SUCCESS') {
        // If login is successful, update isAuthenticated state and redirect to the dashboard
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');

        const authToken = responseData.token;
        localStorage.setItem('authToken', authToken);

        localStorage.setItem('username', responseData.username);

        if (responseData.admin === true) {
          navigate('/admin-dashboard');
        } else if (responseData.lessAdmin === true) {
          navigate('/less-admin-dashboard');
        } else {
          navigate('/dashboard');
        }

        console.log('Login successful!');
      } else if (responseData.status === 'INACTIVE ACCOUNT') {
        alert('Your account has been deactivated. Please contact the administrator at email se3316.ibeaudr@gmail.com');
      } else if (responseData.status === 'FAILED VERIFICATION') {
        // Show the option to resend verification email
        setShowResendLink(true);
        alert('Please verify your email before logging in.');
      } else if (responseData.status === 'INVALID PASSWORD' || responseData.status === 'INVALID ACCOUNT') {
        alert('Incorrect email or password. Please try again.');
      } else if (responseData.status === 'EMPTY CREDENTIALS') {
        alert('Please do not leave empty fields.');
      } else {
        console.error('Login failed:', responseData.message);
        setIsAuthenticated(false);
        localStorage.setItem('isAuthenticated', 'false');
        alert('Error logging in. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Error logging in. Please try again.');
    }
  };

const handleResendVerification = async () => {
  try {
    const response = await fetch(`/api/users/resendVerification/${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();
    console.log(responseData);

    if (responseData.status === 'PENDING') {
      alert('Verification email resent successfully. Please check your email.');
    } else {
      alert('Failed to resend verification email. Please try again.');
    }
  } catch (error) {
    console.error('Error resending verification email:', error);
    alert('Error resending verification email. Please try again.');
  }
};

return (
  <div className="login-page">
    <Link to="/">
      <button className="back-button">back to menu</button>
    </Link>
    <div className="login">
      <h1>welcome to my superhero database!</h1>
      <hr></hr>
      <h2>login</h2>
      <div>
        <input
          type="text"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Submit</button>
        {showResendLink && (
          <p>
            Email not verified?{' '}
            <button onClick={handleResendVerification}>Resend verification email</button>
          </p>
        )}
      </div>
      <div className="footer">
        <Link to="/policy">
            <button>view policy</button>
        </Link>
        <Link to="/dmca">
            <button>view DMCA</button>
        </Link>
        <Link to="/aup">
            <button>view AUP</button>
        </Link>
      </div>
    </div>
  </div>
);
};

export default LoginPage;
