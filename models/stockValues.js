var mongoose = require('mongoose');

var stockSchema = mongoose.Schema({
   
    stock_id: { type: Number, required:true, unique:true, dropDups:true },   //user defined unique id for each stock (ie, 1,2 ,3... so on)
    instrument: { type: String, required:true, unique:true, dropDups:true },   // name of the stock
    base_value: Number,    //Yesterday's value of the stock, all increments/decrements occur around this
    qty: Number,  //Number of shares bought by the user
    ltp:Number,   // Last traded price
    current_val: Number,   //LTP * Quantity
    change: {
        daily_change:String,   //Each increment/decrement
        max_change: Number,  //Max cincrement/decrement allowed for the stock (randomly assigned 5,10 or 15)
        total_change: Number   //Total increment happened in the stock (sum of all daily_change) (shouldn't cross max_change)
    }
    
    
},{
    timeStamps:true 
});


/*

Ensure the current value is saved in the DB as the product of LTP and Qty.
Assign initial base balue = LTP.
Assign max_change allowed as 5,10 or 15.
Assign total_change occured till now as 0.

*/

stockSchema.pre('save', function(next){
    var range = [5,10,15];
    var val = range[Math.floor(Math.random() * range.length)];

    this.current_val = this.qty * this.ltp;
    this.change.max_change = val;
    this.change.total_change = 0;
    this.base_value = this.ltp;
    next();   
  });

 

var stocks = mongoose.model('stocks',stockSchema,'stocks');
module.exports = stocks;



/*

A small function to generate random numbers

*/

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

/*

The main function for changing the value of stocks.
Runs on setInterval().
Updates LTP, Daily_change, total_change and current_value.

*/


setInterval(

    async () => {
        let stockNumber = getRandomIntInclusive(1,13);     //Randomly generated stock_id value which will be updated now
        let posOrNeg = getRandomIntInclusive(0,1);             //Randomly generates 0 or 1 for the increment/decrement. 
        let increment = parseFloat(Math.random().toFixed(2));   //Generates a random value between 0 and 1, as the increment/decrement val.
        let change = (posOrNeg==0) ? (-1)*increment : increment;  
        let sign = (posOrNeg==1) ? "+" : "";   //0 is assigned '-' and 1 is '+'
    
    
    
       await stocks.aggregate([
        
            { $match: {stock_id: stockNumber} },
            
             {
                 $project: {
                                 _id: 0,      
                                 "qty": 1,
                                 "instrument": 1,
                                 "change.daily_change": sign+change.toString()+"%",
                                 "ltp": { $round: [{ $add: [ "$base_value", change ] } , 2 ]} ,  
                                 "change.total_change": { $round: [{ $add: [ "$change.total_change", change ] } , 2 ]},
                                 "change.max_change":1         
         }},
         {
            $project: {
                            _id:0,
                            "instrument": 1,
                            "daily_change": "$change.daily_change",
                            "ltp": 1,
                            "total_change": "$change.total_change",
                            "max_change": "$change.max_change",
                            'current_val': { $round: [{ $multiply: [ "$qty", "$ltp" ] }, 2 ]},             
    }}
        
         ]).then(function( results) {
             if(results[0].total_change <= results[0].max_change && 
                results[0].total_change >= (-1)*results[0].max_change ){

                    stocks.collection.findOneAndUpdate({
                        stock_id: stockNumber
                        }, {
                            $set: {
                                "change.daily_change": results[0].daily_change,
                                "change.total_change": results[0].total_change,
                                ltp: results[0].ltp,
                                current_val: results[0].current_val,
                            } 
                        });
             }
            
          } )
          .catch(err => {
                console.log(err)
            });
    
    }
    , 1000);
