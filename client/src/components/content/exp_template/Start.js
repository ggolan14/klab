import React from 'react';
import './gameStyles.css';
import PropTypes from "prop-types";
import {NewLogs} from "../../../actions/logger";
import {getTimeDate} from "../../../utils/app_utils";
import WaitForAction2 from "../../screens/waitForAction/wait_for_action2";

import {DebuggerModalView, KeyTableID} from "../../screens/gameHandle/game_handle";

const ThisExperiment = 'ReversibleMatrices';

let UserId = 'empty';
let RunningName = '-';
let StartTime = null;
// let GAME_POINTS = 0;
let DebugMode = null;

const ResetAll = () => {
    UserId = 'empty';
    RunningName = '-';
    StartTime = null;
    DebugMode = null;
}

class Messages extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            message: this.props.Message
        };

        this.Forward = this.props.Forward;
        this.Button = this.props.Button;

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.Message !== prevProps.Message) {
            this.setState({
                message: this.props.Message
            });

        }

    }

    render() {

        return (
            <div
                className='sp-message-mode'
            >
                {this.state.message}
                <button onClick={() => this.Forward()}>{this.Button}</button>
            </div>
        )
    }
}

class Start extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        ResetAll();

        UserId = props.user_id;
        RunningName = props.running_name;
        DebugMode = props.dmr;

        let RunCounter = KeyTableID();

        /*
            Props:
            SetLimitedTime,
            dmr,
            running_name: DB_RECORDS.KeyTable.RunningName,
            getTable,
            insertGameLine,
            sendGameDataToDB,
            insertTextInput,
            insertTaskGameLine,
            insertPayment,
            insertLineCustomTable,
            setWaitForAction: setWaitForAction,
            game_settings,
            more,
            isa,
            user_id: DB_RECORDS.UserDetails.UserId,
            callbackFunction
         */

        this.state = {
            tasks_index: 0,
            isa: props.isa,
            isLoading: true,
        };

        this.props.SetLimitedTime(false);

        this.Forward = this.Forward.bind(this);

    }

    componentDidMount(){
        NewLogs({
            user_id: UserId,
            exp: ThisExperiment,
            running_name: RunningName,
            action: 'G.L',
            type: 'LogGameType',
            more_params: {
                local_t: getTimeDate().time,
                local_d: getTimeDate().date,
            },
        }).then((res) => this.setState({isLoading: false}));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isa !== this.props.isa){
            let sc = this.state;
            sc.isa = this.props.isa;
            this.setState(sc);
        }
    }

    Forward(){
        let sc = this.state;
        if (sc.tasks_index === (this.game_template.length-1)){
            this.props.SetLimitedTime(false);
            this.setState(sc);
        }
        else {
            sc.tasks_index++;
            if (this.game_template[sc.tasks_index].Mode === 'Game')
                this.props.SetLimitedTime(true);
            else
                this.props.SetLimitedTime(false);
        }
        this.setState(sc);
    }

    render() {
        if (!this.state || this.state.isLoading) {
            return <WaitForAction2/>;
        }

        return (
            <div
                className=''
            >
            </div>
        );
    }
}

Start.propTypes = {
    game_settings: PropTypes.object,
};


export default Start;
