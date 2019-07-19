const User = require("../client/js/modell/userModel");
var assert = require("assert");

const testUserDescription = {
    name: "DerHorst",
    email: 'horst@test.de'
}

describe('User', () => {
    describe('#createNewUser', () => {
        it('check wether all user attibutes are correctly set and returned by the getters', () => {
            let user = new User(testUserDescription);
            assert.strictEqual(user.name, testUserDescription.name);
            assert.strictEqual(user.email, testUserDescription.email);
            assert.strictEqual(user.isLoggedIn, false);
        });
    });
});