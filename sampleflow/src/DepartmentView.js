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

function fetchSecurityDeps() {
  const data = fetch("localhost:5000/api/SecurityDeps")
  if (data.status === 200) { // success
      let json = data.json() // [{name:"4355", "teams":{}}, name:"0420", "teams":{}]

      // let sec_dep1 = json[0]; // { name:"4355", "teams":{} }

      var buttons = [];

      for (let i = 0; i < json.length; i++) {
        const sec_dep = json[i];
        buttons.push(<DepartmentButton departmentId={sec_dep.name} teams={sec_dep.teams}></DepartmentButton>);
      }

      return buttons
  }
  else return null; 
}



ReactDOM.render(<DepartmentView/>, document.getElementById("root"));
