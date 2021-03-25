import React, { Component } from "react";
import ReactDOM from "react-dom";
import Logo from "../img/nn_logo_rgb_white.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import Spinner from "react-bootstrap/Spinner";
import "./style.css";

class Header extends Component {
    constructor(props) {
      super(props);
      this.state = { loading: false };
    } 

    render() {
        return (
          <div id="app">
            <div className="App-header">
              <div className="row" id="title-container">
                <span id="title" className="col">
                  <div
                    id="refresh-button"
                    role="button"
                    onClick={() => window.location.reload()}
                    onKeyDown={() => window.location.reload()}
                    tabIndex={0}
                  >
                    Sample flow analytics
                  </div>
                </span>
                <img src={Logo} alt="logo" id="logo" className="col" />
              </div>
            </div>
    
            {/* LOADING SPINNER */}
            {this.state.loading && (
              <div id="loading-spinner-container">
                <Spinner id="loading-spinner" animation="border" role="status">
                  <span className="sr-only">Loading...</span>{" "}
                </Spinner>
              </div>
            )}
          </div>
        );
      }
    }

export default Header; 

/* ReactDOM.render(<Header />, document.getElementById("root")); */ 