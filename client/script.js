
// calling function to display all existing lists
getLists();

// presetting the number of matches inputs to 0 so that all superheroes show up by default when searched
const nNameInput = document.getElementById('nNameInput');
nNameInput.value = 0;

const nRaceInput = document.getElementById('nRaceInput');
nRaceInput.value = 0;

const nPubInput = document.getElementById('nPubInput');
nPubInput.value = 0;

const nPowerInput = document.getElementById('nPowerInput');
nPowerInput.value = 0;

// Function to get all superheroes
function getSuperhero() {
    // fetching the data from the api
    fetch("/api/superheroInfo")
    .then(res => res.json())
    .then(data => {
        // getting the results div
        const l = document.getElementById('results');
        // removing the items from the results div
        while (l.firstChild) {
            l.removeChild(l.firstChild);
        }
        // looping through the data and creating a list item for each superhero
        data.forEach(e => {
            const item = document.createElement('li');
            item.appendChild(document.createTextNode(`${e.name}, ${e.Race}, ${e.Publisher}`));
            l.appendChild(item);
        });
    });
}

// Function to get all lists
function getLists() {
    // fetching the data from the api
    fetch("/api/superheroInfo/lists/getLists")
        .then(res => res.json())
        .then(data => {
            // getting the results div
            const l = document.getElementById('listsContainer');
            // removing the items from the results div
            while (l.firstChild) {
                l.removeChild(l.firstChild);
            }
            // looping through the data and creating a button for each list
            data.forEach(e => {
                const item = document.createElement('button');
                item.classList.add("list-button"); // Add a class for styling
                item.setAttribute("data-listname", e); // Store list name in a data attribute
                item.appendChild(document.createTextNode(e));
                l.appendChild(item);
            });
        });
}

// getting the list results ordered list
const listResults = document.getElementById('listResults');

// Add a click event listener to the parent container
document.addEventListener('click', function(event) {
    // Check if the clicked element has the "list-button" class
    if (event.target && event.target.classList.contains('list-button')) {

        // Remove the "selected-btn" class from all buttons
        const buttons = document.querySelectorAll('.list-button');
        buttons.forEach(button => {
            button.classList.remove('selected-btn');
        });
        // Add the "selected-btn" class to the clicked button
        event.target.classList.add('selected-btn');
        // displaying the list details
        getListDetails();
    }
});

// Function to get the details of a list
function getListDetails() {
    const selectedButton = document.querySelector('.selected-btn'); // Get the selected button
    const listName = selectedButton.getAttribute("data-listname"); // Get the list name from data attribute
    const results = []; // creating empty array to store results
    // fetching the data from the api
    fetch(`/api/superheroInfo/lists/${listName}/getSuperheroesDetails`)
    .then(res => res.json())
    .then(data => {
        // getting the filter dropdown
        const filter = document.getElementById('listDropdownFilter');
        // getting the results div
        const l = document.getElementById('listResults');
        // removing the items from the results div
        while (l.firstChild) {
            l.removeChild(l.firstChild);
        }
        // looping through the data and creating a list item for each superhero
        data.forEach(e => {
            const item = document.createElement('li');
            
            item.appendChild(document.createTextNode(`ID: ${e.id}, _____`));
            item.appendChild(document.createTextNode(`NAME: ${e.name}, _____`));
            if (e.information.Race == '-') {
                item.appendChild(document.createTextNode(`RACE: Unknown, _____`));
            } else {
                item.appendChild(document.createTextNode(`RACE: ${e.information.Race}, _____`));
            }            
            if (e.information.Publisher == '') {
                item.appendChild(document.createTextNode(`PUB: Unknown, _____`));
            } else {
                item.appendChild(document.createTextNode(`PUB: ${e.information.Publisher}, _____`));
            }            
            item.appendChild(document.createTextNode(`POWERS: ${e.powers}`));

            // Store the result in the results array
            const result = item.textContent;
            results.push(result);

            // Append the list item to the ordered list
            l.appendChild(item);
            // Display the filter dropdown
            filter.style.display = 'inline-block';
        });

        const option = document.getElementById('listDropdownFilter');
        const selectedOption = option.value;

        // Sort the results array by the "name" field
        if (selectedOption == 'name') {
            results.sort((a, b) => {
                const nameA = a.match(/NAME: (.*)/)[1];
                const nameB = b.match(/NAME: (.*)/)[1];
                return nameA.localeCompare(nameB);
            });
        // sort the results by the 'race' field
        } else if (selectedOption == 'race') {
            results.sort((a, b) => {
                const raceA = a.match(/RACE: (.*)/)[1];
                const raceB = b.match(/RACE: (.*)/)[1];
                return raceA.localeCompare(raceB);
            });
        // sort the results by the 'publisher' field
        } else if (selectedOption == 'publisher') {
            results.sort((a, b) => {
                const pubA = a.match(/PUB: (.*)/)[1];
                const pubB = b.match(/PUB: (.*)/)[1];
                return pubA.localeCompare(pubB);
            });
        // sort the results by the number of powers from highest to lowest
        }  else if (selectedOption == 'power') {
            results.sort((a, b) => {
                const powersA = countPowers(a);
                const powersB = countPowers(b);
                return powersB - powersA;
            });
        }

        // Clear the current list and display the sorted results
        l.innerHTML = ''; // Clear the list
        results.forEach(result => {
            const item = document.createElement('li');
            item.textContent = result;
            l.appendChild(item);
        });

        // Display a message if no results are found
        if (l.childElementCount === 0) {
            let noResults = document.createElement('p');
            noResults.appendChild(document.createTextNode(`No superheroes found in selected list '${listName}'`))
            noResults.setAttribute("id", "noResults");
            l.appendChild(noResults);
        }
    });
}

