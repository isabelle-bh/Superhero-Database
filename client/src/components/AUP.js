// PrivacyPolicy.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AUP = () => {
  const navigate = useNavigate();
  const [aupContent, setAupContent] = useState('');

  const handleGoBack = () => {
    // Go back to the last page the user was at
    navigate(-1);
  };

  useEffect(() => {
    // Fetch policy content when the component mounts
    const fetchAupContent = async () => {
      try {
        const response = await fetch('/api/admin/get-aup');
        const data = await response.json();

        if (response.ok) {
          setAupContent(data.aup);
        } else {
          console.error('Failed to fetch AUP:', data);
        }
      } catch (error) {
        console.error('Error fetching AUP:', error);
      }
    };

    fetchAupContent();
  }, []); // Empty dependency array ensures the effect runs only once on component mount

  return (
    <div>
      <button onClick={handleGoBack}>Go Back</button>
      <h2>Acceptable Use Policy</h2>
      <div className="policy-container">
        <pre>{aupContent}</pre>
      </div>
    </div>
  );
};

export default AUP;
