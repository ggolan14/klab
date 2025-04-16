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
        return <Experiment />;
    }


}

export default Start;
