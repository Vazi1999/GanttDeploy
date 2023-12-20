// import modules
const express = require('express');
require('dotenv').config(); // .env configuration
const cors = require('cors');
const mongoose = require('mongoose'); // MongoDB driver
const jwtMiddleware = require('./middleware/authorization');

const app = express();

//global variables
const PORT = process.env.PORT || 3000; //change to 8080

//live data
let USERS = [];

// import routes and passing them the USERS variable.
const createItemRoute = require('./routes/createItem')(USERS);
const authRoute = require('./routes/auth')(USERS);
const getDataRoute = require('./routes/getData')(USERS);
const updateItemsRoute = require('./routes/update')(USERS);


mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true , useUnifiedTopology: true})
  .then(async (result) => {
    console.log("Connected to DB")
    app.listen(PORT);
    console.log(`Server is listening on port ${PORT}`)
  })
  .catch((err) => console.log(err))


app.use(express.static('public')); // static files
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*'
}));

app.use(express.json()); // Parse incoming JSON data

//jwt authorization
app.use(jwtMiddleware)
// use routes
app.use(createItemRoute);
app.use(authRoute);
app.use(getDataRoute);
app.use(updateItemsRoute);


app.get('/', (req, res) => {
  res.send("<h1>Welcome to ShakeDvirGantt API</h1>")
});

app.get('/test' , (req, res) => {
  res.status(200).json({message : USERS});
});