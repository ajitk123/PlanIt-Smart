import express from 'express';
// import blogDataFunctions from './data/blogs.js';
// import userDataFunctions from './data/users.js';
// import commentDataFunctions from './data/comments.js';

const app = express();

app.use(express.json());

// add the code for setting up the routes


app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
