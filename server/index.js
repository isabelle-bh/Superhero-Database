
// import json files and other required modules
const superheroInfo = require('./superhero_info.json');
const superheroPowers = require('./superhero_powers.json'); // Load superhero_powers data
const express = require('express');
const app = express();
const port = 3000;
const router = express.Router();
const routerLists = express.Router();

// middleware to sanitize input
function sanitizeInput(req, res, next) {
    const maxLength = 20; // Adjust the maximum length as needed
    const maxIdLength = 3;

    // Sanitize ID by converting it to an integer
    if (req.params.id) {
        req.params.id = req.params.id.toString();
        req.params.id = req.params.id.slice(0, maxIdLength);
        req.params.id = parseInt(req.params.id);
    }

    // Sanitize name by removing potentially harmful characters
    if (req.params.listName) {
        req.params.listName = req.params.listName.replace(/[<>&"'`;()/\\]/g, '');
        req.params.listName = req.params.listName.slice(0, maxLength);
    }

    // Sanitize name by removing potentially harmful characters
    if (req.body.listName) {
        req.body.listName = req.body.listName.replace(/[<>&"'`;()/\\]/g, '');
        req.body.listName = req.body.listName.slice(0, maxLength);
    }

    // Sanitize superheroId and power by converting them to integers
    if (req.params.superheroId) { 
        req.params.superheroId = req.params.superheroId.toString();
        req.params.superheroId = req.params.superheroId.slice(0, maxIdLength);
        req.params.superheroId = parseInt(req.params.superheroId);  
    }

    // Sanitize power by removing potentially harmful characters
    if (req.params.power) { 
        req.params.power = req.params.power.replace(/[^\w\s]/gi, '');
        req.params.power = req.params.power.slice(0, maxLength);
    }

    // Continue to the next middleware or route handler
    next(); 
}

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
        const superheroDetails = superheroInfo.map(superhero => {
            const powers = getSuperheroPowers(superhero.name);
            return {
                id: superhero.id,
                name: superhero.name,
                information: superhero,
                powers: powers,
            };
        });
        res.send(superheroDetails);
    });

// routes for /api/superheroInfo/:id
router.route('/:id')
    .get(sanitizeInput, (req, res) => {
        const superhero = superheroInfo.find(p => p.id === parseInt(req.params.id));
        if (superhero) {
            
            res.send(superhero);
        } else {
            res.status(404).send(`Superhero ${req.params.id} was not found!`);
        }
    });

// routes for /api/superheroInfo/:id/powers
router.route('/:id/powers')
    // get a list of powers for a given superhero
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

            // Find the superhero in superhero_powers by name
            superheroPowers.forEach(hero => {
                if (hero.hero_names === superheroName) {
                    for (const power in hero) {
                        // Check if the power exists and is true
                        if (power !== 'hero_names' && hero.hasOwnProperty(power) && hero[power] === 'True') {
                            // Add the power to the list of powers
                            powers.push(power);
                        }
                    }
                }
            });
            // if powers is empty, send 404
            if (powers.length >0 ) {
                res.send(powers);
            } else {
                res.status(404).send(`Superpowers for superhero ${superhero.name} with ID ${superhero.id} not found`);
            }
        }
    });

// routes for /api/superheroInfo/superheroes-by-power/:power
router.route('/superheroes-by-power/:power')
    // get a list of superheroes with a given power
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
            // Create superhero details with powers
            const superheroDetails = superheroesWithPower.map(superhero => {
                const powers = getSuperheroPowers(superhero.name);
                return {
                    id: superhero.id,
                    name: superhero.name,
                    information: superhero,
                    powers: powers,
                };
            });
            res.send(superheroDetails);
        } else {
            // Send 404 if no superheroes found with the power
            res.status(404).send(`No superheroes found with the power '${powerToSearch}'`);
        }
    });


// install the router at /api/superheroInfo
app.use('/api/superheroInfo', router);

// parse data in body as JSON
routerLists.use(express.json());
routerLists.use(sanitizeInput);

// create a new superhero list
const superheroLists = {}; // Store superhero lists

