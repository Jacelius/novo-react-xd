import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AnchorPoint from './AnchorPoint';

export default class TeamButton extends Component {
    render() {
        return (
            <Link to={this.props.url}>
                <div className="team-button">
                    <h1>Team {this.props.teamName}</h1>
                    <p>Methods: {this.props.methods}</p>
                    {/* <AnchorPoint /> */}
                </div>
            </Link>
        );
    }
};