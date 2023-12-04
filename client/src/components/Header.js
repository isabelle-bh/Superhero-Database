import React from 'react';
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ setIsAuthenticated, isAuthenticated }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Perform sign-out logic, e.g., clear authentication tokens or session data

    // Update the authentication status in the parent component
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');

    // Redirect to the menu page after sign-out
    navigate('/');
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
