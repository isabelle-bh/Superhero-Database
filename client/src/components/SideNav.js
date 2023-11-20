import React, {useEffect, useState} from 'react'
import '../App.css';

const SideNav = () => {
    const [selectedFilter, setSelectedFilter] = useState('name');

    const handleFilterChange = (e) => {
        setSelectedFilter(e.target.value);
    };

    return (
        <div id="mySideNav" className="sideNav">
            <h2>select a list</h2>
            <div className="createdLists">
                <ol id="listsContainer">

                </ol>
            </div>
            <h2>details</h2>
            <p className="filter">
                <select
                    id="filter"
                    value={selectedFilter}
                    onChange={handleFilterChange}
                >
                    <option value="name">Filter A-Z by Name</option>
                    <option value="race">Filter A-Z by Race</option>
                    <option value="publisher">Filter A-Z by Publisher</option>
                    <option value="power">Filter High-Low by Powers</option>
                </select>
            </p>
            <div className="listDetails">
                <ol id="listResults">

                </ol>
            </div>
        </div>
    );
};

export default SideNav;