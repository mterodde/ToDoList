'use strict'
const express = require('express');
const UserHistory = require('../controller/UserHistoryOps');
const router = express.Router();

/* POST new history record for given user */
router.post('/add', UserHistory.addEntry);

/* GET all history records of given user */
router.get('/retrieve', UserHistory.retrieveHistory);

module.exports = router;