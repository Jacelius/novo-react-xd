import React, { Component, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

//Component imports
import Header from './Header/Header';
import SampleSearch from './components/SampleSearch';
import Footer from './Footer/Footer';

//Pages imports
import FirstLevel from './FirstLevel';
import SecondLevelDetails from './SecondLevelDetails';
import About from './About';

function Index() {
    return (
        <Router>
            <div className="App">
                <Header />
                <SampleSearch />
                <Switch>
                    <Route path="/" exact component={ FirstLevel }/>
                    <Route path="/SecondLevel/:name" component={SecondLevelDetails}/>
                    <Route path="/about" component={ About } />
                </Switch>
                <Footer />
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