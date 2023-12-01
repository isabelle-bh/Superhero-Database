import React, { useEffect, useState } from 'react';
import '../App.css';

const SideNav = () => {
  const [selectedFilter, setSelectedFilter] = useState('name');
  const [lists, setLists] = useState([]);

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  const getLists = () => {
    // fetching the data from the api
    fetch("/api/superheroInfo/lists/getLists")
      .then((res) => res.json())
      .then((data) => {
        setLists(data);
      });
  };

  useEffect(() => {
    // Fetch lists when the component mounts
    getLists();
  }, []);

  return (
    <div id="mySideNav" className="sideNav">
      <h2>select a list</h2>
      <div className="createdLists">
        <ul id="listsContainer">
          {lists.map((listName) => (
            <button
              key={listName}
              className="list-button"
              data-listname={listName}
            >
              {listName}
            </button>
          ))}
        </ul>
      </div>
      <h2>details</h2>
      <div className="listDetails">
        <ol id="listResults"></ol>
      </div>
    </div>
  );
};

export default SideNav;
