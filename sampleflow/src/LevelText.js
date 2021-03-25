import React, { Component } from "react";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";

class LevelText extends Component { 
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="levelText">
                <h4 className="Granite_Grey">Level {this.props.level}</h4>
                <b className="True_Blue">{this.props.levelName} </b>
            </div>
        
        );
    }
}

export default LevelText;