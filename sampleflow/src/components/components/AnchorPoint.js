import React, { Component } from 'react';

export default class AnchorPoint extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="anchor-point"><div className={this.props.anchorName}></div></div>
        );
    }
}