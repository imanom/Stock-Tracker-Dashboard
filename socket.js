 'use strict';


const stocks = require('./models/stockValues');
const user = require('./models/userSchema');

var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


/*

Listens to the stocks DB using Mongo DB's changeStream feature.
When the stock price updates, it emits an event using socket, and sends the updated data to the client.  
(Refer public/client.js for the frontend JS to handle this)

*/

const changeStream = stocks.watch();

module.exports = function(io) {

    changeStream.on('change', (change) => {
       // console.log(change.documentKey._id); 
        
        (async () => {
               const result = await  stocks.find(
                    {_id : ObjectId(change.documentKey._id)},
                    { 'change.max_change':0,'change.total_change':0,stock_id:0, _id:0, __v:0}
                )
                
                //console.log(result[0].instrument);
            io.emit('changeData', 
                result[0],
            );
        })();
        
    });

   

    io.on('connection', function (socket) {
        console.log('a user connected',socket.request.session);

      socket.on('disconnect', function () {
          return console.log('user disconnected');
         socket.removeAllListeners('disconnect');
        io.removeAllListeners('connection');
      });

      
      });
   
};