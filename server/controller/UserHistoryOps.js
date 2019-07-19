'use strict'
const JWT = require('jsonwebtoken');
const History = require('../modells/userHistory');

function addEntry(req, res){
    let authData = JWT.verify(req.get('Authorization').split(" ")[1], 'MatrixSecret');
    let historyEntry = {
        userId: authData.userId,
        opCode: req.body.historyItem.opCode,
        explanation: req.body.historyItem.explanation,
        inputs: req.body.historyItem.inputs,
        result: req.body.historyItem.result
    };

    History.create(historyEntry, function(err, historyRecord) {
        if (err) {
            res.status(422).send(err.message);
        } else {
            res.send(200);
        }
    })
}

function retrieveHistory(req, res){
    let authData = JWT.verify(req.get('Authorization').split(" ")[1], 'MatrixSecret');
    if (authData.userId) {
        let searchRecord = {
            userId: authData.userId
        };

        History.find(searchRecord, 'opCode explanation inputs result', function (err, historyArray) {
            if (err) {
                res.status(422).send(err.message);
            } else if (historyArray.length === 0) {
                res.json({
                    error: "No history data available"
                });
            } else {
                res.json({
                    history: historyArray
                })
            }
        })   
    } else {
        res.json({
            error: "you must be logged in, to get access to your history"
        });
}

}

module.exports = {
    addEntry,
    retrieveHistory
}