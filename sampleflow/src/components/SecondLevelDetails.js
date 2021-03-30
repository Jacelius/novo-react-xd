import React, { Component } from 'react';
import 'regenerator-runtime';

import TeamButton from './components/TeamButton';

class SecondLevelDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            team : []
        }
    }

    async componentDidMount() {
        let data = await fetch(`https://localhost:5001/api/securitydeps/${this.props.match.params.name}`);
        let json = await data.json(); 
        this.setState({ team: json.teams });
        console.log(this.state);
    }

    render() {
        return(
            <div className="teams">
                {this.state.team.map(teams => (
                    <TeamButton key={teams.teamId}
                                teamName={teams.teamId}
                                methods={teams.methods.length}
                    />
                ))}
            </div>
        );
    }
}

export default SecondLevelDetails;