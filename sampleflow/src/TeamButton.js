import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';

class TeamButton extends Component { 
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Button> Team {this.props.teamId} </Button>
            </div>
            
        );
    }
}

export default TeamButton; 
