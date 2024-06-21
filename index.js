const express = require('express'); 
const app = express(); 
const port = 8000; 
const expressLayouts = require('express-ejs-layouts'); 
const db = require('./config/mongoose');
const passport = require('passport');
const MongoStore = require('connect-mongo'); 
const session = require('express-session'); // Make sure express-session is required
const flash = require('connect-flash'); // Make sure connect-flash is required
const customMware = require('./config/middleware'); // Ensure custom middleware is required

// Use body-parser with the extended option specified
app.use(express.urlencoded({ extended: true }));

// Uncomment and use cookie-parser if needed
// const cookieParser = require('cookie-parser'); 
// app.use(cookieParser());

// Uncomment and set the static files directory if needed
// const env = require('./config/environment'); // Ensure the env file is properly required
// app.use(express.static(env.asset_path));
// app.use('/uploads', express.static(__dirname + '/uploads'));

// Uncomment and use morgan for logging if needed
// const logger = require('morgan');
// app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);

// Extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// Set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Mongo store is used to store the session cookie in the db
app.use(session({
  name: 'steady-code',
  secret: 'blahsomething',
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 100,
  },
  store: MongoStore.create({
    mongoUrl: 'mongodb://127.0.0.1:27017/steady-code', 
    autoRemove: 'disabled'
  })
}));

// app.use(passport.initialize());
// app.use(passport.session());

// app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// Use express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});
