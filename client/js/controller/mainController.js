"use strict";
import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { Container, Row, Col } from "react-bootstrap";
import RESTProxy from "../modell/RESTProxy";
import { serviceConfiguration } from "../../public/configuration/serviceConfiguration";
import { serviceTypes } from "../constantValues";
import MyNavbar from "../views/navbar";
import AppView from "../views/appView";
import LoginView from "../views/loginView";

class MainView extends React.Component {
  constructor(props) {
    console.log("Main View newly rendered at " + Date.now());

    super(props);

    this.serviceHost = location.hostname;
    this.myEnvironment = "NO_ENV";
    this.calculationService = new RESTProxy(
      `http://${this.serviceHost}:3000/matrices`,
      serviceTypes.DATA_SERVICE
    );

    this.authService = null;
    this.historyService = null;

    this.state = this.newSessionStatus;


    this.handleNavigationEvent = this.handleNavigationEvent.bind(this);
    this.prepareLoginOperation = this.prepareLoginOperation.bind(this);
    this.prepareLogoffOperation = this.prepareLogoffOperation.bind(this);
    this.processLoginResult = this.processLoginResult.bind(this);
    this.processRegistrationResult = this.processRegistrationResult.bind(this);
    this.handleServiceError = this.handleServiceError.bind(this);

    this.handleLoginInput = this.handleLoginInput.bind(this);
    this.handleRegistrationInput = this.handleRegistrationInput.bind(this);

    this.inputView = this.inputView.bind(this);
  }

  /***************************************************************************
                            controller bootstrap functions
    ***************************************************************************/

  /***************************************************************************
                            Navigation event handler
    ***************************************************************************/
  /*
        Handles the selectoin of the type of calculation in the top navigation
    */
  handleNavigationEvent(e) {
    let configIds = e.currentTarget.id.split(';');
    let opSchema = this.props.serviceConfiguration[configIds[0]].items[configIds[1]];
    let currentOperation = new Operation(opSchema);

    switch (currentOperation.opType) {
      case "user":
        currentOperation.opCode === "login" ?
          this.prepareLoginOperation(currentOperation) :
          this.prepareLogoffOperation();
        break;

      case "history":
        this.prepareHistoryOperation(currentOperation);
        break;

      case "mat":
        this.prepareMatrixOperation(currentOperation);
        break;

      default:
        break;
    }
  }

  /*
        Initial set up of the components status for execution of any operation
    */
  basicOperationStatus(currentOperation) {
    let statusUpdate = {
      currentOperation: currentOperation,
      showInput: currentOperation.needsUserInput,
      statusMessage: "",
      matrixModel: null
    };
    return statusUpdate;
  }

  /* 
      Inital set up of the components status in case of a user session change
  */
  get newSessionStatus() {
    return {
      currentOperation: null,   /* Object containing all infos regarding the currently choosen operation */
      showInput: false,         /* Indicates whether the input modal should be shown */
      statusMessage: "",        /* Text of the current status message if there is any */
      explanations: null,       /* List of explanations of former matrix operations */
      currentUser: null,        /* Currently logged in user */
      matrixModel: null,        /* Model of the input and output parameters for the currently choosen operation */
      historyData: null        /* Full context of formerly executed operations */
    };
  }

  /*
        Initial set up of the components status for execution of a login / registrationn operation
    */
  prepareLoginOperation(currentOperation) {
    if (this.authService === null) {
      this.retrieveServiceURI('matrix-cluster', 'user-management-service');
    }
    let statusUpdate = this.basicOperationStatus(currentOperation);
    this.setState(statusUpdate);
  }

  prepareLogoffOperation() {
    let currentUser = this.state.currentUser;
    let statusUpdate = this.newSessionStatus;

    statusUpdate.statusMessage = `User ${currentUser.userName} has logged of`;

    this.setState(statusUpdate);
  }

  /***************************************************************************
                            Service request handler
    ***************************************************************************/

  /*
        Call authorization services
    */
  processAuthorizationRequest(
    authOp,
    authData,
    processResult,
    handleServiceError
  ) {
    try {
      this.authService.callService(
        authOp,
        authData,
        processResult,
        handleServiceError,
        "POST"
      );
    } catch (error) {
      console.log(error);
    }
  }

  /***************************************************************************
                            Service response handler
    ***************************************************************************/