// getting the list dropdown filter
const listDropdown = document.getElementById('listDropdownFilter');

// Event listener for the dropdown filter menu option
listDropdown.addEventListener('change', function(event) {
    // Call the getListDetails function with the selected option value
    const listName = event.target.getAttribute("data-listname"); // Get the list name from data attribute
    getListDetails(listName);
});

// Function to refresh the list details
function refreshListDetails() {
    const l = document.getElementById('listResults');
    while (l.firstChild) {
        l.removeChild(l.firstChild);
    }
}

// Function to search for a superhero by name
function searchByName() {
    clearTexts();
    const results = [];
    // getting the number of matches input
    let nNameInput = document.getElementById('nNameInput');
    // sanitizing the input
    const n = sanitizeNumberInput(nNameInput.value);

    // getting the input from the search bar
    const inputElement = document.getElementById('nameInput');
    const name = inputElement.value;
    // sanitizing the input
    const sanitizedName = sanitizeInput(name);

    // getting the results div
    const l = document.getElementById('results');
    // getting the filter dropdown
    const filter = document.getElementById('nameDropdownFilter');

    // if the input is empty, remove all items from the results div and hide the filter dropdown
    if (sanitizedName === '') {
        while (l.firstChild) {
            l.removeChild(l.firstChild);
        }
        filter.style.display = 'none';
        nNameInput.style.display = 'none';
    } else {
        // Fetch and display results when the search bar is not empty
        fetch(`/api/superheroInfo/searchFunction/name/${sanitizedName}/${n}`)
            .then(res => res.json())
            .then(data => {

                // clearing the other nInputs and filter dropdowns
                const nRaceInput = document.getElementById('nRaceInput');
                const nPubInput = document.getElementById('nPubInput');
                const nPowerInput = document.getElementById('nPowerInput');
                nRaceInput.style.display = 'none';
                nPubInput.style.display = 'none';
                nPowerInput.style.display = 'none';

                const filterRace = document.getElementById('raceDropdownFilter');
                const filterPub = document.getElementById('pubDropdownFilter');
                const filterPow = document.getElementById('powerDropdownFilter');
                filterRace.style.display = 'none';
                filterPub.style.display = 'none';
                filterPow.style.display = 'none';

                while (l.firstChild) {
                    l.removeChild(l.firstChild);
                }

                // looping through the data and creating a list item for each superhero
                data.forEach(e => {
                        const item = document.createElement('li');

                        item.appendChild(document.createTextNode(`ID: ${e.id}, _____ `));
                        item.appendChild(document.createTextNode(`NAME: ${e.name}, _____`));
                        if (e.race == '-') {
                            item.appendChild(document.createTextNode(`RACE: Unknown, _____`));
                        } else {
                            item.appendChild(document.createTextNode(`RACE: ${e.race}, _____`));
                        }
                        if (e.publisher == '') {
                            item.appendChild(document.createTextNode(`PUB: Unknown _____`));
                        } else {
                            item.appendChild(document.createTextNode(`PUB: ${e.publisher}, _____`));
                        }
                        item.appendChild(document.createTextNode(`POWERS: ${e.powers},`));

                        const result = item.textContent;
                        results.push(result);
                        l.appendChild(item);
                        nNameInput.style.display = 'inline-block';
                        filter.style.display = 'inline-block';
                    
                });

                // getting the selected option from the filter dropdown
                const option = document.getElementById('nameDropdownFilter');
                const selectedOption = option.value;

                // Sort the results array based on the selected option
                if (selectedOption == 'name') {
                    results.sort((a, b) => {
                        const nameA = a.match(/NAME: (.*)/)[1];
                        const nameB = b.match(/NAME: (.*)/)[1];
                        return nameA.localeCompare(nameB);
                    });
                } else if (selectedOption == 'race') {
                    results.sort((a, b) => {
                        const raceA = a.match(/RACE: (.*)/)[1];
                        const raceB = b.match(/RACE: (.*)/)[1];
                        return raceA.localeCompare(raceB);
                    });
                } else if (selectedOption == 'publisher') {
                    results.sort((a, b) => {
                        const pubA = a.match(/PUB: (.*)/)[1];
                        const pubB = b.match(/PUB: (.*)/)[1];
                        return pubA.localeCompare(pubB);
                    });
                } else if (selectedOption == 'power') {
                    results.sort((a, b) => {
                        const powersA = countPowers(a);
                        const powersB = countPowers(b);
                        return powersB - powersA;
                    });
                }

                // Clear the current list and display the sorted results
                l.innerHTML = '';
                results.forEach(result => {
                    const item = document.createElement('li');
                    item.textContent = result;
                    l.appendChild(item);
                });

                // Display a message if no results are found
                if (l.childElementCount === 0) {
                    let noResults = document.createElement('p');
                    noResults.appendChild(document.createTextNode(`No results found for '${sanitizedName}'`))
                    noResults.setAttribute("id", "noResults");
                    l.appendChild(noResults);
                    nNameInput.style.display = 'none';
                    filter.style.display = 'none';
                }
            });
    }
}

