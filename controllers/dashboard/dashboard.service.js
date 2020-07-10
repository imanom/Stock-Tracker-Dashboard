'use strict';

var user = require('../../models/userSchema');
var stocks = require('../../models/stockValues');
var mongoose = require('mongoose');
var request = require('request');
const ObjectId = mongoose.Types.ObjectId;
    

/*

Renders the dashboard page after fetching stocks information and user name from DB successfully.

*/

async function dashboard(session, next){
    const data = await user.find(
        {_id: ObjectId(session.userId)},
        {firstname:1,stocks:1}
        );
        
       // console.log("Data:",data);
        stocks.find(
            {stock_id :{$in: data[0].stocks}},
            {base_value:0,'change.max_change':0,'change.total_change':0,stock_id:0, _id:0, __v:0}
        )
        .then(result => {
            var responseObject ={
                name: data[0].firstname,
                stockDetails:[]
            };
            
            result.forEach(element => {
                responseObject.stockDetails.push ({
                    instrument: element.instrument,
                    qty: element.qty,
                    ltp: element.ltp,
                    current_val: element.current_val,
                    daily_change: element.change.daily_change
                })
               
            });
            
            //console.log(responseObject);
            next(null, responseObject);
        })
        .catch(err => {
            next(err, null);
            console.log(err);
        });
   
}

/*

A function to enter the stocks in the stocks DB with manually enterred values.

*/
function setupController(next){
    var starterData = [
        {
             stock_id: 1,
             instrument: "ABC Holdings",
             qty: 2,
             current_val:2249.90,
             //base_value:2249.90,
             ltp: 1124.95,
             'change.daily_change': "+1.31%"
         },

         {
            stock_id: 2,
             instrument: "XE Firm",
             qty: 3,
             current_val:3300,
             //base_value:1100,
             ltp: 1100,
             'change.daily_change': "+0.76%"
         },
         {
            stock_id: 3,
             instrument: "Zen Motors",
             qty: 5,
             current_val:2172.50,
             //base_value:434.50,
             ltp: 434.50,
             'change.daily_change': "+1.61%"
         },
         {
            stock_id: 4,
             instrument: "Zero Ground",
             qty: 7,
             current_val:2272.55,
             //base_value:324.65,
             ltp: 324.65,
             'change.daily_change': "+1.81%"
         },
         {
            stock_id: 5,
             instrument: "Natham Bank",
             qty: 2,
             current_val:2420.44,
             //base_value:2420.44,
             ltp: 1210.22,
             'change.daily_change': "-0.21%"
         },
         {
            stock_id: 6,
             instrument: "Lily Ltd.",
             qty: 6,
             current_val:2103.6,
             //base_value:2103.6,
             ltp: 350.6,
             'change.daily_change': "+1.09%"
         },
        {
            stock_id: 7,
            instrument: "August Org.",
            qty: 2,
            current_val:2249.90,
            //base_value:2249.90,
            ltp: 1124.95,
            'change.daily_change': "+1.31%"
        },

        {
            stock_id: 8,
            instrument: "BE Ltd.",
            qty: 3,
            current_val:3300,
            //base_value:3300,
            ltp: 1100,
            'change.daily_change': "+0.76%"
        },
        {
            stock_id: 9,
            instrument: "XYZ Drives",
            qty: 5,
            current_val:2172.50,
            //base_value:2172.50,
            ltp: 434.50,
            'change.daily_change': "+1.61%"
        },
        {
            stock_id: 10,
            instrument: "FB Remote",
            qty: 7,
            current_val:2272.55,
            //base_value:2272.55,
            ltp: 324.65,
            'change.daily_change': "+1.81%"
        },
        {
            stock_id: 11,
            instrument: "Yuki Bank",
            qty: 2,
            current_val:2420.44,
            //base_value:2420.44,
            ltp: 1210.22,
            'change.daily_change': "-0.21%"
        },
        {
            stock_id: 12,
            instrument: "Xam.org",
            qty: 6,
            current_val:2103.6,
            //base_value:2103.6,
            ltp: 350.6,
            'change.daily_change': "+1.09%"
        },
        {
            stock_id: 13,
            instrument: "Capital One",
            qty: 2,
            current_val:2103.6,
            //base_value:2103.6,
            ltp: 350.6,
            'change.daily_change': "+1.09%"
        }
     ];


     stocks.create(starterData, function(err, results){
         if(err) {
             next(err);
         }

         console.log(results.length);

         next(null,"Success!");
     });

}


    module.exports = {
        dashboard,
        setupController,
    };