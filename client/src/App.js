
import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Header from './components/Header';
import SearchSection from './components/SearchSection';
import CreateListSection from './components/CreateListSection';
import AddToListSection from './components/AddToListSection';
import DeleteListSection from './components/DeleteListSection';
import SideNav from './components/SideNav';
import Menu from './components/Menu';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Menu isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/login" element={<LoginPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<SignupPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
        <Route
          path="/dashboard/*"
          element={
            isAuthenticated ? (
              <>
                <SideNav setIsAuthenticated={setIsAuthenticated} />
                <div className="content">
                  <Header setIsAuthenticated={setIsAuthenticated} />
                  <SearchSection setIsAuthenticated={setIsAuthenticated} />
                  <CreateListSection setIsAuthenticated={setIsAuthenticated} />
                  <AddToListSection setIsAuthenticated={setIsAuthenticated} />
                  <DeleteListSection setIsAuthenticated={setIsAuthenticated} />
                </div>
              </>
            ) : (
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