// routes for /api/superheroInfo/lists/createList
routerLists.route('/createList')
    // create a new superhero list
    .post(sanitizeInput, (req, res) => {
        const listName = req.body.listName;

        // Check if the list name is missing or already exists
        if (!listName) {
            res.status(400).send('Missing list name');
        } else if (superheroLists[listName]) {
            res.status(400).send('List name already exists');
        } else {
            // Create the list
            superheroLists[listName] = [];
            res.send(`Superhero list '${listName}' created successfully`);
        }
    });

// routes for /api/superheroInfo/lists/getLists
routerLists.route('/getLists')
    // get a list of superhero lists
    .get((req, res) => {
        const listNames = Object.keys(superheroLists);
        res.send(listNames);
    });
    
// routes for /api/superheroInfo/lists/:listName/addSuperhero/:superheroId
routerLists.route('/:listName/addSuperhero/:superheroId')
    // add a superhero to a given list
    .post(sanitizeInput, (req, res) => {
        const listName = req.params.listName;
        const superheroId = parseInt(req.params.superheroId);

        // Check if the list name is missing
        if (!superheroLists[listName]) {
            res.status(404).send(`Superhero list '${listName}' does not exist`);
        } else {
            // Find the superhero in superhero_info by ID
            const superhero = superheroInfo.find(p => p.id === superheroId);
            if (superhero) {
                // Check if the superhero is already in the list
                if (superheroLists[listName].includes(superhero.id)) {
                    res.status(400).send('Superhero already in list.');
                } else {
                    // Add the superhero to the list
                    superheroLists[listName].push(superhero.id);
                    res.send(`Superhero added to list '${listName}'`);
                }  
            } else {
                // Send 404 if the superhero is not found
                res.status(404).send(`Superhero with ID ${superheroId} not found`);
            }
        }
    });

// routes for /api/superheroInfo/lists/:listName/superheroes
routerLists.route('/:listName/superheroes')
    // get a list of superheroes saved in a given list
    .get(sanitizeInput, (req, res) => {
        const listName = req.params.listName;

        // Check if the list does not exist
        if (!superheroLists[listName]) {
            res.status(404).send(`Superhero list '${listName}' does not exist`);
        } else {
            // send the list of superheroes
            res.send(superheroLists[listName]);
        }
    });

// routes for /api/superheroInfo/lists/:listName/deleteList
routerLists.route('/:listName/deleteList')
    // delete a superhero from a given list
    .delete(sanitizeInput, (req, res) => {
        const listName = req.params.listName;

        // Check if the list does not exist
        if (!superheroLists[listName]) {
            res.status(404).send(`Superhero list '${listName}' does not exist`);
        } else {
            // Delete the list
            delete superheroLists[listName];
            res.send(`Superhero list '${listName}' deleted`);
        }
    });

// routes for /api/superheroInfo/lists/:listName/getSuperheroesDetails
routerLists.route('/:listName/getSuperheroesDetails')
    // get a list of names, information, and powers of all superheroes saved in a given list
    .get(sanitizeInput, (req, res) => {
        const listName = req.params.listName;

        // Check if the list does not exist
        if (!superheroLists[listName]) {
            res.status(404).send(`Superhero list '${listName}' does not exist`);
        } else {
            // Get the list of superhero IDs
            const superheroIds = superheroLists[listName];
            const superheroDetails = [];

            // Get the superhero details
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
            // Send the superhero details
            res.send(superheroDetails);
        }
    });

// function to get superhero powers by name
function getSuperheroPowers(superheroName) {
    const powers = [];

    // Find the superhero in superhero_powers by name
    superheroPowers.forEach(hero => {
        if (hero.hero_names === superheroName) {
            for (const power in hero) {
                // Check if the power exists and is true
                if (power !== 'hero_names' && hero.hasOwnProperty(power) && hero[power] === 'True') {
                    // Add the power to the list of powers
                    powers.push(` ${power}`);
                }
            }
        }
    });
    return powers;
}

// install the router at /api/superheroInfo/lists
app.use('/api/superheroInfo/lists', routerLists);

// start the server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
