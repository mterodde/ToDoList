import JWT from "jsonwebtoken";
import { serviceTypes } from "../constantValues";



/* 

*/
export default class RESTProxy {
  constructor(baseURI, typeOfService) {
    this.serviceType = typeOfService;
    this.inputs = [];
    this.baseURI = baseURI;
    this.callback = null;
    this.callService = this.callService.bind(this);
    this.decodeResponse = this.decodeResponse.bind(this);
  }

  handleError(resp) {
    if (!resp.ok) {
      throw new Error(`Application error; ${resp.statusText}`);
    }
    return resp;
  }

  decodeResponse(data) {
    if (this.serviceType === serviceTypes.AUTH_SERVICE) {
      if (data.error)
        throw new Error(`Application error: ${data.error}`)
      let decryptedData = JWT.verify(data.user, "MatrixSecret");
      this.callback(decryptedData)
    } else {
      this.callback(data)
    }
  }

  callAuthorizationService() {
    let myHeaders = new Headers();
    myHeaders.append("Access-Control-Request-Headers", "Authorization");
    myHeaders.append("Authorization", `Bearer ${JWT.sign(inputData, "MatrixSecret")}`);
    options['headers'] = myHeaders;
  }

  callDataService() {
    let myHeaders = new Headers();
    myHeaders.append("Access-Control-Request-Headers", "Authorization");
    myHeaders.append("Content-Type", "application/json");
    if (currentUserId.userId) /* in case a user is logged in, the users id is sent for accessing the history */
      myHeaders.append("Authorization", `Bearer ${JWT.sign(currentUserId, "MatrixSecret")}`);
    options['headers'] = myHeaders;
    transferString = JSON.stringify(inputData);
  }

  callService(serviceID, inputData, callback, errorFunction, method, currentUserId) {
    this.callback = callback;
    let serviceURI = this.baseURI + "/" + serviceID;
    let transferString = "";
    // Default options are marked with *
    let options = {
      method: method ? method : "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "omit", // include, *same-origin, omit
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer" // no-referrer, *client
    };

    /* construct header for the specific type of service beeing called */
    switch (this.serviceType) {
      case serviceTypes.AUTH_SERVICE: {
        let myHeaders = new Headers();
        myHeaders.append("Access-Control-Request-Headers", "Authorization");
        myHeaders.append("Authorization", `Bearer ${JWT.sign(inputData, "MatrixSecret")}`);
        options['headers'] = myHeaders;
      }
        break;

      case serviceTypes.DATA_SERVICE: {
        let myHeaders = new Headers();
        myHeaders.append("Access-Control-Request-Headers", "Authorization");
        myHeaders.append("Content-Type", "application/json");
        if (currentUserId.userId) /* in case a user is logged in, the users id is sent for accessing the history */
          myHeaders.append("Authorization", `Bearer ${JWT.sign(currentUserId, "MatrixSecret")}`);
        options['headers'] = myHeaders;
        transferString = JSON.stringify(inputData);
      }
        break;

      case serviceTypes.SUPPORT_SERVICE:

        break;

      default:
        break;
    }

    if (method === "POST") {
      options["body"] = transferString; // body data type must match "Content-Type" header
    }

    console.log(`calling service with UIR: ${serviceURI} and options ${options}`);

    return fetch(serviceURI, options)
      .then(this.handleError)
      .then(resp => resp.json())
      .then(this.decodeResponse)
      .catch(errorFunction);
  }

  fetchInputStructure(callback, errorFunction) {
    let serviceURI = this.baseURI + "?ips";
    fetch(serviceURI)
      .then(callback)
      .catch(errorFunction);
  }
}
