import React, { useState } from 'react';
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ setIsAuthenticated, isAuthenticated }) => {
  const navigate = useNavigate();
  const [showUpdatePasswordForm, setShowUpdatePasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatePasswordMessage, setUpdatePasswordMessage] = useState('');

  const handleSignOut = () => {

    // Update the authentication status in the parent component
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');

    // Redirect to the menu page after sign-out
    navigate('/');
  };

  const updatePassword = () => {
    // Toggle the visibility of the password update form
    setShowUpdatePasswordForm(!showUpdatePasswordForm);
  };

  const handleSubmitPasswordUpdate = async () => {
    // Reset update password message
    setUpdatePasswordMessage('');
  
    // Retrieve necessary information from localStorage
    const authToken = localStorage.getItem('authToken');
  
    try {
      // Make a request to update the password
      const response = await fetch('/api/users/updatePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // If the request is successful, you may handle it accordingly
        setUpdatePasswordMessage('Password updated successfully!');
        // Optionally, you may want to hide the form after a successful update
        setShowUpdatePasswordForm(false);
      } else {
        // Handle error scenarios
        setUpdatePasswordMessage(data.message || 'Failed to update password.');
      }
    } catch (error) {
      console.error('Error:', error);
      setUpdatePasswordMessage('An error occurred while processing your request. Please try again later.');
    }
  };
  

  // Retrieve the username from localStorage
  const username = localStorage.getItem('username');

  return (
    <div className="header">
      <div className="title">
        <h1>superhero database</h1>
      </div>
      {isAuthenticated && (
        <div className="signout">
          <p>welcome, {username}!</p>
          <button className="signout-button" onClick={handleSignOut}>
            sign out
          </button>
          <button className="update-password-button" onClick={updatePassword}>
            update password
          </button>
          {showUpdatePasswordForm && (
            <div className="update-password-form">
              <label>Current Password:</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <label>New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <label>Confirm Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button onClick={handleSubmitPasswordUpdate}>Submit</button>
              <p>{updatePasswordMessage}</p>
            </div>
          )}
        </div>
      )}
      {!isAuthenticated && (
        <Link to="/">
          <button className="back-button">back to menu</button>
        </Link>
      )}
    </div>
  );
};

export default Header;
