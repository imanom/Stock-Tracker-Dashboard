'use strict';

var user = require('../../models/userSchema');
var request = require('request');

/*
    Stores the user info in the DB.
    Password encryption takes place in the model.pre('save') hook using BRCYPT. (refer models/userSchema.js)
    Stores the Object ID of the user from the DB into the session, to keep track of the user's session.

*/ 

function signup(details,session, next){
 
    var userData = {
        email: details.email,
        firstname: details.firstname,
        lastname: details.lastname,
        password: details.password
      }
      
      user.create(userData, function (err, user) {
        if (err) {
          return next(err)
        } else {
            session.userId = user._id;
            next(null, "signed up");
        }
      });
    
}

/*
    Authenticates the user Email-Id and Password.
    Stores the Object ID of the user from the DB into the session, to keep track of the user's session.

*/  
function login(details,session, next){
    user.authenticate(details.email, details.password, function (error, user) {
        if (error || !user) {
          var err = new Error('Wrong email or password.');
          err.status = 401;
          
          return next(err);
        } else {
          session.userId = user._id;
          next(null, "logged in");
        }
      });
 
}


/*
    Destroys the user session on logout
*/
function logout(session, next){
    session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        next(null,"logged out");
    });
    
}


    module.exports = {
        login,
        logout,
        signup
    };