// Function to search by race
function searchByRace() {
    clearTexts();
    // getting the number of matches input
    let nRaceInput = document.getElementById('nRaceInput');
    // sanitizing the input
    const n = sanitizeNumberInput(nRaceInput.value)

    const results = [];
    // getting the input from the search bar
    const inputElement = document.getElementById('raceInput');
    const race = inputElement.value;
    // sanitizing the input
    const sanitizedRace = sanitizeInput(race);

    // getting the results div
    const l = document.getElementById('results');
    // getting the filter dropdown
    const filter = document.getElementById('raceDropdownFilter');

    // if the input is empty, remove all items from the results div and hide the filter dropdown
    if (sanitizedRace === '') {
        while (l.firstChild) {
            l.removeChild(l.firstChild);
        }
        filter.style.display = 'none';
        nRaceInput.style.display = 'none';
    } else {
        // Fetch and display results when the search bar is not empty
        fetch(`/api/superheroInfo/searchFunction/race/${sanitizedRace}/${n}`)
            .then(res => res.json())
            .then(data => {
                // clearing the other nInputs and filter dropdowns
                const nNameInput = document.getElementById('nNameInput');
                const nPubInput = document.getElementById('nPubInput');
                const nPowerInput = document.getElementById('nPowerInput');
                nNameInput.style.display = 'none';
                nPubInput.style.display = 'none';
                nPowerInput.style.display = 'none';

                const filterName = document.getElementById('nameDropdownFilter');
                const filterPub = document.getElementById('pubDropdownFilter');
                const filterPow = document.getElementById('powerDropdownFilter');
                filterName.style.display = 'none';
                filterPub.style.display = 'none';
                filterPow.style.display = 'none';

                while (l.firstChild) {
                    l.removeChild(l.firstChild);
                }

                // looping through the data and creating a list item for each superhero
                data.forEach(e => {
                    const item = document.createElement('li');

                    item.appendChild(document.createTextNode(`ID: ${e.id}, _____ `));
                    item.appendChild(document.createTextNode(`NAME: ${e.name}, _____`));
                    if (e.race == '-') {
                        item.appendChild(document.createTextNode(`RACE: Unknown, _____`));
                    } else {
                        item.appendChild(document.createTextNode(`RACE: ${e.race}, _____`));
                    }
                    if (e.publisher == '') {
                        item.appendChild(document.createTextNode(`PUB: Unknown _____`));
                    } else {
                        item.appendChild(document.createTextNode(`PUB: ${e.publisher}, _____`));
                    }
                    item.appendChild(document.createTextNode(`POWERS: ${e.powers},`));

                    const result = item.textContent;
                    results.push(result);

                    l.appendChild(item);
                    filter.style.display = 'inline-block';
                    nRaceInput.style.display = 'inline-block';
                });

                // getting the selected option from the filter dropdown
                const option = document.getElementById('raceDropdownFilter');
                const selectedOption = option.value;

                // Sort the results array based on the selected option
                if (selectedOption == 'name') {
                    results.sort((a, b) => {
                        const nameA = a.match(/NAME: (.*)/)[1];
                        const nameB = b.match(/NAME: (.*)/)[1];
                        return nameA.localeCompare(nameB);
                    });
                } else if (selectedOption == 'race') {
                    results.sort((a, b) => {
                        const raceA = a.match(/RACE: (.*)/)[1];
                        const raceB = b.match(/RACE: (.*)/)[1];
                        return raceA.localeCompare(raceB);
                    });
                } else if (selectedOption == 'publisher') {
                    results.sort((a, b) => {
                        const pubA = a.match(/PUB: (.*)/)[1];
                        const pubB = b.match(/PUB: (.*)/)[1];
                        return pubA.localeCompare(pubB);
                    });
                } else if (selectedOption == 'power') {
                    results.sort((a, b) => {
                        const powersA = countPowers(a);
                        const powersB = countPowers(b);
                        return powersB - powersA;
                    });
                }

                // Clear the current list and display the sorted results
                l.innerHTML = '';
                results.forEach(result => {
                    const item = document.createElement('li');
                    item.textContent = result;
                    l.appendChild(item);
                });

                // Display a message if no results are found
                if (l.childElementCount === 0) {
                    let noResults = document.createElement('p');
                    noResults.appendChild(document.createTextNode(`No results found for '${sanitizedRace}'.`))
                    noResults.setAttribute("id", "noResults");
                    l.appendChild(noResults);
                    nRaceInput.style.display = 'none';
                    filter.style.display = 'none';
                }
            });
    }
}

