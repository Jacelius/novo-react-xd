import React, { useState, Component } from 'react';
import 'regenerator-runtime';

import Footer from './Footer/Footer';
import DepartmentButton from './components/DepartmentButton';

class FirstLevel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            departmentTeams: []
        };
    }

    async componentDidMount() {
        let data = await fetch('https://localhost:5001/api/securitydeps');
        let json = await data.json(); 
        this.setState({ departmentTeams: json });
        console.log(this.state)
    };

    render() {
        return (
            <div className="department-view">
                {this.state.departmentTeams.map(departments => (
                    <DepartmentButton key={departments.name} 
                                      departmentName={departments.name}
                                      url={`./SecondLevel/${departments.name}`}                  
                    />
                ))}
                <Footer />
            </div>
        );
    }
}

export default FirstLevel;