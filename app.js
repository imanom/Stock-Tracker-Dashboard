'use strict';

const express = require('express');
const config = require('./config');
var cookieParser = require('cookie-parser');
var randomstring = require("randomstring");
const errorHandler = require('./core/error');
const {
    requestLogHandler,
    errorLogHandler
} = require('./core/logger');


const appRouter = require('./app.router');

var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
const path = require('path');
const xss = require('xss-clean')
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
 

var app = express();


/*

Set the views for the html and javascript files

*/

app.set('views',path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.use(express.static('static'));


/*

Set the session using redis as the session store.

*/

const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const redisClient  = redis.createClient(
  config.redisURL.port,
  config.redisURL.host, 
  {no_ready_check: true}
  );

redisClient.auth(config.redisURL.password);

const sessionMiddleware = (
  session({
    secret: randomstring.generate(), 
     name: "stocksname", 
     cookie: {
      httpOnly: true,
      //secure: true,
      sameSite: true,
      maxAge: 600000 // Time is in miliseconds
  },
    store: new redisStore({ 
      
      client: redisClient ,ttl: 86400}),  
      saveUninitialized: false, 
      resave: false
  })
)

app.use(sessionMiddleware);



app.use((req, res, next) => {
  if (!req.session && !req.session.userId) {
    res.render('login.html')       
  }
  next();
});


app.use(express.json(({limit: '10kb'})));
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({limit: '10kb', extended: true}));
app.use(cookieParser());
app.use(cors());
app.use('/', appRouter);
app.use(requestLogHandler);
app.use(errorLogHandler);
app.use(errorHandler);
app.use(xss());
app.use(helmet());
app.use(mongoSanitize());


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  next(); 
});


/* 

Mongo DB - Mongoose Connection 

*/
mongoose.Promise = global.Promise;

mongoose.connect(config.dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("connected to mongo database");
    })
    .catch(err => {
        console.log("error : " + err);
        process.exit();
    });


/*

Start the server.
And the socket.io

*/

const port = config.port;

const server = app.listen(port, () => {
  console.log('Server is running at port ' + port);
});

const io = require('socket.io').listen(server);

io.use(function(socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});

require('./socket')(io);