// Function to search by publisher
function searchByPublisher() {
    clearTexts();
    // getting the number of matches input
    let nPubInput = document.getElementById('nPubInput');
    // sanitizing the input
    const n = sanitizeNumberInput(nPubInput.value)

    const results = [];
    // getting the input from the search bar
    const inputElement = document.getElementById('pubInput');
    const publisher = inputElement.value;
    // sanitizing the input
    const sanitizedPub = sanitizeInput(publisher);

    // getting the results div
    const l = document.getElementById('results');
    // getting the filter dropdown
    const filter = document.getElementById('pubDropdownFilter');

    // if the input is empty, remove all items from the results div and hide the filter dropdown
    if (sanitizedPub === '') {
        while (l.firstChild) {
            l.removeChild(l.firstChild);
        }
        filter.style.display = 'none';
        nPubInput.style.display = 'none';
    } else {
        // Fetch and display results when the search bar is not empty
        fetch(`/api/superheroInfo/searchFunction/publisher/${sanitizedPub}/${n}`)
            .then(res => res.json())
            .then(data => {
                // clearing the other nInputs and filter dropdowns
                const nNameInput = document.getElementById('nNameInput');
                const nRaceInput = document.getElementById('nRaceInput');
                const nPowerInput = document.getElementById('nPowerInput');
                nNameInput.style.display = 'none';
                nRaceInput.style.display = 'none';
                nPowerInput.style.display = 'none';

                const filterName = document.getElementById('nameDropdownFilter');
                const filterRace = document.getElementById('raceDropdownFilter');
                const filterPow = document.getElementById('powerDropdownFilter');
                filterName.style.display = 'none';
                filterRace.style.display = 'none';
                filterPow.style.display = 'none';
                
                // looping through the data and creating a list item for each superhero
                data.forEach(e => {
                    const item = document.createElement('li');

                    item.appendChild(document.createTextNode(`ID: ${e.id}, _____ `));
                    item.appendChild(document.createTextNode(`NAME: ${e.name}, _____`));
                    if (e.race == '-') {
                        item.appendChild(document.createTextNode(`RACE: Unknown, _____`));
                    } else {
                        item.appendChild(document.createTextNode(`RACE: ${e.race}, _____`));
                    }
                    if (e.publisher == '') {
                        item.appendChild(document.createTextNode(`PUB: Unknown _____`));
                    } else {
                        item.appendChild(document.createTextNode(`PUB: ${e.publisher}, _____`));
                    }
                    item.appendChild(document.createTextNode(`POWERS: ${e.powers},`));

                    const result = item.textContent;
                    results.push(result);

                    l.appendChild(item);
                    filter.style.display = 'inline-block';
                    nPubInput.style.display = 'inline-block';
                });

                // getting the selected option from the filter dropdown
                const option = document.getElementById('pubDropdownFilter');
                const selectedOption = option.value;

                // Sort the results array based on the selected option
                if (selectedOption == 'name') {
                    results.sort((a, b) => {
                        const nameA = a.match(/NAME: (.*)/)[1];
                        const nameB = b.match(/NAME: (.*)/)[1];
                        return nameA.localeCompare(nameB);
                    });
                } else if (selectedOption == 'race') {
                    results.sort((a, b) => {
                        const raceA = a.match(/RACE: (.*)/)[1];
                        const raceB = b.match(/RACE: (.*)/)[1];
                        return raceA.localeCompare(raceB);
                    });
                } else if (selectedOption == 'publisher') {
                    results.sort((a, b) => {
                        const pubA = a.match(/PUB: (.*)/)[1];
                        const pubB = b.match(/PUB: (.*)/)[1];
                        return pubA.localeCompare(pubB);
                    });
                } else if (selectedOption == 'power') {
                    results.sort((a, b) => {
                        const powersA = countPowers(a);
                        const powersB = countPowers(b);
                        return powersB - powersA;
                    });
                }

                // Clear the current list and display the sorted results
                l.innerHTML = '';
                results.forEach(result => {
                    const item = document.createElement('li');
                    item.textContent = result;
                    l.appendChild(item);
                });

                // Display a message if no results are found
                if (l.childElementCount === 0) {
                    let noResults = document.createElement('p');
                    noResults.appendChild(document.createTextNode(`No results found for '${sanitizedPub}'.`))
                    noResults.setAttribute("id", "noResults");
                    l.appendChild(noResults);
                    filter.style.display = 'none';
                }
            });
    }
}

