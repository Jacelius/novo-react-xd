import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class DepartmentView extends Component {
    render() {
        return (
            <Link to={this.props.url}>
            <div className="department-button">
                <h1>Department {this.props.departmentName}</h1>
            </div>
            </Link>
        );
    }
};