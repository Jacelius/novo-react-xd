import React, { Component } from "react";
import SearchIcon from "../img/SearchIcon.png";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";

class ButtonSearch extends Component { 
    constructor(props) {
        super(props);
    }

    toggleSearchBar() { //TODO Make the the Search Button toggle a search bar

    }

    render() {
        return (
            <div className="topRight">
                <img className="floatRight" src={SearchIcon} alt="Search Icon" width="25%"></img>
            </div>    
        );
    }
}

export default ButtonSearch;