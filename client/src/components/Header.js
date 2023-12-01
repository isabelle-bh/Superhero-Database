
import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';


const Header = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const handleSignOut = () => {
        // Perform sign-out logic, e.g., clear authentication tokens or session data
    
        // Update the authentication status in the parent component
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
    
        // Redirect to the menu page after sign-out
        navigate('/');
    };

    return (
        <div className="header">
            <div className="title">
                <h1>superhero database</h1>
            </div>
            <div className="signout"> 
                <button className="signout-button" onClick={handleSignOut}>
                    signout
                </button>
            </div>
        </div>
    );
};

export default Header;
