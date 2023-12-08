import React, { useState } from 'react';
import '../App.css';

const CreateListSection = () => {
  const [listName, setListName] = useState('');
  const [desc, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const [lists, setLists] = useState([]);

  const createList = async () => {
    // Reset message
    setMessage('');
  
    // Check if the list name is empty
    if (!listName) {
      setMessage('Please enter a list name.');
      return;
    }
  
    // Get the authentication token from localStorage
    const authToken = localStorage.getItem('authToken');
  
    // Check if the authToken is available
    if (!authToken) {
      setMessage('Authentication token not available. Please log in.');
      return;
    }

    console.log(authToken);
  
    try {
      // Create a new list
      const response = await fetch('/api/superheroInfo/lists/createList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ listName, desc }), 
      });
  
      if (response.ok) {
        // If the request is successful, update the lists state
        setLists([...lists, { name: listName, desc: desc }]);
        setListName('');
        setDescription(''); // Reset the description input
        setMessage('List created successfully!');
      } else if (response.status === 400) {
        setMessage('List already exists!');
      } else if (response.status === 422) {
        setMessage('One or more fields are missing.');
      } else {
        console.error('Error:', response.status);
        setMessage('An unspecified error occurred while creating the list. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while processing your request. Please try again later.');
    }
  };  


  return (
    <div className="additem">
      <h2>create a list</h2>
      <div className="createList">
        <p>
        <input
          type="text"
          id="listNameInput"
          placeholder="enter a name"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
        />

        <input
          type="text"
          id="listDescInput"
          placeholder="enter a description"
          value={desc}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button id="createListButton" onClick={createList}>
          submit
        </button>
      </p>
      </div>
      <div className="results">
        <p id="createList">{message}</p>
      </div>
    </div>
  );
};

export default CreateListSection;