  /*
       call back for the login service success responses. Transfers the result data to the mmodel
       and does an update of the main controler state
    */
  processLoginResult(data) {
    let statusUpdate = this.newSessionStatus;
    statusUpdate.currentUser = new UserModel(data);
    statusUpdate.statusMessage = `user ${statusUpdate.currentUser.userName} successfully logged in`;
    this.setState(statusUpdate);
  }

  /*
       call back for the login service success responses. Transfers the result data to the mmodel
       and does an update of the main controller state
    */
  processRegistrationResult(data) {
    let statusUpdate = this.newSessionStatus;
    statusUpdate.currentUser = new UserModel(data);
    statusUpdate.statusMessage = `user ${statusUpdate.currentUser.userName} successfully registerd`;
    this.setState(statusUpdate);
  }

  /*
        call back for the calculation service failure responses. Update to the main model according to the error type
    */
  handleServiceError(error) {
    let statusMessage = !error.message.startsWith("Application")
      ? "Notworking error: Couldn't reach the service"
      : error.message;

    console.log(error.message);

    this.setState({ statusMessage: statusMessage.split(":")[1] });
  }

  /***************************************************************************
                            User input handler
    ***************************************************************************/

  /*
       Handles the input of login data in the input view
   */
  handleLoginInput(loginRecord) {
    let { canceled, ...rest } = loginRecord;
    if (canceled) {
      this.setState({
        showInput: false,
        statusMessage: "login canceled"
      });
    } else {
      this.setState({
        showInput: false,
        stausMessage: "login executed"
      });
      this.processAuthorizationRequest(
        "login",
        rest,
        this.processLoginResult,
        this.handleServiceError
      );
    }
  }

  /*
       Handles the input of user credentials for registration in the input view
   */
  handleRegistrationInput(registrationRecord) {
    let { canceled, ...rest } = registrationRecord;
    if (canceled) {
      this.setState({
        showInput: false,
        statusMessage: "registration canceled"
      });
    } else {
      this.setState({
        showInput: false
      });
      this.processAuthorizationRequest(
        "register",
        rest,
        this.processRegistrationResult,
        this.handleServiceError
      );
    }
  }

  /***************************************************************************
                            Render support functions
    ***************************************************************************/

  /* 
        display status informations comming from the server. if any  
    */
  statusInfoView() {
    if (this.state.statusMessage) {
      return <StatusInfo statusMessage={this.state.statusMessage} />;
    }
  }

  /* 
       modals for user data input (matrix dimensions & user credentials). triggerd by the top navigation 
    */
  inputView() {
    if (this.state.currentOperation) {
      switch (this.state.currentOperation.opType) {
        case "mat":
          return (
            <DimensionInput
              operation={this.state.currentOperation}
              show={this.state.showInput}
              finishDimensionInput={this.handleDimensionInput}
            />
          );
        case "user":
          return (
            <LoginView
              show={this.state.showInput}
              handleLogin={this.handleLoginInput}
              handleRegistration={this.handleRegistrationInput}
            />
          );
      }
    }
  }

  /* 
        View displaying the input matrices, the operator symbol and the
        resulting matrix. Will be displayed, whenever the information for the 
        dimension of the matrices beeing processed is complete
    */
  applicationView() {
    if (this.state.matrixModel) {
      let matrixHandles = this.state.matrixModel.modellHandle;

      return (
        <Row>
          <Col>
            <AppView
              inputMatrices={matrixHandles.inputMatrices}
              resultMatrix={matrixHandles.resultMatrix}
              runCalc={this.processCalucationRequest}
              opSymbols={this.state.currentOperation.opSymbols}
            />
          </Col>
        </Row>
      );
    }
  }

  render() {
    return (
      <div id="display-area">
        <div id="nav-area">
          <MyNavbar
            currentEnv={this.myEnvironment}
            serviceConfiguration={this.props.serviceConfiguration}
            currentUser={this.state.currentUser}
            eventHandler={this.handleNavigationEvent}
          />
        </div>
        <div id="content-area">
          {this.statusInfoView()}
          {this.inputView()}
          <Container>
            {this.applicationView()}
            {this.explanationView()}
          </Container>
        </div>
      </div>
    );
  }
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    console.log(error);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong</h1>;
    }
    return this.props.children;
  }
}

MainView.propTypes = {
  serviceConfiguration: PropTypes.array
};

ErrorBoundary.propTypes = {
  children: PropTypes.array
};

ReactDOM.render(
  <ErrorBoundary>
    <MainView serviceConfiguration={serviceConfiguration} />
  </ErrorBoundary>,
  document.getElementById("main-view")
);
