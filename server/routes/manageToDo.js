'use strict'
const express = require('express');
const ToDo = require('../controller/ToDoListOps');
const router = express.Router();

/* POST to-do list record for given user */
router.post('/create', ToDo.addEntry);

/* CHANGE a single to-do list record of a given user */
router.patch('/update', ToDo.updateEntry);

/* DELETE a single to-do list record of a given user */
router.delete('/delete', ToDo.removeEntry);

/* GET all to-do list records of given user */
router.get('/retrieve', ToDo.retrieveEntries);

module.exports = router;