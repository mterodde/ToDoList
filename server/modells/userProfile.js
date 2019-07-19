'use strict'

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const SALT_WORK_FACTOR = 5;
const Schema = mongoose.Schema;

const ProfileSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        }
    }
);

ProfileSchema.pre('save', function(next){
    let user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash){
            if (err) return next(err);

            user.password = hash;
            next();
        })
    })
});

ProfileSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) {
            cb(err);
        }
        cb(null, isMatch)
    });
};

const profileDb = mongoose.connection.useDb('MatrixUserProfiles');
const Profile = profileDb.model('Profile', ProfileSchema);

module.exports = Profile;