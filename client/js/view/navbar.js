import React from "react";
import { Navbar, Nav, NavDropdown, Image } from "react-bootstrap";
import PropTypes from "prop-types";

export default class MyNavbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: this.props.currentUser,
      serviceConfiguration: this.props.serviceConfiguration
    }

    this.navTopics = this.navTopics.bind(this);
    this.userStatus = this.userStatus.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.currentUser !== state.currentUser) {
      return ({
        currentUser: props.currentUser
      })
    }
    return null;
  }

  navTopics() {
    return (
      this.state.serviceConfiguration.map((navConfig, key) => {
        let id1 = key;
        if (navConfig.title !== "User") {
          return (
            <NavDropdown title={navConfig.title} key={key} id="basic-nav-dropdown">
              {navConfig.items.map((navItem, key) => {
                if (navItem.status === 'production' || this.props.currentEnv === 'local') {
                  return (
                    <NavDropdown.Item
                      key={key}
                      id={`${id1};${key}`}
                      disabled={navItem.needsLogin && this.state.currentUser === null}
                      onClick={this.props.eventHandler}>
                      {navItem.opTitle}
                    </NavDropdown.Item>);                    
                } else {
                  return null;
                }
              })}
            </NavDropdown>
          )
        }
        return null;
      })
    )
  }

  userStatus() {
    let userConfig = this.state.serviceConfiguration.find((navConfig) => { return navConfig.title === "User" });

    return (
      <NavDropdown
        title={
          this.state.currentUser && this.state.currentUser.loggedIn ?
            <Image width="30px" className="img-responsive" src="/images/smileyAwake.png" /> :
            <Image width="30px" className="img-responsive" src="/images/smileySleeping.jpg" />
        }
      >
        {userConfig.items.map((navItem, key) => {
          // TODO: Substitute the workaround of hardcoding the id-prefix to '0'
          return (<NavDropdown.Item key={key} id={`0;${key}`} onClick={this.props.eventHandler}>{navItem.opTitle}</NavDropdown.Item>);
        })}
      </NavDropdown>
    )
  }

  render() {
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Matrix-Calculator</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {this.navTopics()}
          </Nav>
          <Nav >
            {this.userStatus()}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}


MyNavbar.propTypes = {
  currentEnv: PropTypes.string,
  serviceConfiguration: PropTypes.array,
  currentUser: PropTypes.object,
  eventHandler: PropTypes.func
}

