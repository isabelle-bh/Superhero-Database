
getLists();

function getSuperhero() {
    fetch("/api/superheroInfo")
    .then(res => res.json())
    .then(data => {
        const l = document.getElementById('results');
        while (l.firstChild) {
            l.removeChild(l.firstChild);
        }
        data.forEach(e => {
            const item = document.createElement('li');
            item.appendChild(document.createTextNode(`${e.name}, ${e.Gender}, ${e.Publisher}`));
            l.appendChild(item);
        });
    });
}

function getLists() {
    fetch("/api/superheroInfo/lists/getLists")
        .then(res => res.json())
        .then(data => {
            const l = document.getElementById('listsContainer');
            while (l.firstChild) {
                l.removeChild(l.firstChild);
            }
            data.forEach(e => {
                const item = document.createElement('button');
                item.classList.add("list-button"); // Add a class for styling
                item.setAttribute("data-listname", e); // Store list name in a data attribute
                item.appendChild(document.createTextNode(e));
                l.appendChild(item);
            });
        });
}

const listResults = document.getElementById('listResults');

// Add a click event listener to the parent container
document.addEventListener('click', function(event) {
    // Check if the clicked element has the "list-button" class
    if (event.target && event.target.classList.contains('list-button')) {
        const listName = event.target.getAttribute("data-listname"); // Get the list name from data attribute
        getListDetails(listName); // Call the function with the list name

        const buttons = document.querySelectorAll('.list-button');
        buttons.forEach(button => {
            button.classList.remove('selected-btn'); // Remove the class from all buttons
        });
        event.target.classList.add('selected-btn');
    }
});

function getListDetails(listName) {
    fetch(`/api/superheroInfo/lists/${listName}/getSuperheroesDetails`)
    .then(res => res.json())
    .then(data => {
        const l = document.getElementById('listResults');
        while (l.firstChild) {
            l.removeChild(l.firstChild);
        }
        data.forEach(e => {
            const item = document.createElement('li');
            
            item.appendChild(document.createTextNode(`ID: ${e.id}`));
            item.appendChild(document.createElement('br'));
            item.appendChild(document.createTextNode(`Name: ${e.name}`));
            item.appendChild(document.createElement('br'));
            item.appendChild(document.createTextNode(`Race: ${e.information.Race}`));
            item.appendChild(document.createElement('br'));
            item.appendChild(document.createTextNode(`Pub: ${e.information.Publisher}`));
            item.appendChild(document.createElement('br'));
            item.appendChild(document.createTextNode(`Powers: ${e.powers}`));

            l.appendChild(item);
        });
    });
}

function refreshListDetails() {
    const l = document.getElementById('listResults');
    while (l.firstChild) {
        l.removeChild(l.firstChild);
    }
}

function searchByName() {
    const results = [];
    fetch("/api/superheroInfo")
    .then(res => res.json())
    .then(data => {
        const inputElement = document.getElementById('nameInput');
        const name = inputElement.value;
        const sanitizedName = sanitizeInput(name);

        const l = document.getElementById('results');
        const filter = document.getElementById('nameDropdownFilter');
        while (l.firstChild) {
            l.removeChild(l.firstChild);
        }
        data.forEach(e => {
            if (e.name.toLowerCase().startsWith(sanitizedName.toLowerCase())) {
                const item = document.createElement('li');
            
                item.appendChild(document.createTextNode(`ID: ${e.id}, `));
                item.appendChild(document.createTextNode(`NAME: ${e.name}, `));
                if (e.Race == '-') {
                    item.appendChild(document.createTextNode(`RACE: Unknown, `));
                } else {
                    item.appendChild(document.createTextNode(`RACE: ${e.Race}, `));
                }
                if (e.Publisher == '') {
                    item.appendChild(document.createTextNode(`PUB: Unknown `));
                } else {
                    item.appendChild(document.createTextNode(`PUB: ${e.Publisher} `));
                }

                item.classList.add("search-results");

                const result = item.textContent;
                results.push(result);
                l.appendChild(item);
                filter.style.display = 'inline-block';
            }
        }); 
        const option = document.getElementById('nameDropdownFilter');
        const selectedOption = option.value;

        // Sort the results array by the "Race" field
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
        }

        // Clear the current list and display the sorted results
        l.innerHTML = ''; // Clear the list
        results.forEach(result => {
            const item = document.createElement('li');
            item.textContent = result;
            l.appendChild(item);
        });

        if (l.childElementCount === 0) {
            let noResults = document.createElement('p');
            noResults.appendChild(document.createTextNode(`No results found for '${sanitizedName}'`))
            noResults.setAttribute("id", "noResults");
            l.appendChild(noResults);
        }

        if (sanitizedName === '') {
            while (l.firstChild) {
                l.removeChild(l.firstChild);
            }
            filter.style.display = 'none';
        }
    });
}


