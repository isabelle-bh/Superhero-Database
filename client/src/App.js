import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
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
import LessAdmin from './components/LessAdmin';
import Policy from './components/Policy';
import DMCA from './components/DMCA';
import AUP from './components/AUP';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lists, setLists] = useState([]);

  useEffect(() => {
    // Check if a valid JWT exists in localStorage
    const token = localStorage.getItem('jwtToken');

    if (token) {
      const decoded = jwtDecode(token);

      // Check if the token is expired
      if (decoded.exp < Date.now() / 1000) {
        // Token expired, redirect to login
        setIsAuthenticated(false);
        localStorage.removeItem('jwtToken');
      } else {
        // Token valid, set authentication status
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Menu isAuthenticated={isAuthenticated} />} />
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/less-admin-dashboard" element={<LessAdmin />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/dmca" element={<DMCA />} />
        <Route path="/aup" element={<AUP />} />

        <Route
          path="/dashboard/*"
          element={
            isAuthenticated ? (
              <>
                <SideNav />
                <div className="content">
                  <Header setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} />
                  <SearchSection />
                  <CreateListSection />
                  <EditListSection />
                  <DeleteListSection setLists={setLists} />
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
              <SideNav />
              <Header setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} />
              <SearchSection />
            </div>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            isAuthenticated ? (
              <>
            <div className="content">
              <Admin />
            </div>
            </>
            ) : (
              // Redirect to login if not authenticated
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
