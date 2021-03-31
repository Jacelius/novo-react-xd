import React, { Component } from 'react';
import 'regenerator-runtime';
import LineTo, { Line } from 'react-lineto';
import SteppedLineTo from 'react-lineto';

import Footer from './Footer/Footer';
import TeamButton from './components/TeamButton';
import DepartmentButton from './components/DepartmentButton';
import AnchorPoint from './components/AnchorPoint';

export default class SecondLevelDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            team : [],
            anchors: []
        }
    }

    async componentDidMount() {
        //Fetch data from API with specific team
        let data = await fetch(`https://localhost:5001/api/securitydeps/${this.props.match.params.name}`);
        let json = await data.json(); 
        this.setState({ team: json.teams });
        // Adds anchor tags for when we need to draw lines
        await this.setState({ anchors : [this.state.team.map(teams => 
                `anchor.${teams.teamId}`
            )]
        })
        console.log(this.state);
    }

    render() {        
        return(
            <div className="component-teamsview">
                <div className="team-method-components">
                    {
                        this.state.team.map(teams => (
                            <div className={teams.teamId}>
                            <TeamButton key={teams.teamId}
                                        teamName={teams.teamId}
                                        url={`/thirdLevel/${teams.teamId}`}
                                        methods={teams.methods.length}
                            />
                            {/* IMPORTANT THAT THE NAME CORRESPONDS TO THE ANCHOR ON LINE 27 */}
                            <AnchorPoint anchorName={`anchor.${teams.teamId}`}/>
                            </div>
                        ))
                    }
                </div>
                <div className="department-main">
                    <div className="a"><AnchorPoint /></div>
                    <div className="dp"><DepartmentButton departmentName={this.props.match.params.name}/></div>
                    
                </div>
                
                <div className="anchor-lines">
                    {/* Draws line from department to first anchor */}
                    <LineTo from="a"
                            to="dp"
                            fromAnchor="75% 0%"
                            borderColor="rgb(0,25,101)"
                            borderWidth={2}
                            zIndex={0}
                            // delay={1}
                    />
                    {/* Draws line from each team method to the department anchor */}
                    {
                        this.state.anchors.map(anchor => (
                            anchor.map(item => (
                            <LineTo from="a"
                                    to={item.toString()}
                                    fromAnchor="left"
                                    toAnchor="25% 25%"
                                    borderColor="rgb(0,25,101)"
                                    borderWidth={2}
                                    // delay={1}
                            />  
                            ))
                        ))
                    }
                </div>

                <Footer department={'/ ' + this.props.match.params.name}/>
            </div>
            
        );
    }
}