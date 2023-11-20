
import React from 'react';
import '../App.css';

const AddToListSection = () => {
  // Event handler for adding a superhero to a list
  const addSuperheroToList = () => {
    // Implement your logic for adding a superhero to a list
  };

  return (
    <div className="lists">
      <h2>add superhero to list</h2>
      <div className="addSuperheroes">
        <p>
          <input type="text" id="findListInput" placeholder="name of list" />
          <input type="text" id="addSuperheroInput" placeholder="superhero id" />
          <button id="addSuperheroButton" onClick={addSuperheroToList}>
            submit
          </button>
        </p>
      </div>
      <div className="results">
        <ol id="addToList">
          {/* Your added to list items go here */}
        </ol>
      </div>
    </div>
  );
};

export default AddToListSection;