function searchByRace() {
    const results = [];
    fetch("/api/superheroInfo")
    .then(res => res.json())
    .then(data => {
        const inputElement = document.getElementById('raceInput')
        const race = inputElement.value;
        const sanitizedRace = sanitizeInput(race);

        const l = document.getElementById('results');
        const filter = document.getElementById('raceDropdownFilter');
        while (l.firstChild) {
            l.removeChild(l.firstChild);
        }
        data.forEach(e => {
            if (e.Race.toLowerCase().startsWith(sanitizedRace.toLowerCase())) {
                const item = document.createElement('li');
            
                item.appendChild(document.createTextNode(`ID: ${e.id}, `));
                item.appendChild(document.createTextNode(`NAME: ${e.name}, `));
                if (e.Race == '-') {
                    item.appendChild(document.createTextNode(`RACE: Unknown, `));
                } else {
                    item.appendChild(document.createTextNode(`RACE: ${e.Race}, `));
                }                
                if (e.Publisher == '') {
                    item.appendChild(document.createTextNode(`PUB: Unknown `));
                } else {
                    item.appendChild(document.createTextNode(`PUB: ${e.Publisher} `));
                }

                const result = item.textContent;
                results.push(result);
            
                l.appendChild(item);
                filter.style.display = 'inline-block';
            }
        });

        const option = document.getElementById('raceDropdownFilter');
        const selectedOption = option.value;

        // Sort the results array by the "Race" field
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
        }

        // Clear the current list and display the sorted results
        l.innerHTML = ''; // Clear the list
        results.forEach(result => {
            const item = document.createElement('li');
            item.textContent = result;
            l.appendChild(item);
        });

        if (l.childElementCount === 0) {
            let noResults = document.createElement('p');
            noResults.appendChild(document.createTextNode(`No results found for '${sanitizedRace}'.`))
            noResults.setAttribute("id","noResults");
            l.appendChild(noResults);
        }
        if(sanitizedRace === '') {
            while (l.firstChild) {
                l.removeChild(l.firstChild);
            }
            filter.style.display = 'none';
        }
        return results;
    });
}

function searchByPublisher() {
    const results = [];
    fetch("/api/superheroInfo")
    .then(res => res.json())
    .then(data => {
        const inputElement = document.getElementById('pubInput');
        const publisher = inputElement.value;
        const sanitizedPub = sanitizeInput(publisher);

        const l = document.getElementById('results');
        const filter = document.getElementById('pubDropdownFilter');
        while (l.firstChild) {
            l.removeChild(l.firstChild);
        }
        data.forEach(e => {
            if (e.Publisher.toLowerCase().startsWith(sanitizedPub.toLowerCase())) {
                const item = document.createElement('li');
            
                item.appendChild(document.createTextNode(`ID: ${e.id}, `));
                item.appendChild(document.createTextNode(`NAME: ${e.name}, `));
                if (e.Race == '-') {
                    item.appendChild(document.createTextNode(`RACE: Unknown, `));
                } else {
                    item.appendChild(document.createTextNode(`RACE: ${e.Race}, `));
                }
                if (e.Publisher == '') {
                    item.appendChild(document.createTextNode(`PUB: Unknown `));
                } else {
                    item.appendChild(document.createTextNode(`PUB: ${e.Publisher} `));
                }

                const result = item.textContent;
                results.push(result);
            
                l.appendChild(item);
                filter.style.display = 'inline-block';
            }
        });

        const option = document.getElementById('pubDropdownFilter');
        const selectedOption = option.value;

        // Sort the results array by the "Race" field
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
        }

        // Clear the current list and display the sorted results
        l.innerHTML = ''; // Clear the list
        results.forEach(result => {
            const item = document.createElement('li');
            item.textContent = result;
            l.appendChild(item);
        });

        if (l.childElementCount === 0) {
            let noResults = document.createElement('p');
            noResults.appendChild(document.createTextNode(`No results found for '${sanitizedPub}'.`))
            noResults.setAttribute("id","noResults");
            l.appendChild(noResults);
        }
        if(sanitizedPub === '') {
            while (l.firstChild) {
                l.removeChild(l.firstChild);
            }
            filter.style.display = 'none';
        }
        return results;
    });
}

