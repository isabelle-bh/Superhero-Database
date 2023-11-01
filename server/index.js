const superheroInfo = require('../superhero_info.json');
const superheroPowers = require('../superhero_powers.json'); // Load superhero_powers data
const express = require('express');
const app = express();
const port = 3000;
const router = express.Router();

// superheroInfo store

// setup serving front-end code
app.use('/', express.static('static'));

// setup middleware to do logging
app.use((req, res, next) => { // for all routes
    console.log(`${req.method} request for ${req.url}`);
    next(); // keeps going
});

// parse data in body as JSON
router.use(express.json());

// routes for /api/superheroInfo
router.route('/') // all the routes to the base prefix
    // get a list of superheroInfo
    .get((req, res) => {
        res.send(superheroInfo);
    })
    // create a superhero
    .post((req, res) => {
        const newpart = req.body;
        newpart.id = 100 + superheroInfo.length;
        if (newpart.name) {
            superheroInfo.push(newpart);
            res.send(newpart);
        } else {
            res.status(400).send('Missing name');
        }
    });

router.route('/:id')
    .get((req, res) => {
        const superhero = superheroInfo.find(p => p.id === parseInt(req.params.id));
        if (superhero) {
            res.send(superhero);
        } else {
            res.status(404).send(`Superhero ${req.params.id} was not found!`);
        }
    })
    .put((req, res) => {
        const newpart = req.body;
        console.log("Part: ", newpart);
        // add ID field
        newpart.id = parseInt(req.params.id);
    
        // replace the superhero with the new one
        const superhero = superheroInfo.findIndex(p => p.id === parseInt(newpart.id));
        if (superhero < 0) {
            console.log('Creating new superhero');
            superheroInfo.push(newpart);
        } else {
            console.log('Modifying superhero ', req.params.id);
            superheroInfo[superhero] = newpart;
        }
    
        res.send(newpart);
    })
    .post((req, res) => {
        const newpart = req.body;
        console.log("Part: ", newpart);
    
        // find the superhero
        const superhero = superheroInfo.findIndex(p => p.id === parseInt(req.params.id));
    
        if (superhero < 0) {
            res.status(404).send(`Part ${req.params.id} not found`);
        } else {
            console.log('Changing stock for ', req.params.id);
            superheroInfo[superhero].stock += parseInt(req.body.stock);
            res.send(superheroInfo[superhero]);
        }
    });

router.route('/:id/powers')
    .get((req, res) => {
        const superheroId = parseInt(req.params.id);
    
        // Find the superhero in superhero_info by ID
        const superhero = superheroInfo.find(superhero => superhero.id === superheroId);
    
        if (!superhero) {
            res.status(404).send(`Superhero with ID ${superheroId} not found`);
        } else {
            // Attempt to retrieve the powers based on the superhero's name
            const superheroName = superhero.name;
            const superheroPowersData = superheroPowers[superheroName];
            console.log(superheroPowers);
            console.log(superheroPowersData);
            
            if (superheroPowersData) {
            // Filter the "True" superpowers and create an object with only "True" powers
            const truePowers = {};
            for (const key in superheroPowersData) {
                if (superheroPowersData[key] === 'True') {
                truePowers[key] = 'True';
                }
            }
            res.send(truePowers);
            } else {
            res.status(404).send(`Superpowers for superhero ${superhero.name} with ID ${superhero.id} not found`);
            }
        }
    });

// install the router at /api/superheroInfo
app.use('/api/superheroInfo', router);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});