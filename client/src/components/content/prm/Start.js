import Experiment from "./components/Experiment";
import React, {Component} from 'react';

const ThisExperiment = 'Prm';

class Start extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return <Experiment insertToDbArray={this.props.insertGameLine} sendToDB={this.props.sendGameDataToDB}/>;
    }


}

export default Start;
