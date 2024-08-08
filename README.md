This is my superhero database. It is a fullstack application using the MERN stack.

You can run the client folder by running ```npm i``` and then ```npm start```.

You can run the server by running ```npm i``` and then ```nodemon index.js``` (assuming you have nodemon installed).

This repository's backend is not functional on its own; it requires a dotenv file with port numbers and MongoDB links to work. It also requires a couple of superhero JSON files.

Functionalities of this website include:
- Creating a user account and logging in
- Email authentication
- An Admin account with user management abilities, as well as the ability to create policies, DCMA, and AUP
- The ability to search through a database of ~1000 superheroes by either name, race, publisher, or power
- The ability to create a list of superheroes and either make it public (visible on the "public dashboard"), or private
