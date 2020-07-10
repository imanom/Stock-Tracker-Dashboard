'use strict';

const service = require('./dashboard.service');


/*

Renders the dashboard page after fetching stocks information and user name from DB successfully.

*/


function dashboard(req, res, next) {
    if(req.session.userId) {
        service.dashboard(req.session, (error, results) => {
            if (error) {
                res.send(error);
            } else {
               return res.render('dashboard.html',{name:results.name, table_data: results.stockDetails});
            }
        });
    } 

    else {
        res.render('login.html',{error_message:""})
    }
}


/*

A function to enter the stocks in the stocks DB with manually enterred values.

*/

function setupController(req, res, next) {
    
        service.setupController((error, results) => {
            if (error) {
                res.send(error);
            } else {
                res.send(results);
            }
        });
   
}




module.exports = {
    dashboard,
    setupController
   
};