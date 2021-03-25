import React, { Component } from "react";
import ReactDOM from "react-dom";
import 'regenerator-runtime/runtime';
import "bootstrap/dist/css/bootstrap.min.css";
import DepartmentButton from "./DepartmentButton.js";
import Header from "./Header.js";
import Footer from "./Footer.js";
import LevelText from "./LevelText.js"; 
import "./style.css";
import ButtonSearch from "./ButtonSearch.js";


async function getDepartments() {
  let fetchResult = await fetch('https://localhost:5001/api/Securitydeps');
  let response = await fetchResult.json();
  return // response [departments]
}

class DepartmentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departmentTeams: []
    };
  }

  async componentDidMount() {
    let data = await fetch('https://localhost:5001/api/securitydeps');
    let json = await data.json(); 
    this.setState({ departmentTeams: json });
    console.log(this.state);
  }

  async getDepartmentButtons() {
    let fetchResult = await fetch('https://localhost:5001/api/Securitydeps');

    let response = await fetchResult.json();
    
      // .then(response => response.json())
      // .then(data => {
      //     return data;
        // <DepartmentButton departmentId={data[0].name}></DepartmentButton>

        // for(let i = 0; i < data.length; i++) {
        //   console.log(data[i]);
        //   console.log(data[i].name);
        //   <DepartmentButton departmentId={data[i].name}></DepartmentButton>
        // }}
      // });
  }


  render() {
    return (
      <div>
          <Header></Header>
          <ButtonSearch></ButtonSearch>
          <div className="flexBox"> 
            {/* <DepartmentButton departmentId="c17"></DepartmentButton>
            <DepartmentButton departmentId="c29"></DepartmentButton> */}
            { 
              this.state.departmentTeams.map( department => <DepartmentButton departmentId={department.name}></DepartmentButton>) 
            }                        
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
  const data = fetch('https://localhost:5001/api/securitydeps')
  .then(response => response.json());
};
