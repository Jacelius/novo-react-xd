import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class DepartmentView extends Component {
    render() {
        return (
            <Link to={this.props.url}>
            <div className="teams-view-button">
                <h1>Team {this.props.teamName}</h1>
                <p>Methods: {this.props.methods}</p>
            </div>
            </Link>
        );
    }
};

export default DepartmentView;