function searchByPower() {
    const results = [];
    const inputElement = document.getElementById('powerInput');
    const power = inputElement.value;
    const sanitizedPower1 = sanitizeInput(power);
    const sanitizedPower = capitalizeFirstLetter(sanitizedPower1);
    
    const l = document.getElementById('results');
    const filter = document.getElementById('dropdownFilter');
    
    // Remove existing results
    while (l.firstChild) {
        l.removeChild(l.firstChild);
    }

    if (sanitizedPower === '') {
        filter.style.display = 'none';
    } else {
        // Fetch and display results when the search bar is not empty
        fetch(`/api/superheroInfo/superheroes-by-power/${sanitizedPower}`)
            .then(res => res.json())
            .then(data => {
                while (l.firstChild) {
                    l.removeChild(l.firstChild);
                }
                data.forEach(e => {
                    const item = document.createElement('li');
                    item.appendChild(document.createTextNode(`ID: ${e.id}, `));
                    item.appendChild(document.createTextNode(`NAME: ${e.name}, `));
                    if (e.Race == '-') {
                        item.appendChild(document.createTextNode(`RACE: Unknown, `));
                    } else {
                        item.appendChild(document.createTextNode(`RACE: ${e.Race}, `));
                    }                    
                    if (e.Publisher == '') {
                        item.appendChild(document.createTextNode(`PUB: Unknown `));
                    } else {
                        item.appendChild(document.createTextNode(`PUB: ${e.Publisher} `));
                    }

                    const result = item.textContent;
                    results.push(result);

                    l.appendChild(item);
                    filter.style.display = 'inline-block';
                });
            });

            const option = document.getElementById('dropdownFilter');
            const selectedOption = option.value;
    
            // Sort the results array by the "Race" field
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
            }

            // Clear the current list and display the sorted results
            l.innerHTML = ''; // Clear the list
            results.forEach(result => {
                const item = document.createElement('li');
                item.textContent = result;
                l.appendChild(item);
            });

            if (l.childElementCount === 0) {
                let noResults = document.createElement('p');
                noResults.appendChild(document.createTextNode(`No results found for '${sanitizedPower1}'.`));
                noResults.setAttribute("id", "noResults");
                l.appendChild(noResults);
                filter.style.display = 'none';
            }
    }
    return results;
}

