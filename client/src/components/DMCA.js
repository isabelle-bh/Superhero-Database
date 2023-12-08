// PrivacyPolicy.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const DMCA = () => {
  const navigate = useNavigate();
  const [dmcaContent, setDmcaContent] = useState('');

  const handleGoBack = () => {
    // Go back to the last page the user was at
    navigate(-1);
  };

  useEffect(() => {
    // Fetch policy content when the component mounts
    const fetchDmcaContent = async () => {
      try {
        const response = await fetch('/api/admin/get-dmca');
        const data = await response.json();

        if (response.ok) {
          setDmcaContent(data.dmca);
        } else {
          console.error('Failed to fetch DMCA:', data);
        }
      } catch (error) {
        console.error('Error fetching DMCA:', error);
      }
    };

    fetchDmcaContent();
  }, []); // Empty dependency array ensures the effect runs only once on component mount

  return (
    <div>
      <button onClick={handleGoBack}>Go Back</button>
      <h2>DMCA</h2>
      <div className="policy-container">
        <pre>{dmcaContent}</pre>
      </div>
    </div>
  );
};

export default DMCA;
