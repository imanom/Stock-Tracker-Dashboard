'use strict';

module.exports = {
    port: process.env.PORT || 3000,
    logger: {
        level: process.env.LOGGER_LEVEL || 'info'
    },
    
    dbUrl: "Mongo DB URL",
    redisURL: {
        host: 'Redis Host', 
        port: YOUR_PORT,
        password: 'Redis password'
    }
};
