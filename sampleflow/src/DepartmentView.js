import React, { Component } from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import DepartmentButton from "./DepartmentButton.js";
import Header from "./Header.js";
import Footer from "./Footer.js";
import LevelText from "./LevelText.js"; 
import "./style.css";
import ButtonSearch from "./ButtonSearch.js";


class DepartmentView extends Component {
  constructor(props) {
    super(props);
  }

  getDepartmentButtons() {
    let depBtns = fetchSecurityDeps()
    return depBtns; 
  }

  render() {
    return (
      <div>
          <Header></Header>
          <ButtonSearch></ButtonSearch>
          <div className="flexBox"> 
            <DepartmentButton departmentId="c17"></DepartmentButton>
            <DepartmentButton departmentId="c29"></DepartmentButton>
            {this.getDepartmentButtons()}
            
          </div>
          <div>
            <LevelText level="1" levelName="Departments"></LevelText>
          </div>
          
          <Footer></Footer>
      </div>
    );
  }
}


// let sec_dep1 = json[0]; // { name:"4355", "teams":{} }
          /*
          var buttons = [];

          for (let i = 0; i < json.length; i++) {
            const sec_dep = json[i];
            buttons.push(<DepartmentButton departmentId={sec_dep.name} teams={sec_dep.teams}></DepartmentButton>);
          }
      
          return buttons
          */

ReactDOM.render(<DepartmentView/>, document.getElementById("root"));

function fetchSecurityDeps() {
  fetch('https://localhost:5001/api/securitydeps')
        .then(response => console.log(response.json()));
};
