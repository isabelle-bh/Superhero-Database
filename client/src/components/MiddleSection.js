
import React from 'react';
import '../App.css';

const MiddleSection = () => {
    // Event handlers for search and filtering
    const searchByName = () => {
        // Implement your logic for searching by name
    };

    const searchByRace = () => {
        // Implement your logic for searching by race
    };

    const searchByPublisher = () => {
        // Implement your logic for searching by publisher
    };

    const searchByPower = () => {
        // Implement your logic for searching by power
    };

  return (
    <div className="middle">
      <h2>search for superhero: </h2>
      <div className="intro">
        <p className="search-boxes">
            {/* search bars */}
            <input
                type="text"
                id="nameInput"
                placeholder="name"
                onInput={searchByName}
                onClick={searchByName}
            />
            <input
                type="text"
                id="raceInput"
                placeholder="race"
                onInput={searchByRace}
                onClick={searchByRace}
            />
            <input
                type="text"
                id="pubInput"
                placeholder="publisher"
                onInput={searchByPublisher}
                onClick={searchByPublisher}
            />
            <input
                type="text"
                id="powerInput"
                placeholder="power"
                onInput={searchByPower}
                onClick={searchByPower}
            />
            {/* number of matches inputs */}
            <input
                type="text"
                id="nNameInput"
                placeholder="no. of matches"
                onInput={searchByName}
            />
            <input
                type="text"
                id="nRaceInput"
                placeholder="no. of matches"
                onInput={searchByRace}
            />
            <input
                type="text"
                id="nPubInput"
                placeholder="no. of matches"
                onInput={searchByPublisher}
            />
            <input
                type="text"
                id="nPowerInput"
                placeholder="no. of matches"
                onInput={searchByPower}
            />

            <select id="nameDropdownFilter" onChange={searchByName}>
                <option value="name">Filter A-Z by Name</option>
                <option value="race">Filter A-Z by Race</option>
                <option value="publisher">Filter A-Z by Publisher</option>
                <option value="power">Filter High-Low by Powers</option>
            </select>
            <select id="raceDropdownFilter" onChange={searchByRace}>
                <option value="name">Filter A-Z by Name</option>
                <option value="race">Filter A-Z by Race</option>
                <option value="publisher">Filter A-Z by Publisher</option>
                <option value="power">Filter High-Low by Powers</option>
            </select>
            <select id="pubDropdownFilter" onChange={searchByPublisher}>
                <option value="name">Filter A-Z by Name</option>
                <option value="race">Filter A-Z by Race</option>
                <option value="publisher">Filter A-Z by Publisher</option>
                <option value="power">Filter High-Low by Powers</option>
            </select>
            <select id="powerDropdownFilter" onChange={searchByPower}>
                <option value="name">Filter A-Z by Name</option>
                <option value="race">Filter A-Z by Race</option>
                <option value="publisher">Filter A-Z by Publisher</option>
                <option value="power">Filter High-Low by Powers</option>
            </select>
        </p>
      </div>
      <div className="results">
        <ol id="results">
          {/* Your search results go here */}
        </ol>
      </div>
    </div>
  );
};

export default MiddleSection;
