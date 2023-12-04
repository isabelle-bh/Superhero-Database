import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Header from './components/Header';
import SearchSection from './components/SearchSection';
import CreateListSection from './components/CreateListSection';
import EditListSection from './components/EditListSection';
import DeleteListSection from './components/DeleteListSection';
import Admin from './components/Admin';
import SideNav from './components/SideNav';
import Menu from './components/Menu';

function App() {
  // Initially set isAuthenticated based on localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  useEffect(() => {
    // You can perform additional setup or checks here
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Menu isAuthenticated={isAuthenticated} />} />
        <Route path="/login" element={<LoginPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<SignupPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
        <Route
          path="/dashboard/*"
          element={
            isAuthenticated ? (
              <>
                <SideNav setIsAuthenticated={setIsAuthenticated} />
                <div className="content">
                  <Header setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} />
                  <SearchSection setIsAuthenticated={setIsAuthenticated} />
                  <CreateListSection setIsAuthenticated={setIsAuthenticated} />
                  <EditListSection setIsAuthenticated={setIsAuthenticated} />
                  <DeleteListSection setIsAuthenticated={setIsAuthenticated} />
                </div>
              </>
            ) : (
              // Redirect to login if not authenticated
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/unauthorized-dashboard"
          element={
            // Unauthorized dashboard (only header and search section)
            <div className="content">
              <SideNav setIsAuthenticated={setIsAuthenticated} />
              <Header setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} />
              <SearchSection setIsAuthenticated={setIsAuthenticated} />
            </div>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            // Unauthorized dashboard (only header and search section)
            <div className="content">
              <Admin setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} />
            </div>
          }
        />
        <Route path="/*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
