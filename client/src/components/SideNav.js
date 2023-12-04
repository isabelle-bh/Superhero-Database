import React, { useEffect, useState } from 'react';
import '../App.css';

const SideNav = () => {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [listDetails, setListDetails] = useState([]);
  const [isAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  const getUserLists = async () => {
    try {
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        console.error('Authentication token not available. Please log in.');
        return;
      }

      const response = await fetch("/api/superheroInfo/lists/getUserLists", {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      const data = await response.json();
      console.log('Data from server:', data);

      if (response.ok) {
        const listsWithData = data.map((list) => ({
          ...list,
          desc: list.desc, // Assuming the server returns the description in the response
        }));
        setLists(listsWithData);
      } else {
        console.error('Error:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getPublicLists = async () => {
    try {
      const response = await fetch("/api/superheroInfo/lists/getPublicLists");

      const data = await response.json();
      console.log('Data from server:', data);

      if (response.ok) {
        const listsWithData = data.map((list) => ({
          ...list,
          desc: list.desc, // Assuming the server returns the description in the response
        }));
        setLists(listsWithData);
      } else {
        console.error('Error:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getListDetails = async (listName) => {
    try {
      const response = await fetch(`/api/superheroInfo/lists/${listName}/getListDetails`);

      const data = await response.json();
      console.log('List Details:', data);

      if (response.ok) {
        setListDetails(data);
      } else {
        console.error('Error:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    getUserLists();
    getPublicLists();
  }, []);

  useEffect(() => {
    if (selectedList) {
      getListDetails(selectedList.name);
    }
  }, [selectedList]);

  const handleSelectList = (list) => {
    // If the selected list is already expanded, close it
    if (selectedList && selectedList._id === list._id) {
      setSelectedList(null);
    } else {
      // Otherwise, expand the selected list
      setSelectedList(list);
    }
  };

  return (
    <div id="mySideNav" className="sideNav">
      {isAuthenticated ? (
        <>
          <h2>select a list</h2>
          <div className="createdLists">
            <ul id="listsContainer">
              {lists.length > 0 ? (
                lists.map((list) => (
                    <button
                      className={`list-button ${selectedList && selectedList._id === list._id ? 'selected' : ''}`}
                      onClick={() => handleSelectList(list)}
                    >
                      {list.name}
                    {selectedList && selectedList._id === list._id && (
                      <div className="expanded-info">
                        <h3>List Description: {selectedList.desc}</h3>
                        <h3>Superheroes in the list:</h3>
                        <ul className="superheroes">
                          {listDetails.map((hero) => (
                            <li key={hero.id} className="superheroes">
                              ID: {hero.id} <br></br> NAME: {hero.name} <br></br> RACE: {hero.information.Race || 'Unknown'} <br></br> PUB: {hero.information.Publisher || 'Unknown'} <br></br> POWERS: {hero.powers}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    </button>
                ))
              ) : (
                <p className="noResults">No lists available</p>
              )}
            </ul>
          </div>
        </>
      ) : (
        <div className="unauthorized">
          <br></br>
          <h2>public lists:</h2>
          <div className="public-lists">
            <ul id="listsContainer">
              {lists.length > 0 ? (
                lists.map((list) => (
                    <button
                      className={`list-button ${selectedList && selectedList._id === list._id ? 'selected' : ''}`}
                      onClick={() => handleSelectList(list)}
                    >
                      {list.name} <br />
                      Description: {list.desc} <br />
                      Created By: {list.username} <br />
                      No. Of Heroes: {list.superheroes.length} <br />
                      Last Modified: {list.updatedTime} <br />
                      Rating: {list.rating}
                      {selectedList && selectedList._id === list._id && (
                      <div className="expanded-info">
                        <h3>Superheroes in the list:</h3>
                        <ul className="superheroes">
                          {listDetails.map((hero) => (
                            <li key={hero.id} className="superheroes">
                              ID: {hero.id}, NAME: {hero.name}, RACE: {hero.information.Race || 'Unknown'}, PUB: {hero.information.Publisher || 'Unknown'}, POWERS: {hero.powers}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    </button>
                ))
              ) : (
                <p className="noResults">No lists available</p>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideNav;
