// Menu.js
import React from 'react';
import { Link } from 'react-router-dom';

const Menu = ({ isAuthenticated }) => {
  return (
    <div className="menu">
        <div className="menu-header">
            <h1>welcome to my superhero database!</h1>
            <hr></hr>
        </div>
        {isAuthenticated ? (
            <Link to="/dashboard"><button>Dashboard</button></Link>
        ) : (
            <div className="login-buttons">
            <Link to="/login"><button>Login</button></Link>
            <Link to="/signup"><button>Signup</button></Link>
            </div>
        )}
    </div>
  );
};

export default Menu;
