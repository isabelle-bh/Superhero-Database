// Menu.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Admin = ({  }) => {
  const [users, setUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const [newPolicy, setNewPolicy] = useState('');
  const [securityPolicy, setSecurityPolicy] = useState('');
  const [newDMCA, setNewDMCA] = useState('');
  const [newAUP, setNewAUP] = useState('');
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  const handleCreatePolicy = async () => {
    try {
      const response = await fetch('/api/admin/create-update-policy', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ policy: newPolicy }),
      });
  
      if (response.status === 200) { // Changed from "UPDATED" to 200
        setSecurityPolicy(newPolicy);
        alert('Current security and privacy policy updated successfully!');
      } else if (response.status === 201) { // Changed from "CREATED" to 201
        setSecurityPolicy(newPolicy);
        alert('Security and privacy policy created successfully!');
      } else {
        console.error('Failed to create/update security and privacy policy');
      }
    } catch (error) {
      console.error('Error creating/updating security and privacy policy:', error);
    }
  };
  const handleCreateDMCA = async () => {
    try {
      const response = await fetch('/api/admin/create-update-dmca', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dmca: newDMCA }),
      });
  
      if (response.status === 200) { // Changed from "UPDATED" to 200
        setSecurityPolicy(newDMCA);
        alert('DMCA updated successfully!');
      } else if (response.status === 201) { // Changed from "CREATED" to 201
        setSecurityPolicy(newDMCA);
        alert('DMCA created successfully!');
      } else {
        console.error('Failed to create/update DMCA');
      }
    } catch (error) {
      console.error('Error creating/updating DMCA:', error);
    }
  };
  const handleCreateAUP = async () => {
    try {
      const response = await fetch('/api/admin/create-update-aup', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aup: newAUP }),
      });
  
      if (response.status === 200) { // Changed from "UPDATED" to 200
        setSecurityPolicy(newAUP);
        alert('Current AUP updated successfully!');
      } else if (response.status === 201) { // Changed from "CREATED" to 201
        setSecurityPolicy(newAUP);
        alert('AUP created successfully!');
      } else {
        console.error('Failed to create/update AUP');
      }
    } catch (error) {
      console.error('Error creating/updating AUP:', error);
    }
  };
  
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

  // State for security and privacy policy

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const responseUsers = await fetch('/api/users');
        const dataUsers = await responseUsers.json();
        setUsers(dataUsers);

      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error as needed
      }
    };

    fetchData();
  }, []);

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

  const handleGrantAdmin = async (email) => {
    try {
      const response = await fetch(`/api/users/grantAdmin/${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const updatedUsers = users.map((user) =>
          user.email === email ? { ...user, lessAdmin: true } : user
        );
        setUsers(updatedUsers);
        alert('Admin privileges granted successfully!');
      } else {
        console.error('Failed to grant admin privileges: ' + response.status);
      }
    } catch (error) {
      console.error('Error granting admin privileges:', error);
    }
  };

  const handleRevokeAdmin = async (email) => {
    try {
      const response = await fetch(`/api/users/revokeAdmin/${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const updatedUsers = users.map((user) =>
          user.email === email ? { ...user, lessAdmin: false } : user
        );
        setUsers(updatedUsers);
        alert('Admin privileges revoked successfully!');
      } else {
        console.error('Failed to revoke admin privileges');
      }
    } catch (error) {
      console.error('Error revoking admin privileges:', error);
    }
  };

  const handleSignOut = () => {

    // Update the authentication status in the parent component
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');

    // Redirect to the menu page after sign-out
    navigate('/');
  };

  return (
    <div className="admin-page">
      <Link to="/">
        <button className="back-button" onClick={handleSignOut}>sign out</button>
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
                // Skip rendering if the username is "administrator"
                user.username !== 'administrator' && (
                  <li key={user.email}>
                    {user.username}
                    <button
                      onClick={() => handleToggleAccount(user.email, user.active)}
                      className="deactivate-button"
                    >
                      {user.active ? 'Deactivate Account' : 'Reactivate Account'}
                    </button>
                    <button
                      onClick={() => (user.lessAdmin ? handleRevokeAdmin(user.email) : handleGrantAdmin(user.email))}
                      className="admin-button"
                    >
                      {user.lessAdmin ? 'Revoke Admin' : 'Grant Admin'}
                    </button>
                  </li>
                )
              ))}
            </ul>
          </div>
        )}
        <br></br>
        <div className="policy">
          <textarea
            value={newPolicy}
            onChange={(e) => setNewPolicy(e.target.value)}
            placeholder="Enter new policy text..."
          />
          <button onClick={handleCreatePolicy}>Create/Update Security Policy</button>
        </div>
        <div className="DMCA">
          <textarea
            value={newDMCA}
            onChange={(e) => setNewDMCA(e.target.value)}
            placeholder="Enter new DMCA text..."
          />
          <button onClick={handleCreateDMCA}>Create/Update DMCA</button>
        </div>
        <div className="AUP">
          <textarea
            value={newAUP}
            onChange={(e) => setNewAUP(e.target.value)}
            placeholder="Enter new AUP text..."
          />
          <button onClick={handleCreateAUP}>Create/Update AUP</button>
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

export default Admin;
