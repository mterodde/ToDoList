'use strict'
const mongoose = require('mongoose');
const db_connection_def = require('./dbConnectionConstants');

const Schema = mongoose.Schema;

const ToDoSchema = new Schema(
    {
        taskid: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        status: {
            type: Number,
            required: true
        },
        ownerId: {
            type: String,
            required: true
        },
        creationDate: {
            type: String,
            required: true
        },
        startDate: {
            type: String,
            required: false
        },
        endDate: {
            type: String,
            required: false
        }
    }
);

const toDoDB = mongoose.connection.useDb(db_connection_def.DATABASE_NAME);

const ToDoList = toDoDB.model(db_connection_def.TODO_PROFILE_SCHEMA, ToDoSchema);

module.exports = ToDoList;