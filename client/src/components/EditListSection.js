import React, { useState, useEffect } from 'react';
import '../App.css';

const EditListSection = () => {

  return (
    <div className="lists">
      <h2>edit a list</h2>
      <div className="addSuperheroes">
        <p>
          choose a list to edit:
          
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

export default EditListSection;