function capitalizeFirstLetter(input) {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

document.getElementById('powerInput').addEventListener('input', searchByPower);

function createList() {
    const listNameInput = document.getElementById('listNameInput');
    const listName = listNameInput.value;
    sanitizeListInput(listName);

    const data = {
        listName: listName
    }

    fetch('/api/superheroInfo/lists/createList', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => {
        if (res.status === 200) {
            // Handle success
            console.log(`List created successfully!`);
            const item = document.createElement('p');
            item.appendChild(document.createTextNode(`List created successfully!`));
            l.appendChild(item)
        } else if (res.status === 400) { 
            console.log('List already exists!')
            const item = document.createElement('p');
            item.appendChild(document.createTextNode(`List already exists!`));
            l.appendChild(item)
        } else if (listName == '') {
            const item = document.createElement('p');
            item.appendChild(document.createTextNode(`Please fill out both inputs.`));
            l.appendChild(item)
        } else {
            // Handle other errors
            console.error('An error occurred while creating the list!');
            const item = document.createElement('p');
            item.appendChild(document.createTextNode(`An unspecified error occurred while creating the list! Please try again.`));
            l.appendChild(item)
        }
    })
    .catch(error => {
        // Handle fetch error
        console.error('Error:', error);
    });

    getLists();
    refreshListDetails();
}

function deleteList() {
    const listNameInput = document.getElementById('deleteListNameInput');
    const listName = listNameInput.value;
    sanitizeListInput(listName);

    const data = {
        listName: listName
    }

    fetch(`/api/superheroInfo/lists/${listName}/deleteList`, {
        method: 'DELETE',
    })
    .then(res => {
        if (res.status === 200) {
            // Handle success
            console.log(`List deleted successfully!`);
            const item = document.createElement('p');
            item.appendChild(document.createTextNode(`List deleted successfully!`));
            l.appendChild(item)
        } else if (res.status === 404) { 
            console.log("List doesn't exist.")
            const item = document.createElement('p');
            item.appendChild(document.createTextNode(`List doesn't exist`));
            l.appendChild(item)
        } else if (listName == '') {
            const item = document.createElement('p');
            item.appendChild(document.createTextNode(`Please fill out inputs.`));
            l.appendChild(item)
        } else {
            // Handle other errors
            console.error('An error occurred while deleting the list!');
            const item = document.createElement('p');
            item.appendChild(document.createTextNode(`An unspecified error occurred while deleting the list! Please try again.`));
            l.appendChild(item)
        }
    })
    .catch(error => {
        // Handle fetch error
        console.error('Error:', error);
    });

    getLists();
    refreshListDetails();
}

function addSuperheroToList(listName) {
    const findListInput = document.getElementById('findListInput').value;
    sanitizeListInput(findListInput);
    const addSuperheroInput = document.getElementById('addSuperheroInput').value;
    sanitizeInput(addSuperheroInput);

    const l = document.getElementById('addToList');
    fetch(`/api/superheroInfo/lists/${findListInput}/addSuperhero/${addSuperheroInput}`, {
        method: 'POST',
    })
    .then(res => {
        while (l.firstChild) {
            l.removeChild(l.firstChild);
        }
        if (res.status === 200) {
            // Handle success
            console.log(`Superhero added to list '${findListInput}'`);
            const item = document.createElement('p');
            item.appendChild(document.createTextNode(`Superhero with ID ${addSuperheroInput} successfully added!`));
            l.appendChild(item)
        } else if (res.status === 400) { 
            console.log('Superhero already in list.')
            const item = document.createElement('p');
            item.appendChild(document.createTextNode(`Superhero with ID ${addSuperheroInput} already in the list '${findListInput}'.`));
            l.appendChild(item)
        } else if (findListInput == '' || addSuperheroInput == '') {
            const item = document.createElement('p');
            item.appendChild(document.createTextNode(`Please fill out both inputs.`));
            l.appendChild(item)
        } else if (res.status === 404) {
            console.error(`Superhero list '${listName}' does not exist`);
            const item = document.createElement('p');
            item.appendChild(document.createTextNode(`The list/superhero does not exist!`));
            l.appendChild(item)
        } else {
            // Handle other errors
            console.error('An error occurred while adding the superhero to the list');
            const item = document.createElement('p');
            item.appendChild(document.createTextNode(`An unspecified error occurred. Please try again.`));
            l.appendChild(item)
        }
    })
    .catch(error => {
        // Handle fetch error
        console.error('Error:', error);
    });
    getLists();
    refreshListDetails();
}

function sanitizeInput(input) {
    // removing potentially unsafe characters using regex
    console.log('Input sanitization occuring...')
    return input.replace(/[^a-zA-Z0-9_\-.\s]/g, '');
}

function sanitizeListInput(input) {
    // removing potentially unsafe characters using regex
    console.log('Input sanitization occuring...')
    return input.replace(/^[\u00BF-\u1FFF\u2C00-\uD7FF\w]{0,10}$/, '');
}
