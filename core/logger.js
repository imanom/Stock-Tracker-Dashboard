'use strict';

const {
    format,
    createLogger,
    transports
} = require('winston');
const expressWinston = require('express-winston');
const config = require('../config');

const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    level: config.logger.level,
    transports: [
        new(transports.Console)
    ]
});

const requestLogHandler = expressWinston.logger(logger);
const errorLogHandler = expressWinston.errorLogger(logger);



module.exports = {
    requestLogHandler,
    errorLogHandler,
    logger
};