
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

const AUTH_RETRIEVALSTATUS = {
    loginRunning: 1,
    loginSuccessfull: 2,
    loginFailed: 0
}

module.exports = {
    LOGIN_STATUS_VALUES,
    INITIAL_USER_DATA,
    AUTH_RETRIEVALSTATUS
}