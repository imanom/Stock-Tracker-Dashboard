'use strict';

const router = require('express').Router();
const controller = require('./dashboard.controller');


router.get('/',controller.dashboard);
router.get('/setupData',controller.setupController);

module.exports = router;