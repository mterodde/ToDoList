const JWT = require('jsonwebtoken');
const ServiceHandler = require('./serviceHandler');

class UserAuth extends ServiceHandler {
    constructor(serviceURI, callback) {
        super(serviceURI, callback);
    }

    /* 
        Override method from superclass

        Decrypt the user credentials that were transferred encrypted 
        within the message body.
     */
    decodeResponse(data){
        try {
            let decryptedData = JWT.verify(data.user, "UserSecret");
            this.callback(null,decryptedData)                
        } catch (error) {
            this.callback(error);
        }
    }

    registerUser(userCredentials) {
        let headers = this.buildHeaders(userCredentials);
        let options = this.buildOptions(headers, 'POST');
        this.callService('login',options);
    }

    loginUser(userCredentials) {
        let headers = this.buildHeaders(userCredentials);
        let options = this.buildOptions(headers, 'GET');
        this.callService('register',options);
    }

    buildHeaders(userCredentials) {
        let headers = new Headers();
        headers.append("Access-Control-Request-Headers", "Authorization");
        headers.append("Authorization", `Bearer ${JWT.sign(userCredentials, "UserSecret")}`);
        return headers;
    }
}

module.exports = UserAuth;