import React, { useState, useEffect } from 'react';
import '../App.css';

const Search = () => {
  const [searchInputs, setSearchInputs] = useState({
    name: '',
    race: '',
    publisher: '',
    powers: ''
  });

  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/superheroInfo/searchFunction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(searchInputs),
        });

        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Error fetching superhero data:', error);
      } finally {
      }
    };

    fetchResults();
  }, [searchInputs]);

  const handleInputChange = (field, value) => {
    setSearchInputs((prevInputs) => ({ ...prevInputs, [field]: value }));
  };

  const handleSelectResult = (result) => {
    // If the selected result is already expanded, close it
    if (selectedResult && selectedResult.id === result.id) {
      setSelectedResult(null);
    } else {
      // Otherwise, expand the selected result
      setSelectedResult(result);
    }
  };

  const handleSearchButtonClick = (heroName, heroPub) => {
    const searchQuery = encodeURIComponent(heroName + ' ' + heroPub);
    const ddgSearchUrl = `https://duckduckgo.com/?q=${searchQuery}`;

    // Open a new tab with the DuckDuckGo search page
    window.open(ddgSearchUrl, '_blank');
  };

  return (
    <div className="search">
      <div className="search-boxes">
        <input
          type="text"
          id="nameInput"
          placeholder="try name..."
          value={searchInputs.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
        />
        <input
          type="text"
          id="raceInput"
          placeholder="try race..."
          value={searchInputs.race}
          onChange={(e) => handleInputChange('race', e.target.value)}
        />
        <input
          type="text"
          id="pubInput"
          placeholder="try publisher..."
          value={searchInputs.publisher}
          onChange={(e) => handleInputChange('publisher', e.target.value)}
        />
        <input
          type="text"
          id="powerInput"
          placeholder="try power..."
          value={searchInputs.powers}
          onChange={(e) => handleInputChange('powers', e.target.value)}
        />
      </div>
      {results.length > 0 && (
        <ul id="results">
          {results.map((result) => (
            <li
              key={result.id}
              className={selectedResult && selectedResult.id === result.id ? 'selected' : ''}
              onClick={() => handleSelectResult(result)}
            >
              NAME: {result.name}, PUB: {result.publisher || 'Unknown'}
              {selectedResult && selectedResult.id === result.id && (
                <div className="expanded-info">
                  {/* Display additional information here */}
                  ID: {result.id}, RACE: {result.race || 'Unknown'}, POWERS: {result.powers}
                </div>
              )}
              {/* Add the "Search" button for each result */}
              <button onClick={() => handleSearchButtonClick(result.name, result.publisher)}>Search on DDG</button>
            </li>
          ))}
        </ul>
      )}
      {results.length === 0 && <p className="noResults">No results found</p>}
    </div>
  );
};
export default Search;
