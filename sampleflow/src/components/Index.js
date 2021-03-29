import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../Style/main.css';

import Header from './Header/Header';

function Index() {
    return (
        <div>
        <Header></Header>
        </div>
    );
}

ReactDOM.render(<Index />, document.getElementById('root'));