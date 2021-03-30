import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Header from './Header/Header';
import About from './About';

function Index() {
    return (
        // <div>
        // <Header></Header>
        // </div>
        <Router>
            <div className="App">
                <Header />
                <Route path="/about" component={About} />
            </div>
        </Router>
    );
}

export default Index;

ReactDOM.render(
    <React.StrictMode>
        <Index />
    </React.StrictMode>,
    document.getElementById('root')
);