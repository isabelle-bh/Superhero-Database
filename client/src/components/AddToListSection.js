import React, { useState, useEffect } from 'react';
import '../App.css';

const AddToListSection = () => {
  const [listName, setListName] = useState('');
  const [superheroId, setSuperheroId] = useState('');
  const [message, setMessage] = useState('');

  const [authToken, setAuthToken] = useState('');

  useEffect(() => {
    // Get the authentication token from localStorage when the component mounts
    const storedAuthToken = localStorage.getItem('authToken');
    setAuthToken(storedAuthToken);
  }, []);

  const addSuperheroToList = () => {
    // Reset message
    setMessage('');

    // Check if the list name or superhero ID is empty
    if (!listName || !superheroId) {
      setMessage('Please enter both list name and superhero ID.');
      return;
    }

    // Check if the authToken is available
    if (!authToken) {
      setMessage('Authentication token not available. Please log in.');
      return;
    }

    // Add superhero to list
    fetch(`/api/superheroInfo/lists/${listName}/addSuperhero/${superheroId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          setMessage(`Superhero with ID ${superheroId} successfully added!`);
        } else if (res.status === 400) {
          setMessage(`Superhero with ID ${superheroId} already in the list '${listName}'.`);
        } else if (res.status === 404) {
          setMessage('The list/superhero does not exist.');
        } else if (res.status === 403 || res.status === 401) {
          setMessage('You are not authorized to perform this action.');
        } else {
          setMessage('An unspecified error occurred. Please try again.');
          console.log(res.status);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage('An error occurred while processing your request. Please try again later.');
      });

    // Clear input fields
    setListName('');
    setSuperheroId('');
  };

  return (
    <div className="lists">
      <h2>add superhero to list</h2>
      <div className="addSuperheroes">
        <p>
          <input
            type="text"
            id="findListInput"
            placeholder="name of list"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
          />
          <input
            type="text"
            id="addSuperheroInput"
            placeholder="superhero id"
            value={superheroId}
            onChange={(e) => setSuperheroId(e.target.value)}
          />
          <button id="addSuperheroButton" onClick={addSuperheroToList}>
            submit
          </button>
        </p>
      </div>
      <div className="results">
        <p id="addToList">{message}</p>
      </div>
    </div>
  );
};

export default AddToListSection;
