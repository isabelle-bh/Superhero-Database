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
        <div className="login-buttons">
            <Link to="/login"><button>Login</button></Link>
            <Link to="/signup"><button>Signup</button></Link>
            <br></br><Link to="/unauthorized-dashboard"><button>public dashboard</button></Link>
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
  );
};

export default Menu;
