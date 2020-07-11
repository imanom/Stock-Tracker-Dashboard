'use strict';

module.exports = {
    port: process.env.PORT || 3000,
    logger: {
        level: process.env.LOGGER_LEVEL || 'info'
    },
    
    dbUrl: "MongoDB Atlas URL",
    redisURL: {
        host: 'Redis HOST', 
        port: Redis PORT,
        password: 'Redis Password'
    }
};
