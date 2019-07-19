'use strict'
/* 
    currently the following routes are provided:
        /user/register
        /user/login
        
        /history/add
        /history/retrieve
        
 */
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

/* Start application server */
const app = express();
const port = process.env.port || 3200;
app.listen(port);

/* Setup connections to local databases */
let dbUri = process.env.NODE_ENV === 'production' ?
    'mongodb://mongo:27017/default' :
    'mongodb://localhost:27017/default';

mongoose.connect(dbUri, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('connected');
})

/* Set up of basic middelware operations */
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

/* Set up of routing */
const profileRouter = require('./routes/mangageProfile');
app.use('/user', profileRouter);
const historyRouter = require('./routes/manageHistory');
app.use('/history', historyRouter);

/* Error handling */
app.use(function (err, req, res, next) {
    res.statusMessage = err.message;
    res.status(422).end();
});

console.log("user management listening on port " + port);



