'use strict';

const router = require('express').Router();
const controller = require('./user-onboard.controller');



/*
    A middleware to check if session already exists.
    If it exists redirect to home page,
    or else continue.
*/

var sessionChecker = (req, res, next) => {
    if (req.session.userId) {
        res.redirect('/');
    } else {
        next();
    }    
};


router.get('/logout', controller.logout);


router.route('/login')
    .get(sessionChecker, (req, res) => {
        res.render('login.html',{error_message:""});
    })
    .post(controller.login);


    
router.route('/signup')
    .get(sessionChecker, (req, res) => {
        res.render('signup.html');
    })
    .post(controller.signup);



module.exports = router;