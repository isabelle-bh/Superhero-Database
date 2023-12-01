import React, { useState, useEffect } from 'react';
import '../App.css'

const SearchByName = () => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedResult, setSelectedResult] = useState(null);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (searchInput === '') {
        setResults([]);
      } else {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/superheroInfo/searchFunction/name/${searchInput}/0`);
          const data = await response.json();
          setResults(data);
        } catch (error) {
          console.error('Error fetching superhero data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchResults();
  }, [searchInput]);

  const handleSelectResult = (result) => {
    setSelectedResult(result);
  };

  return (
    <div>
      <p className="search-boxes">
        <input
          type="text"
          id="nameInput"
          placeholder="try name..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        {isLoading && <p>Loading...</p>}
        {searchInput !== '' && (
          <ul id="results">
            {results.map((result) => (
              <li key={result.id} onClick={() => handleSelectResult(result)}>
                ID: {result.id}, NAME: {result.name}, PUB: {result.publisher || 'Unknown'}
              </li>
            ))}
          </ul>
        )}
        {results.length === 0 && !isLoading && searchInput !== '' && <p>No results found</p>}
      </p>

      {selectedResult && (
        <div>
          <h2>{selectedResult.name}</h2>
          <p>ID: {selectedResult.id}</p>
          <p>RACE: {selectedResult.race || 'Unknown'}</p>
          <p>PUB: {selectedResult.publisher || 'Unknown'}</p>
          <p>POWERS: {selectedResult.powers}</p>
          {/* Add other details you want to display */}
        </div>
      )}
    </div>
  );
};

const SearchByRace = () => {
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      // if the input is empty, clear the results
      if (searchInput === '') {
        setResults([]);
      } else {
        // Fetch results when the search bar is not empty
        setIsLoading(true);
        try {
          const response = await fetch(`/api/superheroInfo/searchFunction/race/${searchInput}/0`);
          const data = await response.json();
          setResults(data);
        } catch (error) {
          console.error('Error fetching superhero data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchResults();
  }, [searchInput]);

  return (
    <div>
      <p className="search-boxes">
        <input
          type="text"
          id="raceInput"
          placeholder="try race..."
          value={searchInput}
          onInput={(e) => setSearchInput(e.target.value)}
        />
        {isLoading && <p>Loading...</p>}
        {searchInput !== '' && (
          <ul id="results">
            {results.map(e => (
              <li key={e.id}>
                ID: {e.id}, NAME: {e.name}, RACE: {e.race || 'Unknown'}, PUB: {e.publisher || 'Unknown'}, POWERS: {e.powers}
              </li>
            ))}
          </ul>
        )}
        {results.length === 0 && !isLoading && searchInput !== '' && <p>No results found</p>}
      </p>
    </div>
  );
}

const SearchByPublisher = () => {
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      // if the input is empty, clear the results
      if (searchInput === '') {
        setResults([]);
      } else {
        // Fetch results when the search bar is not empty
        setIsLoading(true);
        try {
          const response = await fetch(`/api/superheroInfo/searchFunction/publisher/${searchInput}/0`);
          const data = await response.json();
          setResults(data);
        } catch (error) {
          console.error('Error fetching superhero data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchResults();
  }, [searchInput]);

  return (
    <div>
      <p className="search-boxes">
        <input
          type="text"
          id="pubInput"
          placeholder="try publisher..."
          value={searchInput}
          onInput={(e) => setSearchInput(e.target.value)}
        />
        {isLoading && <p>Loading...</p>}
        {searchInput !== '' && (
          <ul id="results">
            {results.map(e => (
              <li key={e.id}>
                ID: {e.id}, NAME: {e.name}, RACE: {e.race || 'Unknown'}, PUB: {e.publisher || 'Unknown'}, POWERS: {e.powers}
              </li>
            ))}
          </ul>
        )}
        {results.length === 0 && !isLoading && searchInput !== '' && <p>No results found</p>}
      </p>
    </div>
  );
}

const SearchByPower = () => {
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      // if the input is empty, clear the results
      if (searchInput === '') {
        setResults([]);
      } else {
        // Fetch results when the search bar is not empty
        setIsLoading(true);
        try {
          const response = await fetch(`/api/superheroInfo/searchFunction/powers/${searchInput}/0`);
          const data = await response.json();
          setResults(data);
        } catch (error) {
          console.error('Error fetching superhero data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchResults();
  }, [searchInput]);

  return (
    <div className="intro">
      <p className="search-boxes">
        <input
          type="text"
          id="powerInput"
          placeholder="Enter superhero power..."
          value={searchInput}
          onInput={(e) => setSearchInput(e.target.value)}
        />
        {isLoading && <p>Loading...</p>}
        {searchInput !== '' && (
          <ul id="results">
            {results.map(e => (
              <li key={e.id}>
                ID: {e.id}, NAME: {e.name}, RACE: {e.race || 'Unknown'}, PUB: {e.publisher || 'Unknown'}, POWERS: {e.powers}
              </li>
            ))}
          </ul>
        )}
        {results.length === 0 && !isLoading && searchInput !== '' && <p>No results found</p>}
      </p>
    </div>
  );
}

const SearchSection = () => {
  return (
    <div className="middle">
      <h2>search for superhero: </h2>
      <div className="intro">
        <p className="search-boxes">
            {/* search bars */}
            <div className="search-boxes">
              <SearchByName />
              <SearchByRace />
              <SearchByPublisher />
              <SearchByPower />
            </div>
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

export default SearchSection;
