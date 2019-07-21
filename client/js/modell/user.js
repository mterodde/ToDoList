'use restrict'
const {
    LOGIN_STATUS_VALUES,
    INITIAL_USER_DATA,
    AUTH_RETRIEVALSTATUS
} = require('./authGlobals');

const UserAuth = require('../modell/authorize');

const processServiceResult = Symbol('processServiceResult');

class UserModell {
    constructor(sendStateFunc, authServiceURI = null) {
        /* reference to a function used to communicate status changes to the main controller */
        this.sendState = sendStateFunc;

        this.authService = new UserAuth(authServiceURI, this[processServiceResult]);

        this.userData = INITIAL_USER_DATA;
        this.loginStatus = LOGIN_STATUS_VALUES.loggedOf;
    }

    /*** Declaration of private class members ***/

    /* 
        process any answer from the authorization service
    */
    [processServiceResult](err, res) {
        if (err) {
            console.error(err);
            this.loginStatus = LOGIN_STATUS_VALUES.loginFailed;

            /* Tell the main controller that the login / registration of the user failed */
            this.sendState(AUTH_RETRIEVALSTATUS.loginFailed, err);
        } else {
            if (res.user) {
                /* 
                    In case of a successfull login, the auth service replies with a
                    full user data set which we store in this user object now.
                */
                this.userData = { ...res.user };
                this.loginStatus = LOGIN_STATUS_VALUES.loggedIn;
            }
            /* Tell the main controller that the login / registration for the user was successfull */
            this.sendState(AUTH_RETRIEVALSTATUS.loginSuccessfull);
        }
    }
    /*** End of declaration of private class members ***/


    get id() {
        return (this.userData.id);
    }

    get name() {
        return (this.userData.name);
    }

    get email() {
        return (this.userData.email);
    }

    get isLoggedIn() {
        return (this.loginStatus === LOGIN_STATUS_VALUES.loggedIn);
    }

    set name(name) {
        this.userData.name = name;
    }

    set email(email) {
        this.userData.email = email;
    }

    loggoff() {
        this.loginStatus = LOGIN_STATUS_VALUES.loggedOff;
    }

    login(credentials) {
        this.authService.loginUser(credentials);
        this.sendState(AUTH_RETRIEVALSTATUS.loginRunning);
    }

    register(credentials) {
        this.authService.registerUser(credentials);
        this.sendState(AUTH_RETRIEVALSTATUS.loginRunning);
    }
}

module.exports = UserModell;