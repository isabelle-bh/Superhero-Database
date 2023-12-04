import React, { useState, useEffect } from 'react';
import '../App.css';

const DeleteListSection = () => {
  const [listName, setListName] = useState('');
  const [message, setMessage] = useState('');
  const [lists, setLists] = useState([]);
  const [listsWithData, setListsWithData] = useState([]); // Define listsWithData outside of getUserLists
  const [selectedList, setSelectedList] = useState('');

  const [isAuthenticated, setIsAuthenticated] = useState(
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
        setListsWithData(listsWithData);
        setLists(listsWithData);
        setSelectedList(listsWithData.length > 0 ? listsWithData[0].name : ''); // Set the initial selected list
      } else {
        console.error('Error:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Call getUserLists when the component mounts
  useEffect(() => {
    getUserLists();
  }, []);

  const confirmDelete = () => {
    const isConfirmed = window.confirm('Are you sure you want to delete this list?');
    if (isConfirmed) {
      deleteList();
    }
  };

  const deleteList = async () => {
    // Reset message
    setMessage('');
  
    const authToken = localStorage.getItem('authToken');
  
    // Check if the authToken is available
    if (!authToken) {
      setMessage('Authentication token not available. Please log in.');
      return;
    }
  
    try {
      // Delete an existing list
      const response = await fetch(`/api/superheroInfo/lists/${selectedList}/deleteList`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ selectedList }),
      });
  
      // Check the status and handle accordingly
      if (response.status === 200) {
        setMessage('List deleted successfully!');
        // Clear input field
        setListName('');
        
        // Call getUserLists() after successful deletion
        getUserLists();
      } else if (response.status === 404) {
        setMessage(`List '${listName}' doesn't exist`);
      } else if (response.status === 403 || response.status === 401) {
        setMessage('You are not authorized to perform this action.');
      } else {
        setMessage('An unspecified error occurred while deleting the list. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while processing your request. Please try again later.');
    }
  };
  
  return (
    <div className="deleteItem">
      <h2>delete a list</h2>
      <div className="deleteList">
        <p>
        <select
            id="findListInput"
            value={selectedList}
            onChange={(e) => setSelectedList(e.target.value)}
          >
            {listsWithData.map((list) => (
              <option key={list.id} value={list.name}>
                {list.name}
              </option>
            ))}
          </select>
          <button id="deleteListButton" onClick={confirmDelete}>
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
