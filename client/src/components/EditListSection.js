import React, { useState, useEffect } from 'react';
import '../App.css';

const EditListSection = () => {
  const [listName, setListName] = useState('');
  const [superheroId, setSuperheroId] = useState('');
  const [message, setMessage] = useState('');
  const [selectedList, setSelectedList] = useState('');
  const [lists, setLists] = useState([]);
  const [listsWithData, setListsWithData] = useState([]); // Define listsWithData outside of getUserLists
  const [visibility, setVisibility] = useState([]); // Define listsWithData outside of getUserLists

  // Assuming you have a state for user authentication
  const [authToken, setAuthToken] = useState('');

  useEffect(() => {
    // Get the authentication token from localStorage when the component mounts
    const storedAuthToken = localStorage.getItem('authToken');
    setAuthToken(storedAuthToken);
  }, []);

  const addSuperhero = () => {
    // Reset message
    setMessage('');

    // Check if the list name or superhero ID is empty
    if (!superheroId) {
      setMessage('Please enter a superhero ID.');
      return;
    }

    // Check if the authToken is available
    if (!authToken) {
      setMessage('Authentication token not available. Please log in.');
      return;
    }

    // Add superhero to list
    fetch(`/api/superheroInfo/lists/${selectedList}/addSuperhero/${superheroId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          setMessage(`Superhero with ID ${superheroId} successfully added!`);
        } else if (res.status === 400) {
          setMessage(`Superhero with ID ${superheroId} already in the list '${selectedList}'.`);
        } else if (res.status === 404) {
          setMessage('That superhero does not exist.');
        } else if (res.status === 403 || res.status === 401) {
          setMessage('You are not authorized to perform this action.');
        } else {
          setMessage('An unspecified error occurred. Please try again.');
          console.log(res.status);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage('An error occurred while processing your request. Please try again later.');
      });

    // Clear input fields
    setListName('');
    setSuperheroId('');
  };

  const removeSuperhero = () => {
    // Reset message
    setMessage('');
  
    // Check if the superhero ID is empty
    if (!superheroId) {
      setMessage('Please enter a superhero ID.');
      return;
    }
  
    // Check if the authToken is available
    if (!authToken) {
      setMessage('Authentication token not available. Please log in.');
      return;
    }
  
    // Remove superhero from list
    fetch(`/api/superheroInfo/lists/${selectedList}/removeSuperhero/${superheroId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          setMessage(`Superhero with ID ${superheroId} successfully removed from the list '${selectedList}'.`);
        } else if (res.status === 400) {
          setMessage(`Superhero with ID ${superheroId} is not in the list '${selectedList}'.`);
        } else if (res.status === 404) {
          setMessage('The list or superhero does not exist.');
        } else if (res.status === 403 || res.status === 401) {
          setMessage('You are not authorized to perform this action.');
        } else {
          setMessage('An unspecified error occurred. Please try again.');
          console.log(res.status);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage('An error occurred while processing your request. Please try again later.');
      });
  
    // Clear input fields
    setSuperheroId('');
  };
  
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

  const updateListName = () => {
    // Reset message
    setMessage('');
  
    // Check if the list name is empty or not changed
    if (!listName || listName === selectedList) {
      setMessage('Please enter a new list name.');
      return;
    }
  
    // Check if the authToken is available
    if (!authToken) {
      setMessage('Authentication token not available. Please log in.');
      return;
    }
  
    // Update list name
    fetch(`/api/superheroInfo/lists/${selectedList}/updateListName`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ newListName: listName }),
    })
      .then((res) => {
        if (res.status === 200) {
          setMessage(`List name updated to '${listName}'.`);
          // Optionally, you may want to update the list of user lists after a successful update
          getUserLists();
        } else if (res.status === 400) {
          setMessage('Invalid request. Please check your input.');
        } else if (res.status === 404) {
          setMessage(`The list '${selectedList}' does not exist.`);
        } else if (res.status === 403 || res.status === 401) {
          setMessage('You are not authorized to perform this action.');
        } else {
          setMessage('An unspecified error occurred. Please try again.');
          console.log(res.status);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage('An error occurred while processing your request. Please try again later.');
      });
  
    // Clear input field
    setListName('');
  };

  const updateVisibility = () => {
    // Reset message
    setMessage('');
  
    // Check if the authToken is available
    if (!authToken) {
      setMessage('Authentication token not available. Please log in.');
      return;
    }
  
    // Update list visibility
    fetch(`/api/superheroInfo/lists/${selectedList}/updateVisibility`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ visibility }), // Use the selected visibility from the dropdown
    })
      .then((res) => {
        if (res.status === 200) {
          setMessage(`List visibility updated to '${visibility}'.`);
          // Optionally, you may want to update the list of user lists after a successful update
          getUserLists();
        } else {
          setMessage('An unspecified error occurred. Please try again.');
          console.log(res.status);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage('An error occurred while processing your request. Please try again later.');
      });
  };
  
  // Call getUserLists when the component mounts
  useEffect(() => {
    getUserLists();
  }, []);

  return (
    <div className="lists">
      <h2>edit a list</h2>
      <div className="addSuperheroes">
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
          <br></br>
          <input
            type="text"
            id="addSuperheroInput"
            placeholder="superhero id"
            value={superheroId}
            onChange={(e) => setSuperheroId(e.target.value)}
          />
          <button id="addSuperheroButton" onClick={addSuperhero}>
            add
          </button>
          <button id="removeSuperheroButton" onClick={removeSuperhero}>
            remove
          </button>
          <br></br>
          <input
            type="text"
            id="updateListNameInput"
            placeholder="new list name"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
          />
          <button id="updateListNameButton" onClick={updateListName}>
            update name
          </button>
          <br></br>
          <select
            id="visibilityDropdown"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="public">public</option>
            <option value="private">private</option>
          </select>
          <button id="updateVisButton" onClick={updateVisibility}>
              update visibility
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
