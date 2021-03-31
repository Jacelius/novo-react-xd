import React, { Component } from 'react';

export default class Footer extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="footer">
                <nav className="footer-nav">
                    <p>C19 {this.props.department} {this.props.team}</p>
                </nav>
            </div>
        );
    }
}