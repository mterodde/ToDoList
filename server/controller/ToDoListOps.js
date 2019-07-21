'use strict'
const JWT = require('jsonwebtoken');
const ToDoList = require('../modells/toDoList');

function addEntry(req, res) {
    let authData = JWT.verify(req.get('Authorization').split(" ")[1], 'UserSecret');
    let newEntry = { ...req.body.toDoItem };
    newEntry.ownerId = authData.userId;

    ToDoList.create(newEntry, function (err) {
        if (err) {
            res.status(422).send(err.message);
        } else {
            res.send(200);
        }
    });
}

function retrieveEntries(req, res) {
    let authData = JWT.verify(req.get('Authorization').split(" ")[1], 'UserSecret');
    let conditions = {
        ownerId: authData.userId
    };

    ToDoList.find(conditions, 'taskId description staus creationDate startDate endDate', function (err, result) {
        if (err) {
            res.status(422).send(err.message);
        } else if (result.length === 0) {
            res.json({
                error: "No history data available"
            });
        } else {
            res.json({
                taskList: result
            })
        }
    });
}

function updateEntry(req, res) {
    let authData = JWT.verify(req.get('Authorization').split(" ")[1], 'UserSecret');
    /* create a record containing only those attributes that are relevant for any update */
    let { taskId, creationDate, ...updateRecord } = req.body.toDoItem;
    let conditions = {
        ownerId: authData.userId,
        taskId: taskId
    };
    let options = { multi: false };

    ToDoList.update(conditions, updateRecord, options, function (err) {
        if (err) {
            res.status(422).send(err.message);
        } else {
            res.send(200);
        }
    });
}

function removeEntry(req, res) {
    let authData = JWT.verify(req.get('Authorization').split(" ")[1], 'UserSecret');
    let conditions = {};
    conditions.ownerId = authData.userId;
    conditions.taskId = req.body.toDoItem.taskId;

    ToDoList.deleteOne(conditions, function (err) {
        if (err) {
            res.status(422).send(err.message);
        } else {
            res.send(200);
        }
    });
}

module.exports = {
    addEntry,
    retrieveEntries,
    updateEntry,
    removeEntry
}