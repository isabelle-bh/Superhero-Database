// import json files and other required modules
const superheroInfo = require('./superhero_info.json');
const superheroPowers = require('./superhero_powers.json'); // Load superhero_powers data
const express = require('express');
const nodemailer = require('nodemailer'); // npm install nodemailer
const List = require('./list');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Policy = require('./policy');
const User = require('./user')
const DMCA = require('./DMCA');
const AUP = require('./AUP');
const UserVerification = require('./userVerification');

// unique string
const {v4: uuidv4} = require('uuid');

// env variables
require('dotenv').config();

// path for static verified page
const path = require('path');

// nodemailer stuff
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    }
});

// test success
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
    console.log(success)
  }
});

function generateToken(email) {
  const payload = {
    email: email,
  };

  const options = {
    expiresIn: '24h',
  };

  const secretKey = '12345';

  return jwt.sign(payload, secretKey, options);
}

// bcrypt
const bcrypt = require('bcrypt');

const { error } = require('console');

const app = express();
const port = process.env.PORT;
const router = express.Router();
const routerLists = express.Router();
const routerUsers = express.Router();
const routerAdmin = express.Router();

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

// setup middleware to do logging
app.use((req, res, next) => { // for all routes
    console.log(`${req.method} request for ${req.url}`);
    next(); // keeps going
});

// Use CORS middleware
app.use(cors(corsOptions));

// parse data in body as JSON
app.use(express.json());
app.use(sanitizeInput);

