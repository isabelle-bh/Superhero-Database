document.getElementById('addlist').addEventListener('click', addList);
document.getElementById('searchName').addEventListener('click', searchByName);
document.getElementById('searchRace').addEventListener('click', searchByRace);
document.getElementById('searchPublisher').addEventListener('click', searchByPublisher);


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
            if (e.name.toLowerCase() === name.toLowerCase()) {
                const item = document.createElement('li');
                item.appendChild(document.createTextNode(`${e.name}, ${e.Race}, ${e.Publisher}`));
                l.appendChild(item);
            }
        });
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
            if (e.Race.toLowerCase() === race.toLowerCase()) {
                const item = document.createElement('li');
                item.appendChild(document.createTextNode(`${e.name}, ${e.Race}, ${e.Publisher}`));
                l.appendChild(item);
            }
        });
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
            if (e.Publisher.toLowerCase() === publisher.toLowerCase()) {
                const item = document.createElement('li');
                item.appendChild(document.createTextNode(`${e.name}, ${e.Race}, ${e.Publisher}`));
                l.appendChild(item);
            }
        });
    });
}

function addList() {
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