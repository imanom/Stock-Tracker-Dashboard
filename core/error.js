'use strict';

/**
 * Note: All four parameter for error handler.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    res.status(500).send({
        error: 'Unexpected error.'
    });
}

module.exports = errorHandler;