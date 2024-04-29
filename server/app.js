import express from 'express';
import constructorMethod from './routes/index.js';

const app = express();

app.use(express.json());
constructorMethod(app);

// add the code for setting up the routes


app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
