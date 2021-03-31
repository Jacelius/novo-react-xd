import React, { Component, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

//Component imports
import Header from './Header/Header';
import SampleSearch from './components/SampleSearch';

//Pages imports
import FirstLevel from './FirstLevel';
import SecondLevelDetails from './SecondLevelDetails';
import ThirdLevel from './ThirdLevelDetails';

function Index() {
    return (
        <Router>
            <div className="App">
                <Header />
                <SampleSearch />
                <Switch>
                    <Route path="/" exact component={ FirstLevel } />
                    <Route path="/:name" component={ SecondLevelDetails } />
                    <Route path="/thirdLevel/:team" component={ ThirdLevel } />
                </Switch>
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