// STEP 10 FOR BACKEND
// middleware to sanitize input
function sanitizeInput(req, res, next) {
    const maxLength = 20;
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

// routes for /api/superheroInfo
router.route('/') // all the routes to the base prefix
    // STEP 1 FOR BACKEND
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
    // STEP 2 FOR BACKEND
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

    router.route('/searchFunction').post((req, res) => {
      const { name, race, publisher, powers } = req.body;
    
      // Check if all search inputs are empty
      if (!name && !race && !publisher && !powers) {
        res.send([]);
        return;
      }
    
      const superheroDetails = superheroInfo.map((superhero) => {
        const powersArray = getSuperheroPowers(superhero.name);
        return {
          id: superhero.id,
          name: superhero.name,
          race: superhero.Race,
          publisher: superhero.Publisher,
          powers: powersArray.join(','),
        };
      });
    
      const filteredSuperheroes = superheroDetails.filter((superhero) => {
        const softMatch = (field, input) => {
          const sanitizedField = field.replace(/\s/g, '').toLowerCase();
          const sanitizedInput = input.replace(/\s/g, '').toLowerCase();
        
          // Check if each character in the input is present in the field
          for (let i = 0; i < sanitizedInput.length; i++) {
            if (!sanitizedField.includes(sanitizedInput[i])) {
              return false;
            }
          }
        
          return true;
        };        
    
        return (
          softMatch(superhero.name, name) &&
          softMatch(superhero.race, race) &&
          softMatch(superhero.publisher, publisher) &&
          softMatch(superhero.powers, powers)
        );
      });
    
      res.send(filteredSuperheroes);
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

// SUPERHERO LIST HANDLING

// parse data in body as JSON
routerLists.use(express.json());
routerLists.use(sanitizeInput);

// routes/lists.js

function authenticate(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, '12345');
    req.user = decoded;
    console.log(req.user);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

routerLists.route('/createList').post(authenticate, async (req, res) => {
  const listName = req.body.listName;
  const desc = req.body.desc;
  const email = req.user.email;
  const visibility = "private";
  const updatedTime = Date.now();

  try {
    // Check if the list name is missing
    if (!listName || !desc) {
      return res.status(422).json({ error: 'Missing 1 or more inputs' });
    }

    const findUser = await User.findOne({ email });
    let username = findUser.username;
    console.log(username);

    // Check if the list name already exists for the user
    const existingList = await List.findOne({ name: listName, user: email });
    if (existingList) {
      return res.status(400).json({ error: 'List name already exists for this user' });
    }

    // Create the list in MongoDB and associate it with the user
    const newList = await List.create({ name: listName, superheroes: [], user: email, desc: desc, visibility: visibility, username: username, updatedTime: updatedTime });
    res.json(newList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  // routes/lists.js
routerLists.route('/getUserLists')
  .get(authenticate, async (req, res) => {
    const email = req.user.email;

    try {
      // Retrieve all lists associated with the user
      const userLists = await List.find({ user: email });
      res.json(userLists);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// routes for /api/superheroInfo/lists/getLists
routerLists.route('/getLists')
    // get a list of superhero lists
    .get(async (req, res) => {
        try {
            const lists = await List.find({}, 'name');
            const listNames = lists.map((list) => list.name);
            res.send(listNames);
          } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
          }
    });

// routes for /api/superheroInfo/lists/getPublicLists
routerLists.route('/getPublicLists')
  // get a list of superhero lists with visibility "public", sorted by updatedTime
  .get(async (req, res) => {
    try {
      const publicLists = await List.find({ visibility: 'public' }).sort({ updatedTime: -1 }).limit(10);
      res.send(publicLists);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
    
// routes for /api/superheroInfo/lists/:listName/addSuperhero/:superheroId
routerLists.route('/:listName/addSuperhero/:superheroId')
    // add a superhero to a given list
    .post(authenticate, async (req, res) => {
        const listName = req.params.listName;
        const superheroId = parseInt(req.params.superheroId);
        const email = req.user.email; 
        const updatedTime = Date.now();
      
        try {
          // Check if the list name is missing
          const existingList = await List.findOne({ name: listName });
          if (!existingList) {
            return res.status(404).send(`Superhero list '${listName}' does not exist`);
          }
      
          // Check if the logged-in user is the owner of the list
          if (existingList.user !== email) {
            return res.status(403).send('Unauthorized: You do not have permission to add superheroes to this list');
          }

          // Find the superhero in superhero_info by ID
          const superhero = superheroInfo.find((s) => s.id === superheroId);
          if (superhero) {
            // Check if the superhero is already in the list
            if (existingList.superheroes.includes(superhero.id)) {
              return res.status(400).send('Superhero already in list.');
            }
      
            // Add the superhero to the list in MongoDB
            existingList.superheroes.push(superhero.id);
            existingList.updatedTime = updatedTime;
            await existingList.save();
            res.send(`Superhero added to list '${listName}'`);
          } else {
            // Send 404 if the superhero is not found
            res.status(404).send(`Superhero with ID ${superheroId} not found`);
          }
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
        }
    });

// routes for /api/superheroInfo/lists/:listName/removeSuperhero/:superheroId
routerLists.route('/:listName/removeSuperhero/:superheroId')
    // remove a superhero from a given list
    .post(authenticate, async (req, res) => {
        const listName = req.params.listName;
        const superheroId = parseInt(req.params.superheroId);
        const email = req.user.email; 
        const updatedTime = Date.now();
      
        try {
            // Check if the list name is missing
            const existingList = await List.findOne({ name: listName });
            if (!existingList) {
                return res.status(404).send(`Superhero list '${listName}' does not exist`);
            }
      
            // Check if the logged-in user is the owner of the list
            if (existingList.user !== email) {
                return res.status(403).send('Unauthorized: You do not have permission to remove superheroes from this list');
            }

            // Find the superhero in superhero_info by ID
            const superhero = superheroInfo.find((s) => s.id === superheroId);
            if (superhero) {
                // Check if the superhero is in the list
                const superheroIndex = existingList.superheroes.indexOf(superhero.id);
                if (superheroIndex !== -1) {
                    // Remove the superhero from the list in MongoDB
                    existingList.superheroes.splice(superheroIndex, 1);
                    existingList.updatedTime = updatedTime;
                    await existingList.save();
                    res.send(`Superhero removed from list '${listName}'`);
                } else {
                    // Send 400 if the superhero is not in the list
                    res.status(400).send('Superhero is not in the list.');
                }
            } else {
                // Send 404 if the superhero is not found
                res.status(404).send(`Superhero with ID ${superheroId} not found`);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });


// routes for /api/superheroInfo/lists/:listName/superheroes
routerLists.route('/:listName/superheroes')
    // get a list of superheroes saved in a given list
    .get(async (req, res) => {
        const listName = req.params.listName;

        try {
          // Check if the list does not exist
          const existingList = await List.findOne({ name: listName });
          if (!existingList) {
            return res.status(404).send(`Superhero list '${listName}' does not exist`);
          }
      
          // Send the list of superheroes
          res.send(existingList.superheroes);
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
        }
    });

// Update list name
routerLists.route('/:listName/updateListName')
    .post(authenticate, async (req, res) => {
        const { listName } = req.params;
        const { newListName } = req.body;
        const email = req.user.email;
        const updatedTime = Date.now();

        try {
            // Check if the list name is missing
            const existingList = await List.findOne({ name: listName, user: email });
            if (!existingList) {
                return res.status(404).send(`Superhero list '${listName}' does not exist or you don't have permission.`);
            }

            // Update the list name
            existingList.name = newListName;
            existingList.updatedTime = updatedTime;
            await existingList.save();

            res.status(200).send(`List name updated to '${newListName}'`);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

routerLists.route('/:listName/updateVisibility')
  .post(authenticate, async (req, res) => {
    const { listName } = req.params;
    const { visibility } = req.body;
    const email = req.user.email; 
    const updatedTime = Date.now();

    try {
      // Check if the list name is missing
      const existingList = await List.findOne({ name: listName, user: email });
      if (!existingList) {
          return res.status(404).send(`Superhero list '${listName}' does not exist or you don't have permission.`);
      }

      existingList.visibility = visibility;
      existingList.updatedTime = updatedTime;
      await existingList.save();

      res.status(200).send(`List visibility updated to ${visibility}`); // Respond with the updated list
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// routes for /api/superheroInfo/lists/:listName/deleteList
routerLists.route('/:listName/deleteList')
    // delete a superhero from a given list
    .delete(authenticate, async (req, res) => {
        const listName = req.params.listName;
        const email = req.user.email;

        try {
          // Check if the list does not exist
          const existingList = await List.findOne({ name: listName });
          if (!existingList) {
            return res.status(404).send(`Superhero list '${listName}' does not exist`);
          }

          // Check if the logged-in user is the owner of the list
          if (existingList.user !== email) {
            return res.status(403).send('Unauthorized: You do not have permission to delete this list');
          }
      
          // Delete the list from MongoDB
          await existingList.deleteOne();
          res.send(`Superhero list '${listName}' deleted`);
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
        }
    });

// routes for /api/superheroInfo/lists/:listName/getListDetails
routerLists.route('/:listName/getListDetails')
  .get(async (req, res) => {
    const listName = req.params.listName;

    try {
      // Check if the list exists
      const existingList = await List.findOne({ name: listName });
      if (!existingList) {
        return res.status(404).send(`Superhero list '${listName}' does not exist`);
      }

      // Check if the list has superheroes
      if (!existingList.superheroes || existingList.superheroes.length === 0) {
        // Return an empty array or some other indicator
        return res.status(200).json([]);
      }

      // Get the list details
      const listDesc = existingList.desc;
      const superheroIds = existingList.superheroes;
      const listDetails = [];

      // Get the superhero details
      for (const superheroId of superheroIds) {
        const superhero = superheroInfo.find(p => p.id == superheroId);
        if (superhero) {
          const powers = getSuperheroPowers(superhero.name);
          listDetails.push({
            desc: listDesc,
            id: superhero.id,
            name: superhero.name,
            information: superhero,
            powers: powers,
          });
        }
      }

      // Send the superhero details
      res.status(200).json(listDetails);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


routerLists.route('/getListDetails2/:listName')
  .get(async (req, res) => {
  const listName = req.params.name;

  try {
    const list = await List.findOne(listName); // Retrieve the specific list by ID
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    res.json(list); // Send the list as JSON response
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
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

// USER LOGIN AND REGISTRATION
routerUsers.use(express.json());

// Signup route
routerUsers.post('/signup', (req, res) => {
  let { username, email, password } = req.body;
  username = username.trim();
  email = email.trim();
  password = password.trim();

  if (username === '' || email === '' || password === '') {
    res.json({
      status: 'EMPTY INPUTS',
      message: 'Empty input fields!'
    });
    return; // Add return to prevent further processing
  } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
    res.json({
      status: 'INVALID CHARS',
      message: 'Invalid characters!'
    });
    return;
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.json({
      status: 'INVALID EMAIL',
      message: 'Invalid email!'
    });
    return;
  } else if (password.length < 8) { 
    res.json({
      status: 'PASSWORD TOO SHORT',
      message: 'Password is too short!'
    });
    return;
  }

// checking if user already exists by email
User.findOne({ email })
  .then((userByEmail) => {
    if (userByEmail) {
      // a user already exists with the provided email
      res.json({
        status: 'USER EMAIL ALREADY EXISTS',
        message: 'User with the provided email already exists!'
      });
    } else {
      // checking if username is unique
      User.findOne({ username })
        .then((userByUsername) => {
          if (userByUsername) {
            // a user already exists with the provided username
            res.json({
              status: 'USER USERNAME ALREADY EXISTS',
              message: 'User with the provided username already exists!'
            });
          } else {
            // try to create a new user
            const saltRounds = 10;
            bcrypt
              .hash(password, saltRounds)
              .then((hashedPassword) => {
                // Check if the username is "administrator"
                const isAdmin = username.toLowerCase() === 'administrator';

                const newUser = new User({
                  username,
                  email,
                  password: hashedPassword,
                  verified: isAdmin ? true : false,
                  active: true,
                  admin: isAdmin ? true : false,
                  lessAdmin: false,
                });

                newUser
                  .save()
                  .then((result) => {
                    // handle account verification
                    if (!isAdmin) {
                      // Send verification email only if not an admin
                      sendVerificationEmail({
                        _id: result._id,
                        email: result.email
                      }, res);
                    } else {
                      res.json({
                        status: 'SUCCESS',
                        message: 'Admin user created successfully!'
                      });
                    }
                  })
                  .catch((err) => {
                    console.error(err);
                    res.json({
                      status: 'FAILED',
                      message: 'An error occurred while saving user account!'
                    });
                  });
              })
              .catch((err) => {
                console.error(err);
                res.json({
                  status: 'FAILED',
                  message: 'An error occurred while hashing the password!'
                });
              });
          }
        })
        .catch((err) => {
          console.error(err);
          res.json({
            status: 'FAILED',
            message: 'An error occurred while checking if the username already exists!'
          });
        });
    }
  })
  .catch((err) => {
    console.error(err);
    res.json({
      status: 'FAILED',
      message: 'An error occurred while checking if the user already exists!'
    });
  });
});


// send verification email
const sendVerificationEmail = ({_id, email}, res) => {
  // url to be used in the email
  const currentUrl = process.env.CURRENT_URL;

  const uniqueString = uuidv4() + _id;

  const mailOptions ={
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: 'Email Verification',
    html: `<h2>Thank you for registering!</h2>
    <p>Please verify your email by clicking on the following link</p>
    <p>This link expires in 6 hours</p>
    <b><a href=${currentUrl + "api/users/verified/" + _id + "/" + uniqueString}>Verify Email</a>`
  };
  
  // hash the uniqueString
  const saltRounds = 10;
  bcrypt
    .hash(uniqueString, saltRounds)
    .then((hashedUniqueString) => {
      // set values in userVerification collection
      const newVerification = new UserVerification({
        userId: _id,
        uniqueString: hashedUniqueString,
        createdAt: Date.now(),
        expiresAt: Date.now() + 6*60*60*1000 // 6 hours
      });

      newVerification
        .save()
        .then(() => {
          transporter
            .sendMail(mailOptions)
            .then(() => {
              res.json({
                status: 'PENDING',
                message: 'Verification email sent!'
              });
            })
            .catch((error) => {
              console.log(error);
              res.json({
                status: 'FAILED',
                message: 'Verification email failed'
              });
            })
        })
        .catch((error) => {
          console.log(error);
          res.json({
            status: 'FAILED',
            message:"Couldnt save verification email data!",
          });
        });
    } )
    .catch(() => {
      res.json({
        status: 'FAILED',
        message: 'An error occured while hashing email data!'
      });
    })
};

// verify email
routerUsers.get("/verified/:userId/:uniqueString", (req, res) => {
  let { userId, uniqueString } = req.params;

  UserVerification
    .find({ userId })
    .then((result) => {
      if (result.length > 0) {
        // user verification exists so we proceed
        const { expiresAt } = result[0];
        const hashedUniqueString = result[0].uniqueString;

        // checking for expired unique string
        if (expiresAt < Date.now()) {
          // record expired so we delete
          UserVerification
            .deleteOne({ userId })
            .then(result => {
              User
                .deleteOne({ _id: userId })
                .then(() => {
                  let message = "Verification link expired. Please sign up again.";
                  res.redirect(`/users/verified/error=true&message=${encodeURIComponent(message)}`);
                })
                .catch((error) => {
                  console.log(error);
                  let message = "Clearing user with expired unique string failed";
                  res.redirect(`/users/verified/error=true&message=${encodeURIComponent(message)}`);
                });
            })
            .catch((error) => {
              console.log(error);
              let message = "An error occurred while deleting expired verification record!";
              res.redirect(`/users/verified/error=true&message=${encodeURIComponent(message)}`);
            });
        } else {
          // valid record exists so we validate the user string
          // first compare hashed unique string
          bcrypt
            .compare(uniqueString, hashedUniqueString)
            .then(result => {
              if (result) {
                // strings match
                User
                  .updateOne({ _id: userId }, { verified: true })
                  .then(() => {
                    UserVerification
                      .deleteOne({ userId })
                      .then(() => {
                        res.sendFile(path.join(__dirname, './views/verified.html'));
                      })
                      .catch((error) => {
                        console.log(error);
                        let message = "An error occurred while finalizing successful verification!";
                        res.redirect(`/users/verified/error=true&message=${encodeURIComponent(message)}`);
                      });
                  })
                  .catch(error => {
                    console.log(error);
                    let message = "An error occurred while updating user verification status!";
                    res.redirect(`/users/verified/error=true&message=${encodeURIComponent(message)}`);
                  })
              } else {
                // existing record but incorrect verification details
                let message = "Invalid verification details!";
                res.redirect(`/users/verified/error=true&message=${encodeURIComponent(message)}`);
              }
            })
            .catch(error => {
              let message = "An error occurred while comparing unique string!";
              res.redirect(`/users/verified/error=true&message=${encodeURIComponent(message)}`);
            });
        }
      } else {
        // user verification record don't exist
        let message = "Account record does not exist or has been verified already. Please sign up or log in.";
        res.redirect(`/users/verified/error=true&message=${encodeURIComponent(message)}`);
      }
    })
    .catch((error) => {
      console.log(error);
      let message = "An error occurred while checking for an existing user verification record!";
      res.redirect(`/users/verified/error=true&message=${encodeURIComponent(message)}`);
    });
});

// verified page route
routerUsers.get('/verified', (req, res) => {
  res.sendFile(path.join(__dirname, './views/verified.html'));
});
  
// Login route
routerUsers.post('/login', async (req, res) => {
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();

  if (email === '' || password === '') {
    return res.json({
      status: 'EMPTY CREDENTIALS',
      message: 'Empty credentials supplied'
    });
  }

  try {
    const data = await User.find({ email });

    if (data.length) {
      const active = data[0].active;
      const lessAdmin = data[0].lessAdmin;

      if (!active) {
        return res.json({
          status: 'INACTIVE ACCOUNT',
          message: 'Account is inactive!'
        });
      }

      if (!data[0].verified) {
        return res.status(403).json({
          status: 'FAILED VERIFICATION',
          message: 'Please verify your email to continue!',
          resendLink: `/api/users/resendVerification/${data[0].email}`
        });
      }

      const hashedPassword = data[0].password;
      const result = await bcrypt.compare(password, hashedPassword);

      if (result) {
        const admin = data[0].admin;
        const username = data[0].username;
        const token = generateToken(email);

        return res.json({
          status: 'SUCCESS',
          message: 'Login successful',
          data: data,
          token: token,
          admin: admin,
          lessAdmin: lessAdmin,
          username: username
        });
      } else {
        return res.json({
          status: 'INVALID PASSWORD',
          message: 'Invalid password!'
        });
      }
    } else {
      return res.json({
        status: 'INVALID ACCOUNT',
        message: 'User not found!'
      });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.json({
      status: 'FAILED',
      message: 'An error occurred while finding the user!'
    });
  }
});

routerUsers.get("/resendVerification/:email", async (req, res) => {
  const { email } = req.params;

  try {
    // Find the user by email to get the correct _id
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(user._id);

    // Use the found user's _id for UserVerification.find
    const userVerification = await UserVerification.find({ userId: user._id });

    if (userVerification.length > 0) {

      return res.json({
        status: 'Verification email resent successfully!',
        // additional response data
      });
    } else {
      return res.status(404).json({ message: 'User verification record not found' });
    }
  } catch (error) {
    console.error('Error resending verification email:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Route for updating the user's password
routerUsers.route('/updatePassword')
  .post(authenticate, async (req, res) => {
    let { currentPassword, newPassword } = req.body;
    const email = req.user.email;

    try {
      // Find the user by email
      const user = await User.findOne({ email });

      // Check if the user exists
      if (!user) {
        return res.json({
          status: 'USER NOT FOUND',
          message: 'User with the provided email not found!'
        });
      }

      // Check if the current password matches
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);

      if (!passwordMatch) {
        return res.json({
          status: 'WRONG CURRENT PASSWORD',
          message: 'Current password does not match!'
        });
      }

      // Hash the new password
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update the user's password
      user.password = hashedNewPassword;
      await user.save();

      res.json({
        status: 'PASSWORD UPDATED',
        message: 'Password updated successfully!'
      });
    } catch (error) {
      console.error(error);
      res.json({
        status: 'FAILED',
        message: 'An error occurred while updating the password!'
      });
    }
  });
  
routerUsers.get('/', async (req, res) => {
    try {
      const users = await User.find(); // Retrieve all users from the database
      res.json(users); // Send the users as JSON response
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

routerUsers.delete('/deleteUser/:username', async (req, res) => {
    const { username } = req.params;
  
    try {
      // Check if the user with the given ID exists
      const user = await User.findOne( {username} );
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Remove the user from the database
      await User.deleteOne( {username} );
  
      res.json({ message: 'User removed successfully' });
    } catch (error) {
      console.error('Error removing user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

// Route to deactivate or reactivate a user account
routerUsers.put('/:action/:email', async (req, res) => {
  const { action, email } = req.params;

  try {
    const user = await User.findOne({email});

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (action === 'deactivate' && user.active) {
      user.active = false;
    } else if (action === 'reactivate' && !user.active) {
      user.active = true;
    } else {
      return res.status(400).json({ message: 'Invalid action or user state' });
    }

    await user.save();

    const message = `User account ${action}d successfully`;
    res.json({ message });
  } catch (error) {
    console.error(`Error ${action}ing user account:`, error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

routerUsers.post('/grantAdmin/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.lessAdmin = true; // Set the 'admin' attribute to true
    await user.save();

    res.json({ message: 'Admin privileges granted successfully' });
  } catch (error) {
    console.error('Error granting admin privileges:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

routerUsers.post('/revokeAdmin/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.lessAdmin = false; // Set the 'admin' attribute to false
    await user.save();

    res.json({ message: 'Admin privileges revoked successfully' });
  } catch (error) {
    console.error('Error revoking admin privileges:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.use('/api/users', routerUsers);

// API route to get the security and privacy policy
routerAdmin.get('/getPolicy', async (req, res) => {
  try {
    const policy = await Policy.findOne();
    if (policy) {
      res.json({ policy: policy.content });
    } else {
      res.status(404).send('Security and privacy policy not found');
    }
  } catch (error) {
    console.error('Error fetching security and privacy policy:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API route to create the security and privacy policy
routerAdmin.put('/create-update-policy', async (req, res) => {
  const { policy } = req.body;

  try {
    let existingPolicy = await Policy.findOne();

    if (existingPolicy) {
      existingPolicy.content = policy;
      await existingPolicy.save();
      res.status(200).send('Current security and privacy policy updated successfully.');
    } else {
      const newPolicy = new Policy({ content: policy });
      await newPolicy.save();
      res.status(201).send('Security and privacy policy created successfully.');
    }

  } catch (error) {
    console.error('Error updating security and privacy policy:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API route to delete the security and privacy policy
routerAdmin.delete('/delete-policy', async (req, res) => {
  try {
    const deletedPolicy = await Policy.findOneAndDelete();

    if (deletedPolicy) {
      res.status(200).send('Security and privacy policy deleted successfully.');
    } else {
      res.status(404).send('No security and privacy policy found to delete.');
    }

  } catch (error) {
    console.error('Error deleting security and privacy policy:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API route to get the DMCA
routerAdmin.get('/get-dmca', async (req, res) => {
  try {
    const dmca = await DMCA.findOne();
    if (dmca) {
      res.json({ dmca: dmca.content });
    } else {
      res.status(404).send('DMCA not found');
    }
  } catch (error) {
    console.error('Error fetching DMCA:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API route to create the DMCA
routerAdmin.put('/create-update-dmca', async (req, res) => {
  const { dmca } = req.body;

  try {
    let existingDMCA = await DMCA.findOne();

    if (existingDMCA) {
      existingDMCA.content = dmca;
      await existingDMCA.save();
      res.status(200).send('Current DMCA updated successfully.');
    } else {
      const newDMCA = new DMCA({ content: dmca });
      await newDMCA.save();
      res.status(201).send('DMCA created successfully.');
    }

  } catch (error) {
    console.error('Error updating DMCA:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API route to delete the DMCA
routerAdmin.delete('/delete-dmca', async (req, res) => {
  try {
    const deletedDMCA = await DMCA.findOneAndDelete();

    if (deletedDMCA) {
      res.status(200).send('DMCA deleted successfully.');
    } else {
      res.status(404).send('No DMCA found to delete.');
    }

  } catch (error) {
    console.error('Error deleting DMCA:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API route to get the AUP
routerAdmin.get('/get-aup', async (req, res) => {
  try {
    const aup = await AUP.findOne();
    if (aup) {
      res.json({ aup: aup.content });
    } else {
      res.status(404).send('AUP not found');
    }
  } catch (error) {
    console.error('Error fetching AUP:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API route to create the AUP
routerAdmin.put('/create-update-aup', async (req, res) => {
  const { aup } = req.body;

  try {
    let existingAUP = await AUP.findOne();

    if (existingAUP) {
      existingAUP.content = aup;
      await existingAUP.save();
      res.status(200).send('Current AUP updated successfully.');
    } else {
      const newAUP = new AUP({ content: aup });
      await newAUP.save();
      res.status(201).send('AUP created successfully.');
    }

  } catch (error) {
    console.error('Error updating AUP:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API route to delete the AUP
routerAdmin.delete('/delete-aup', async (req, res) => {
  try {
    const deletedAUP = await AUP.findOneAndDelete();

    if (deletedAUP) {
      res.status(200).send('AUP deleted successfully.');
    } else {
      res.status(404).send('No AUP found to delete.');
    }

  } catch (error) {
    console.error('Error deleting AUP:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.use('/api/admin', routerAdmin);

// START THE SERVER
app.listen(port, () => {
  console.log('Backend server is running on port ' + port);
});
