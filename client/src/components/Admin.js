// Menu.js
import React from 'react';
import { Link } from 'react-router-dom';

const Admin = ({ isAuthenticated }) => {
  return (
    <div className="admin-page">
        <Link to="/">
            <button className="back-button">sign out</button>
        </Link>
        <div className="admin">
            <div className="admin-header">
                <h1>welcome to my superhero database!</h1>
                <h2>Hello, Admin</h2>
                <hr></hr>
            </div>
            <div className="options">
                <button className="view-users">view all users</button>
                <button className="view-lists">view all lists</button>
            </div>
        </div>
    </div>
  );
};

export default Admin;
