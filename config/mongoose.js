const mongoose = require('mongoose'); 
// const env = require('./environment');

mongoose.connect('mongodb://127.0.0.1:27017/steady-code');
const db = mongoose.connection;

//to log the error if there is error in connecting to the db
db.on('error',console.error.bind(console, "Error connecting to MongoDB")); 
db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});

module.exports = db; 