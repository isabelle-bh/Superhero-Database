// PrivacyPolicy.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Policy = () => {
  const navigate = useNavigate();
  const [policyContent, setPolicyContent] = useState('');

  const handleGoBack = () => {
    // Go back to the last page the user was at
    navigate(-1);
  };

  useEffect(() => {
    // Fetch policy content when the component mounts
    const fetchPolicyContent = async () => {
      try {
        const response = await fetch('/api/admin/getPolicy');
        const data = await response.json();

        if (response.ok) {
          setPolicyContent(data.policy);
        } else {
          console.error('Failed to fetch policy:', data);
        }
      } catch (error) {
        console.error('Error fetching policy:', error);
      }
    };

    fetchPolicyContent();
  }, []); // Empty dependency array ensures the effect runs only once on component mount

  return (
    <div>
      <button onClick={handleGoBack}>Go Back</button>
      <h2>Security and Privacy Policy</h2>
      <div className="policy-container">
        <pre>{policyContent}</pre>
      </div>
    </div>
  );
};

export default Policy;
