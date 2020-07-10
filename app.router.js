'use strict';

const router = require('express').Router();
const onboardRouter = require('./controllers/user-onboard/user-onboard.router');
const dashboardRouter = require('./controllers/dashboard/dashboard.router');

router.get('/', home);
router.use('/user', onboardRouter);
router.use('/dashboard', dashboardRouter);

/*
    The home function, which checks the session.userID whichis stored during login/signup.
   Redirects to dashboard on success, or renders login page on session expiry.

*/ 
function home(req, res) {
    if(req.session.userId) {
        return res.redirect('/dashboard');
    }  
    else{res.render('login.html',{error_message:""})}
}


module.exports = router;
