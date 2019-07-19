'use strict'
const JWT = require('jsonwebtoken');
const Profile = require('../modells/userProfile');

function newUser(req, res) {
    let authData = JWT.verify(req.get('Authorization').split(" ")[1], 'MatrixSecret');
    if (authData.email &&
        authData.username &&
        authData.password) {
        let userData = {
            email: authData.email,
            username: authData.username,
            password: authData.password
        };

        Profile.create(userData, function (err, user) {
            if (err) {
                res.status(422).send(err.message);
            } else {
                let userData = {
                    email: user.email,
                    username: user.username,
                    id: user.id
                }
                res.json({
                    user: JWT.sign(userData, "MatrixSecret")
                });
            }
        });
    }
}

function signin(req, res) {
    let authData = JWT.verify(req.get('Authorization').split(" ")[1], 'MatrixSecret');
    if (authData.email &&
        authData.password) {

        let searchRecord = {
            email: authData.email
        }


        Profile.findOne(searchRecord, 'username password email id', function (err, user) {
            if (err) {
                res.status(422).send(err.message);
            } else if (!user) {
                res.json({
                    error: "Combination of user and Password not found"
                });
            } else {
                user.comparePassword(authData.password, function (err, isMatch) {
                    if (err) {
                        res.status(422).send(err.message);
                    } else if (isMatch) {
                        let userData = {
                            email: user.email,
                            username: user.username,
                            id: user.id
                        }
                        res.json({
                            user: JWT.sign(userData, "MatrixSecret")
                        });
                    } else {
                        res.json({
                            error: "Combination of user and Password not found"
                        });
                    }
                })
            }
        });
    }
}

module.exports = {
    newUser,
    signin
};