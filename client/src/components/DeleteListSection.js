import React, { useState } from 'react';
import '../App.css';

const DeleteListSection = () => {
  const [listName, setListName] = useState('');
  const [message, setMessage] = useState('');

  const deleteList = () => {
    // Reset message
    setMessage('');

    // Check if the list name is empty
    if (!listName) {
      setMessage('Please enter a list name.');
      return;
    }

    // Delete an existing list
    fetch(`/api/superheroInfo/lists/${listName}/deleteList`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (res.status === 200) {
          setMessage('List deleted successfully!');
        } else if (res.status === 404) {
          setMessage(`List '${listName}' doesn't exist`);
        } else {
          setMessage('An unspecified error occurred while deleting the list. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage('An error occurred while processing your request. Please try again later.');
      });

    // TODO: Add any additional logic or state updates here
    // e.g., getLists(), refreshListDetails()

    // Clear input field
    setListName('');
  };

  return (
    <div className="deleteItem">
      <h2>delete a list</h2>
      <div className="deleteList">
        <p className="search-boxes">
          <input
            type="text"
            id="deleteListNameInput"
            placeholder="enter a name"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
          />
          <button id="deleteListButton" onClick={deleteList}>
            submit
          </button>
        </p>
      </div>
      <div className="results">
        <p id="deleteList">{message}</p>
      </div>
    </div>
  );
};

export default DeleteListSection;
