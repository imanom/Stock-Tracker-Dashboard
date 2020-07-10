'use strict';

const service = require('./user-onboard.service');



/*
    Perform sign-up functionalities.
    Redirect to dashboard upon success.

*/

function signup(req, res, next) {
    
        if (!req.body) {
            res.status(400).send({
                error: 'Request body is required.'
            });
            return;
        } 
    
        else {
            service.signup(req.body,req.session, (error, results) => {
                if (error) {
                    next(error);
                } else {
                    return res.redirect('/dashboard');
                }
            });
        }
}

/*
    Perform login functionalities.
    Redirect to dashboard upon success.
    Upon failure in validating email and password, error message is set.

*/

function login(req, res, next) {
    if (!req.body) {
        res.status(400).send({
            error: 'Request body is required.'
        });
        return;
    } 

    else {
       
        service.login(req.body,req.session, (error, results) => {
            if (error) {
                return res.render('login.html',{error_message:"Wrong username/password enterred!"});
            } else {
                res.redirect("/dashboard");
            }
        });
    }
}


/*
    Perform logout functionalities.
    Destroys the user session.
    Redirects to login page.

*/

function logout(req, res, next) {
    console.log(req.session.userId)
    service.logout(req.session, (error, results) => {
        
        if (error) {
            next(error);
        } else {
            console.log("logged out!")
            //res.send("logged out")
            return res.redirect("/user/login");
        }
    });
}

module.exports = {
    login,
    logout,
    signup
};