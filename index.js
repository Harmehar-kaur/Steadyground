const express = require ('express'); 
const cookieParser = require('cookie-parser'); 
const app=express(); 
const port = 8000; 
const expressLayouts = require('express-ejs-layouts'); 
const db = require('./config/mongoose');
const passport = require ('passport');
const MongoStore = require('connect-mongo'); 
app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static(env.asset_path));
// make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie in the db
app.use(
    session({
      name: 'codeial',
      secret: 'blahsomething',
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 100,
      },
      store: new MongoStore({
        mongoUrl: 'mongodb://127.0.0.1:27017/codeial_development', 
        mongooseConnection: db,
        autoRemove: 'disabled'
      }, function (err) {
        console.log(err || 'connect-mongodb setup ok');
      })
    })
  );
  

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// use express router
app.use('/', require('./routes'));


app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
