

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
        });

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