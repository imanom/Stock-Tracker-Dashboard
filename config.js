'use strict';

module.exports = {
    port: process.env.PORT || 3000,
    logger: {
        level: process.env.LOGGER_LEVEL || 'info'
    },
    
    dbUrl: "mongodb+srv://Imanom:Imanom123@cluster1-jvtpq.mongodb.net/stockDB?retryWrites=true&w=majority",
    redisURL: {
        host: 'redis-11564.c62.us-east-1-4.ec2.cloud.redislabs.com', 
        port: 11564,
        password: '5A16C8KivV28UvBRe5JVY0X9WH7pAY4R'
    }
};