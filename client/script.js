
document.getElementById('addlist').addEventListener('click', addList);
var listInput = document.getElementById("listInput");
listInput.addEventListener("keypress", function(event) {
    if(event.key === "Enter") {
        event.preventDefault();
        document.getElementById("createList").click();
    }
})

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

function searchByName() {
    fetch("/api/superheroInfo")
    .then(res => res.json())
    .then(data => {
        const name = document.getElementById('nameInput').value;
        const l = document.getElementById('results');
        while (l.firstChild) {
            l.removeChild(l.firstChild);
        }
        data.forEach(e => {
            if (e.name.toLowerCase().startsWith(name.toLowerCase())) {
                const item = document.createElement('li');
                item.appendChild(document.createTextNode(`${e.name}, ${e.Race}, ${e.Publisher}`));
                l.appendChild(item);
            }
        });
        if(name === '') {
            while (l.firstChild) {
                l.removeChild(l.firstChild);
            }
        }
    });
}

function searchByRace() {
    fetch("/api/superheroInfo")
    .then(res => res.json())
    .then(data => {
        const race = document.getElementById('raceInput').value;
        const l = document.getElementById('results');
        while (l.firstChild) {
            l.removeChild(l.firstChild);
        }
        data.forEach(e => {
            if (e.Race.toLowerCase().startsWith(race.toLowerCase())) {
                const item = document.createElement('li');
                item.appendChild(document.createTextNode(`${e.name}, ${e.Race}, ${e.Publisher}`));
                l.appendChild(item);
            }
        });
        if(race === '') {
            while (l.firstChild) {
                l.removeChild(l.firstChild);
            }
        }
    });
}

function searchByPublisher() {
    fetch("/api/superheroInfo")
    .then(res => res.json())
    .then(data => {
        const publisher = document.getElementById('pubInput').value;
        const l = document.getElementById('results');
        while (l.firstChild) {
            l.removeChild(l.firstChild);
        }
        data.forEach(e => {
            if (e.Publisher.toLowerCase().startsWith(publisher.toLowerCase())) {
                const item = document.createElement('li');
                item.appendChild(document.createTextNode(`${e.name}, ${e.Race}, ${e.Publisher}`));
                l.appendChild(item);
            }
        });
        if(publisher === '') {
            while (l.firstChild) {
                l.removeChild(l.firstChild);
            }
        }
    });
}
const listNameInput = document.getElementById('listNameInput');
const createListButton = document.getElementById('createListButton');
const listsContainer = document.getElementById('listsContainer');

createListButton.addEventListener('click', () => {
  const listName = listNameInput.value;

  const data = {
    listName: listName
  };

  fetch('/api/superheroInfo/lists/createList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);

      // Create a list item and add it to the ordered list
      const listItem = document.createElement('li');
      listItem.textContent = data;
      listsContainer.appendChild(listItem);

      listNameInput.value = '';
    })
    .catch(error => {
      console.error(error);
    });
});

function createList() {
    const newlist = {
        name: document.getElementById('name').value,
    }
    console.log(newpart)

    fetch('/api/superheroInfo', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(newpart)
    })
    .then(res => {
        if (res.ok) {
            res.json()
            .then(data => {
                console.log(data);
                getSuperhero();
                document.getElementById('status').textContent = `Created list ${newlist.name}`;
            })
            .catch(err => console.log('Failed to get json object'))
        } else {
            console.log('Error: ', res.status);
            document.getElementById(`status`).textContent = 'Failed to create list';
        }
    })
    .catch()
}