import React, { useState } from 'react';
import '../App.css';

const CreateListSection = () => {
  const [listName, setListName] = useState('');
  const [message, setMessage] = useState('');

  // Assuming you have a state for lists
  const [lists, setLists] = useState([]);

  const createList = () => {
    // Reset message
    setMessage('');

    // Check if the list name is empty
    if (!listName) {
      setMessage('Please enter a list name.');
      return;
    }

    // Create a new list
    fetch('/api/superheroInfo/lists/createList', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ listName }),
    })
      .then((res) => {
        if (res.status === 200) {
          setMessage('List created successfully!');
          // Reload the page to reflect the new list
          window.location.reload();
        } else if (res.status === 400) {
          setMessage('List already exists!');
        } else {
          setMessage('An unspecified error occurred while creating the list. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage('An error occurred while processing your request. Please try again later.');
      });
  };

  return (
    <div className="additem">
      <h2>create a list</h2>
      <div className="createList">
        <p className="search-boxes">
          <input
            type="text"
            id="listNameInput"
            placeholder="enter a name"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
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