// Function to search by power
function searchByPower() {
    const results = [];
    // getting the input from the search bar
    const inputElement = document.getElementById('powerInput');
    const power = inputElement.value;
    // sanitizing the input
    const sanitizedPower1 = sanitizeInput(power);
    // capitalizing the first letter of the input to make a secure match
    const sanitizedPower = capitalizeFirstLetter(sanitizedPower1);

    // getting the number of matches input
    let nPowerInput = document.getElementById('nPowerInput');
    // sanitizing the input
    const n = sanitizeNumberInput(nPowerInput.value);

    // getting the results div
    const l = document.getElementById('results');
    //  getting the filter dropdown
    const filter = document.getElementById('powerDropdownFilter');

    // if the input is empty, remove all items from the results div and hide the filter dropdown
    if (sanitizedPower === '') {
        while (l.firstChild) {
            l.removeChild(l.firstChild);
        }
        filter.style.display = 'none';
        nPowerInput.style.display = 'none';
    } else {
        // Fetch and display results when the search bar is not empty
        fetch(`/api/superheroInfo/searchFunction/powers/${sanitizedPower}/${n}`)
            .then(res => res.json())
            .then(data => {
                // clearing the other nInputs and filter dropdowns
                const nNameInput = document.getElementById('nNameInput');
                const nRaceInput = document.getElementById('nRaceInput');
                const nPubInput = document.getElementById('nPubInput');
                nNameInput.style.display = 'none';
                nRaceInput.style.display = 'none';
                nPubInput.style.display = 'none';

                const filterName = document.getElementById('nameDropdownFilter');
                const filterRace = document.getElementById('raceDropdownFilter');
                const filterPub = document.getElementById('pubDropdownFilter');
                filterName.style.display = 'none';
                filterRace.style.display = 'none';
                filterPub.style.display = 'none';

                // looping through the data and creating a list item for each superhero
                data.forEach(e => {
                    const item = document.createElement('li');

                    item.appendChild(document.createTextNode(`ID: ${e.id}, _____ `));
                    item.appendChild(document.createTextNode(`NAME: ${e.name}, _____`));
                    if (e.race == '-') {
                        item.appendChild(document.createTextNode(`RACE: Unknown, _____`));
                    } else {
                        item.appendChild(document.createTextNode(`RACE: ${e.race}, _____`));
                    }
                    if (e.publisher == '') {
                        item.appendChild(document.createTextNode(`PUB: Unknown _____`));
                    } else {
                        item.appendChild(document.createTextNode(`PUB: ${e.publisher}, _____`));
                    }
                    item.appendChild(document.createTextNode(`POWERS: ${e.powers},`));

                    const result = item.textContent;
                    results.push(result);

                    l.appendChild(item);
                    filter.style.display = 'inline-block';
                    nPowerInput.style.display = 'inline-block';
                });
            // getting the selected option from the filter dropdown
            const option = document.getElementById('powerDropdownFilter');
            const selectedOption = option.value;

            // Sort the results array based on the selected option
            if (selectedOption == 'name') {
                results.sort((a, b) => {
                    const nameA = a.match(/NAME: (.*)/)[1];
                    const nameB = b.match(/NAME: (.*)/)[1];
                    return nameA.localeCompare(nameB);
                });
            } else if (selectedOption == 'race') {
                console.log('sorting by race');
                results.sort((a, b) => {
                    const raceA = a.match(/RACE: (.*)/)[1];
                    const raceB = b.match(/RACE: (.*)/)[1];
                    return raceA.localeCompare(raceB);
                });
            } else if (selectedOption == 'publisher') {
                console.log('sorting by publisher');
                results.sort((a, b) => {
                    const pubA = a.match(/PUB: (.*)/)[1];
                    const pubB = b.match(/PUB: (.*)/)[1];
                    return pubA.localeCompare(pubB);
                });
            } else if (selectedOption == 'power') {
                console.log('sorting by power');
                results.sort((a, b) => {
                    const powersA = countPowers(a);
                    const powersB = countPowers(b);
                    return powersB - powersA;
                });
            }

            // Clear the current list and display the sorted results
            l.innerHTML = ''; // Clear the list
            while (l.firstChild) {
                l.removeChild(l.firstChild);
            }
            results.forEach(result => {
                const item = document.createElement('li');
                item.textContent = result;
                l.appendChild(item);
            });

            // Display a message if no results are found
            if (l.childElementCount === 0) {
                let noResults = document.createElement('p');
                noResults.appendChild(document.createTextNode(`No results found for '${sanitizedPower1}'.`))
                noResults.setAttribute("id", "noResults");
                l.appendChild(noResults);
                filter.style.display = 'none';
            }
        });
    }
}

