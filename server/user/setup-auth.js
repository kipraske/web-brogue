var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require("cookie-parser");
var session = require("express-session");

function setupAuthentication(app){

app.use(session({secret : 'brogueSecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

// TODO - these may not be configured correctly, but we need them to read the session ID from the cookie - more research needed

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) { 
    // check in mongo if a user with username exists or not
    User.findOne({ 'username' :  username }, 
      function(err, user) {
        // In case of any error, return using the done method
        if (err)
          return done(err);
        // Username does not exist, log error & redirect back
        if (!user){
          console.log('User Not Found with username '+username);
          return done(null, false, 
                req.flash('message', 'User Not found.'));                 
        }
        // User exists but wrong password, log the error 
        if (!isValidPassword(user, password)){
          console.log('Invalid Password');
          return done(null, false, 
              req.flash('message', 'Invalid Password'));
        }
        // User and password both match, return user from 
        // done method which will be treated like success
        return done(null, user);
      }
    );
}));

// need to store user stuff in session so we can pass the info to the websocket connection... not quite sure how yet.
// app.use(cookieParser());
// app.use(session({secret: '1234567890QWERTY'}));

    
    
}

module.exports = setupAuthentication;

