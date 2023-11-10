
const superheroInfo = require('../superhero_info.json');
const superheroPowers = require('../superhero_powers.json'); // Load superhero_powers data
const express = require('express');
const app = express();
const port = 3000;
const router = express.Router();
const routerLists = express.Router();

function sanitizeInput(req, res, next) {
    const maxLength = 20; // Adjust the maximum length as needed
    const maxIdLength = 3; // Adjust the maximum length as needed

    if (req.params.id) {
        // Sanitize ID by converting it to an integer
        req.params.id = parseInt(req.params.id);

        req.params.id = req.params.id.slice(0, maxIdLength);
    }

    if (req.params.listName) {
        // Sanitize listName by removing potentially harmful characters
        req.params.listName = req.params.listName.replace(/[<>&"'`;()/\\]/g, ''); // Adjust the list of harmful characters

        req.params.listName = req.params.listName.slice(0, maxLength);
    }

    if (req.body.listName) {
        // Sanitize listName by removing potentially harmful characters
        req.body.listName = req.body.listName.replace(/[<>&"'`;()/\\]/g, ''); // Adjust the list of harmful characters

        req.body.listName = req.body.listName.slice(0, maxLength);
    }

    if (req.params.superheroId) { 
        // Sanitize superheroId by converting it to an integer
        req.params.superheroId = parseInt(req.params.superheroId);  

        req.params.superheroId = req.params.superheroId.slice(0, maxIdLength);
    }

    if (req.params.power) { 
        // Sanitize power by removing potentially harmful characters
        req.params.power = req.params.power.replace(/[^\w\s]/gi, '');

        req.params.power = req.params.power.slice(0, maxLength);
    }

    next(); // Continue to the next middleware or route handler
}

// superheroInfo store

// setup serving front-end code
app.use('/', express.static('client'));

// setup middleware to do logging
app.use((req, res, next) => { // for all routes
    console.log(`${req.method} request for ${req.url}`);
    next(); // keeps going
});

// parse data in body as JSON
router.use(express.json());
router.use(sanitizeInput);

// routes for /api/superheroInfo
router.route('/') // all the routes to the base prefix
    // get a list of superheroInfo
    .get((req, res) => {
        res.send(superheroInfo);
    });

router.route('/:id')
    .get(sanitizeInput, (req, res) => {
        const superhero = superheroInfo.find(p => p.id === parseInt(req.params.id));
        if (superhero) {
            res.send(superhero);
        } else {
            res.status(404).send(`Superhero ${req.params.id} was not found!`);
        }
    });

router.route('/:id/powers')
    .get(sanitizeInput, (req, res) => {
        const superheroId = parseInt(req.params.id);

        // Find the superhero in superhero_info by ID
        const superhero = superheroInfo.find(superhero => superhero.id === superheroId);

        if (!superhero) {
            res.status(404).send(`Superhero with ID ${superheroId} not found`);
        } else {
            // Attempt to retrieve the powers based on the superhero's name
            const superheroName = superhero.name;
            const powers = [];

            superheroPowers.forEach(hero => {
                if (hero.hero_names === superheroName) {
                    for (const power in hero) {
                        if (power !== 'hero_names' && hero.hasOwnProperty(power) && hero[power] === 'True') {
                            powers.push(power);
                        }
                    }
                }
            });
            if (powers.length >0 ) {
                res.send(powers);
            } else {
                res.status(404).send(`Superpowers for superhero ${superhero.name} with ID ${superhero.id} not found`);
            }
        }
    });

// Add a new route to get superheroes by a specific power
router.route('/superheroes-by-power/:power')
    .get(sanitizeInput, (req, res) => {
        const powerToSearch = req.params.power;

        // Filter superheroes based on the power
        const superheroesWithPower = superheroInfo.filter(superhero => {
        // Check if the power exists in the superhero's powers
        return superheroPowers.some(hero => {
            return hero.hero_names === superhero.name && hero[powerToSearch] === 'True';
        });
        });

        if (superheroesWithPower.length > 0) {
            res.send(superheroesWithPower);
        } else {
            res.status(404).send(`No superheroes found with the power '${powerToSearch}'`);
        }
  });


// install the router at /api/superheroInfo
app.use('/api/superheroInfo', router);

// parse data in body as JSON
routerLists.use(express.json());
routerLists.use(sanitizeInput);

// step 5: create a new superhero list
const superheroLists = {}; // Store superhero lists

// DONE
routerLists.route('/createList')
    .post(sanitizeInput, (req, res) => {
        const listName = req.body.listName;

        if (!listName) {
            res.status(400).send('Missing list name');
        } else if (superheroLists[listName]) {
            res.status(400).send('List name already exists');
        } else {
            superheroLists[listName] = [];
            res.send(`Superhero list '${listName}' created successfully`);
        }
    });
    
// DONE 
// get list of lists
routerLists.route('/getLists')
    .get((req, res) => {
        const listNames = Object.keys(superheroLists);
        res.send(listNames);
    });
    
// DONE
// step 6 Save a list of superhero IDs to a given list name
routerLists.route('/:listName/addSuperhero/:superheroId')
    .post(sanitizeInput, (req, res) => {
        const listName = req.params.listName;
        const superheroId = parseInt(req.params.superheroId);

        if (!superheroLists[listName]) {
            res.status(404).send(`Superhero list '${listName}' does not exist`);
        } else {
            const superhero = superheroInfo.find(p => p.id === superheroId);
            if (superhero) {
                if (superheroLists[listName].includes(superhero.id)) {
                    res.status(400).send('Superhero already in list.');
                } else {
                    superheroLists[listName].push(superhero.id);
                    res.send(`Superhero added to list '${listName}'`);
                }  
            } else {
                res.status(404).send(`Superhero with ID ${superheroId} not found`);
            }
        }
    });

// DONE    
// Step 7: Get the list of superhero IDs for a given list
routerLists.route('/:listName/superheroes')
    .get(sanitizeInput, (req, res) => {
        const listName = req.params.listName;

        if (!superheroLists[listName]) {
            res.status(404).send(`Superhero list '${listName}' does not exist`);
        } else {
            res.send(superheroLists[listName]);
        }
    });

// Step 8: Delete a list of superheroes with a given name
routerLists.route('/:listName/deleteList')
    .delete(sanitizeInput, (req, res) => {
        const listName = req.params.listName;

        if (!superheroLists[listName]) {
            res.status(404).send(`Superhero list '${listName}' does not exist`);
        } else {
            delete superheroLists[listName];
            res.send(`Superhero list '${listName}' deleted`);
        }
    });

// step 9: get a list of names, information, and powers of all superheroes saved in a given list
routerLists.route('/:listName/getSuperheroesDetails')
    .get(sanitizeInput, (req, res) => {
        const listName = req.params.listName;

        if (!superheroLists[listName]) {
            res.status(404).send(`Superhero list '${listName}' does not exist`);
        } else {
            const superheroIds = superheroLists[listName];
            const superheroDetails = [];

            superheroIds.forEach(superheroId => {
                const superhero = superheroInfo.find(p => p.id === superheroId);
                if (superhero) {
                    const powers = getSuperheroPowers(superhero.name);
                    superheroDetails.push({
                        id: superhero.id,
                        name: superhero.name,
                        information: superhero,
                        powers: powers,
                    });
                }
            });
            res.send(superheroDetails);
        }
    });

// function to get superhero powers by name
function getSuperheroPowers(superheroName) {
    const powers = [];

    superheroPowers.forEach(hero => {
        if (hero.hero_names === superheroName) {
            for (const power in hero) {
                if (power !== 'hero_names' && hero.hasOwnProperty(power) && hero[power] === 'True') {
                    powers.push(power);
                }
            }
        }
    });

    return powers;
}

// install the router at /api/superheroInfo/lists
app.use('/api/superheroInfo/lists', routerLists);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
