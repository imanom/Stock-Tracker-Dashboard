var mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
   
    email: { type: String, required:true, unique:true, dropDups:true },
    password: { type: String, required:true},
    firstname:String,
    lastname:String,
    stocks:[Number]   //stores the "stock_id" of the stocks owned by the user
},{
    timeStamps:true
});


/*

A small function to generate random numbers

*/

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

/*

Hash the password using BCRYPT before storing in DB.
Also randomly assign a few stocks to the user.

*/

userSchema.pre('save', function (next) {
    var user = this;

    var num=13;    //Total number of stocks (documents) present in the stocks collection in DB.(hardcoded for now)

    var select_num_stocks = getRandomIntInclusive(7,num);
    var stock_nums = [];
    for(let i=0;i<select_num_stocks;i++){
      var val = getRandomIntInclusive(1,num)
      if(!stock_nums.includes(val))
        {stock_nums.push(val);}
      else{
        i--;
      }
    }

    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      user.stocks = stock_nums;
      next();
    })
  });



/*

Authenticate email-id and password against database during sign-in!

*/

userSchema.statics.authenticate = function (email, password, callback) {
    users.findOne({ email: email })
      .exec(function (err, user) {
        if (err) {
          return callback(err)
        } else if (!user) {
          var err = new Error('User not found.');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(password, user.password, function (err, result) {
          if (result === true) {
            return callback(null, user);
          } else {
            return callback();
          }
        })
      });
  }



var users = mongoose.model('users',userSchema,'users');
module.exports = users;