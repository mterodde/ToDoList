'use restrict'

const LOGIN_STATUS_VALUES = {
    loggedOff: 0,
    loggedIn: 1,
    loginFailed: 99
}

const INITIAL_USER_DATA = {
    id: '',
    name: '',
    email: '',
}

class UserModel {
    constructor(userData = INITIAL_USER_DATA) {
        this.userData = userData;
        this.loginStatus = LOGIN_STATUS_VALUES.loggedOf;
    }

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

    login(restServiceHandle, password) {


    }

    register(restServiceHandle, password) {

    }
}

module.exports = UserModel;