import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';

class DepartmentButton extends Component { 
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Button> Department {this.props.departmentId} </Button>
            </div>
            
        );
    }
}

export default DepartmentButton; 
// const depBtn1 = <DepartmentButton departmentId="c17"/>;
// ReactDOM.render(<DepartmentButton />, document.getElementById("root"));