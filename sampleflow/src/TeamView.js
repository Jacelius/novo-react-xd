import React, { Component } from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import TeamButton from "./TeamButton.js";
import Header from "./Header.js";
import Footer from "./Footer.js";
import LevelText from "./LevelText.js"; 
import "./style.css";
import ButtonSearch from "./ButtonSearch.js";

class TeamView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
          <Header></Header>
          <ButtonSearch></ButtonSearch>
          <div className="flexBox"> 
            <TeamButton teamId="3533_01"></TeamButton>
            <TeamButton teamId="3533_02"></TeamButton>
            
          </div>
          <div>
            <LevelText level="2" levelName="Teams"></LevelText>
          </div>
          
          <Footer></Footer>
      </div>
    );
  }
}



ReactDOM.render(<TeamView/>, document.getElementById("root"));
