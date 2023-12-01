import React, { useState } from 'react';
import '../App.css';

const AddToListSection = () => {
  const [listName, setListName] = useState('');
  const [superheroId, setSuperheroId] = useState('');
  const [message, setMessage] = useState('');

  const addSuperheroToList = () => {
    // Reset message
    setMessage('');

    // Check if the list name or superhero ID is empty
    if (!listName || !superheroId) {
      setMessage('Please enter both list name and superhero ID.');
      return;
    }

    // Add superhero to list
    fetch(`/api/superheroInfo/lists/${listName}/addSuperhero/${superheroId}`, {
      method: 'POST',
    })
      .then((res) => {
        if (res.status === 200) {
          setMessage(`Superhero with ID ${superheroId} successfully added!`);
        } else if (res.status === 400) {
          setMessage(`Superhero with ID ${superheroId} already in the list '${listName}'.`);
        } else if (res.status === 404) {
          setMessage('The list/superhero does not exist.');
        } else {
          setMessage('An unspecified error occurred. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage('An error occurred while processing your request. Please try again later.');
      });

    // TODO: Add any additional logic or state updates here
    // e.g., getLists(), refreshListDetails()

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