// Function to capitalize the first letter of a string
// Used to make a secure match when the user enters a specific power because i cannot manipulate the actual JSON file
function capitalizeFirstLetter(input) {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

// Function to create a new list
// input sanitized in backend!
function createList() {
    // getting the user input
    const listNameInput = document.getElementById('listNameInput');
    const listName = listNameInput.value;
    // creating a new paragraph element to display if successful or not
    const item = document.createElement('p');
    item.setAttribute("id", "noResults");

    clearTexts();

    // getting the createList div
    const l = document.getElementById('createList');

    // creating the data object to send to the api
    const data = {
        listName: listName
    }

    // sending the data to the api
    fetch('/api/superheroInfo/lists/createList', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => {
        // clearing the createList div
        while (l.firstChild) {
            l.removeChild(l.firstChild);
        }
        // checking the response status and displaying the appropriate message
        if (res.status === 200) {
            // Handle success
            item.appendChild(document.createTextNode(`List created successfully!`));
            l.appendChild(item)
        } else if (res.status === 400) { 
            // Handle 400 bad request response
            item.appendChild(document.createTextNode(`List already exists!`));
            l.appendChild(item)
        } else if (listName == '') {
            // Handle empty input
            item.appendChild(document.createTextNode(`Please fill out both inputs.`));
            l.appendChild(item)
        } else {
            // Handle other errors
            item.appendChild(document.createTextNode(`An unspecified error occurred while creating the list! Please try again.`));
            l.appendChild(item)
        }
    })
    .catch(error => {
        // Handle fetch error
        console.error('Error:', error);
    });

    // updating
    getLists();
    refreshListDetails();
    listNameInput.value = '';
}

// Function to delete an existing list
// input sanitized in backend!
function deleteList() {
    // getting the user input
    const listNameInput = document.getElementById('deleteListNameInput');
    const listName = listNameInput.value;
    // creating a new paragraph element to display if successful or not
    const item = document.createElement('p');
    item.setAttribute("id", "noResults");

    clearTexts();

    // getting the deleteList div
    const l = document.getElementById('deleteList');

    // sending the data to the api
    fetch(`/api/superheroInfo/lists/${listName}/deleteList`, {
        method: 'DELETE',
    })
    .then(res => {
        // clearing the deleteList div
        while (l.firstChild) {
            l.removeChild(l.firstChild);
        }
        // checking the response status and displaying the appropriate message
        if (res.status === 200) {
            // Handle success
            item.appendChild(document.createTextNode(`List deleted successfully!`));
            l.appendChild(item)
        } else if (res.status === 404) { 
            // Handle 404 response
            item.appendChild(document.createTextNode(`List doesn't exist`));
            l.appendChild(item)
        } else {
            // Handle other errors
            item.appendChild(document.createTextNode(`An unspecified error occurred while deleting the list! Please try again.`));
            l.appendChild(item)
        }
    })
    .catch(error => {
        // Handle fetch error
        console.error('Error:', error);
    });

    // updating
    getLists();
    refreshListDetails();
    listNameInput.value = '';
}

// Function to add a superhero to a list
// input sanitized in backend!
function addSuperheroToList() {
    // getting the user input
    const findListInput = document.getElementById('findListInput');
    const findListInputVal = findListInput.value;
    // getting the user input
    const addSuperheroInput = document.getElementById('addSuperheroInput');
    const addSuperheroInputVal = addSuperheroInput.value;
    // creating a new paragraph element to display if successful or not
    const item = document.createElement('p');
    item.setAttribute("id", "noResults");

    clearTexts();

    // getting the addToList div
    const l = document.getElementById('addToList');
    // sending the data to the api
    fetch(`/api/superheroInfo/lists/${findListInputVal}/addSuperhero/${addSuperheroInputVal}`, {
        method: 'POST',
    })
    .then(res => {
        // clearing the addToList div
        while (l.firstChild) {
            l.removeChild(l.firstChild);
        }
        // checking the response status and displaying the appropriate message
        if (res.status === 200) {
            // Handle success
            item.appendChild(document.createTextNode(`Superhero with ID ${addSuperheroInputVal} successfully added!`));
            l.appendChild(item)
        } else if (res.status === 400) { 
            // Handle 400 bad request response
            item.appendChild(document.createTextNode(`Superhero with ID ${addSuperheroInputVal} already in the list '${findListInputVal}'.`));
            l.appendChild(item)
        } else if (res.status === 404) {
            // Handle 404 not found response
            item.appendChild(document.createTextNode(`The list/superhero does not exist!`));
            l.appendChild(item)
        } else {
            // Handle other errors
            item.appendChild(document.createTextNode(`An unspecified error occurred. Please try again.`));
            l.appendChild(item)
        }
    })
    .catch(error => {
        // Handle fetch error
        console.error('Error:', error);
    });
    
    // updating
    getLists();
    refreshListDetails();
}

// Function to sanitize user input on the frontend
function sanitizeInput(input) {
    // removing potentially unsafe characters using regex and returning the sanitized version
    console.log('Input sanitization occuring...')
    return input.replace(/[^a-zA-Z0-9_\-.\s]/g, '');
}

// Function to sanitize user input on the frontend
function sanitizeNumberInput(input) {
    console.log('Input sanitization occuring...')
    return parseInt(input);
}

// Function to clear the text results to avoid messiness
function clearTexts() {
    // getting each result div
    const l1 = document.getElementById('addToList');
    const l2 = document.getElementById('deleteList');
    const l3 = document.getElementById('createList');

    // removing the items from each result div
    while (l1.firstChild) {
        l1.removeChild(l1.firstChild);
    }
    while (l2.firstChild) {
        l2.removeChild(l2.firstChild);
    }
    while (l3.firstChild) {
        l3.removeChild(l3.firstChild);
    }
}
  
// Function to count the number of powers in a result string
function countPowers(result) {
    // Use a regular expression to match the powers section in the result string
    const powersMatch = result.match(/POWERS: (.*)/);

    // Check if powers are found in the result
    if (powersMatch) {
        // Extract individual powers by splitting the matched powers using commas
        const powers = powersMatch[1].split(',').map(power => power.trim());

        // Return the count of powers
        return powers.length;
    } else {
        // Return 0 if no powers are found in the result
        return 0;
    }
}