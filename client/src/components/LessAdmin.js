// Menu.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LessAdmin = ({ }) => {
  const [users, setUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const [isAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        // Handle error as needed
      }
    };

    getUsers();
  }, []); // Empty dependency array ensures the effect runs only once on component mount

  const handleViewUsersClick = () => {
    setShowUserList((prevShowUserList) => !prevShowUserList);
  };

  const handleToggleAccount = async (email, active) => {
    const action = active ? 'deactivate' : 'reactivate';

    try {
      const response = await fetch(`/api/users/${action}/${email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Update the user list after deactivating or reactivating the user
        const updatedUsers = users.map((user) =>
          user.email === email ? { ...user, active: !active } : user
        );
        setUsers(updatedUsers);
        alert(`Account ${action}d successfully!`);
      } else {
        console.error(`Failed to ${action} account`);
      }
    } catch (error) {
      console.error(`Error ${action}ing account:`, error);
      // Handle error as needed
    }
  };

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
          <button className="view-users" onClick={handleViewUsersClick}>
            {showUserList ? 'hide users' : 'view all users'}
          </button>
        </div>
        {showUserList && (
          <div className="user-list">
            <h3>All Users:</h3>
            <ul>
              {users.map((user) => (
                <li key={user.email}>
                  {user.username}
                  <button
                    onClick={() => handleToggleAccount(user.email, user.active)}
                    className="deactivate-button"
                  >
                    {user.active ? 'Deactivate Account' : 'Reactivate Account'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
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

export default LessAdmin;
