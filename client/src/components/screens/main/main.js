import React from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {Link, Navigate} from "react-router-dom";
import {setGameMode, setWaitForAction} from "../../../actions/app_actions";
import {
    GetExperimentLabel,
    getExperimentPaths,
    getPathLabel,
    getPathLocation
} from "../../../data/experiments";
import {getActiveSettings} from "../../../actions/exp_actions";
import './main.css';
import {copyToClipboard} from "../../../utils/app_utils";
import {DropDown, toggleOpen} from "../dropdown/dropdown";
import {setCurrentExp} from "../../../utils/helpers";
import {CURRENT_URL} from "../../../utils/current_url";

const LinkItem = ({exp, item}) => {

    let disable_link = ['exp_messages_pathname', 'changes_pathname'].indexOf(item) > -1;

    return (
        <Link
            className={` button-option  ${(disable_link ? ' button-option-disabled' : 'drop-shadow-lg')}`}
            style={{height: '90px'}}
            to={disable_link ? '' : getPathLocation(exp, item)}
            state={{exp}}
        >
            <h2 style={{fontSize:"15px"}}
                className={"font-exo text-black text-uppercase text-truncate"}>
                {getPathLabel(item)}
            </h2>
        </Link>
    )
}

class Main extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;

        this.props.setGameMode(false);

        try {
            this.exp = this.props.location.state.exp;
        } catch (e) {
            this.exp = undefined;
        }

        setCurrentExp(this.exp);

        this.state = {
            auth: props.auth,
            active_settings: null,
            authLoading: true,
            activeSettingsLoading: true,
            debuggerMode: localStorage.getItem(this.exp + '_debugger_mode') === 'true',
            AllExperiments: props.auth && props.auth.user ? props.auth.user.Experiments : [],
            exp_paths: getExperimentPaths(this.exp),
            experiment_list_dropdown: false,
            experiment_selected: this.exp,
        };

        this.getExpActiveSettings = this.getExpActiveSettings.bind(this);
        this.select_experiment = this.select_experiment.bind(this);
    }

    select_experiment(exp) {
        setCurrentExp(exp);
        let sc = this.state;
        this.exp = exp;
        sc.exp_paths = getExperimentPaths(exp);
        sc.experiment_selected = exp;
        sc.debuggerMode = localStorage.getItem(exp + '_debugger_mode') === 'true';
        this.setState(sc, () => this.getExpActiveSettings());
        // return this.props.history.push(redirect);
    }

    componentDidMount() {
        this.getExpActiveSettings();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.location.pathname !== this.props.location.pathname) {
            let sc = this.state;
            this.exp = this.props.match.params.exp
            sc.experiment_selected = this.props.match.params.exp;
            sc.experiment_list_dropdown = false;
            this.setState(sc, () => {
                this.getExpActiveSettings();
                window.history.pushState(null, null, document.URL);
                window.defaultPrevented = false;
                window.onpopstate = function (e) {
                    e.preventDefault();
                    window.history.go(1);
                }
                // window.addEventListener('popstate', function (e) {
                //     // e.defaultPrevented = true;
                //     window.history.pushState(null, null, document.URL);
                // });
            });
        }
    }

    getExpActiveSettings() {
        this.props.setWaitForAction(true);
        getActiveSettings({exp: this.exp}).then(
            res => {
                if (res.error)
                    return this.props.setWaitForAction(false);

                let sc = this.state;
                sc.activeSettingsLoading = false;
                try {
                    sc.active_settings = res.data;
                    sc.exp_paths = getExperimentPaths(this.exp);
                } catch (e) {
                    sc.active_settings = null;
                }
                this.setState(sc, () => this.props.setWaitForAction(false));

            }
        );
    }

    debuggerItem() {
        const debugger_mode = (checked) => {

            if (checked)
                localStorage.setItem(this.exp + '_debugger_mode', true);
            else
                localStorage.removeItem(this.exp + '_debugger_mode');

            this.setState({
                debuggerMode: checked
            });
        };

        return (
            <div
                className='admin-main-panel-d-i'
            >
                <label>
                    <input
                        type="checkbox"
                        name='debugger_mode'
                        onChange={e => {
                            debugger_mode(e.target.checked);
                        }}
                        className='debugger-chk'
                        checked={this.state.debuggerMode}
                    />
                    <span className={"font-exo"}>Debugger mode</span>
                </label>

                <div
                    className='admin-tooltip-btn'
                >
                    <label>Helps to data analysis</label>
                </div>
            </div>
        )
    }

    expDetails() {
        return (
            <div
                className='admin-main-panel-e-d'
            >
                <label>Current version:</label>
                <label>{(this.state.active_settings) ? this.state.active_settings.version : '-'}</label>
                <label>Current running:</label>
                <label>{(this.state.active_settings) ? this.state.active_settings.running_name : '-'}</label>
            </div>
        )
    }

    btnOptions() {
        return (
            <div
                className='buttons-grid'
            >
                {
                    this.state.exp_paths && Object.keys(this.state.exp_paths).map(
                        item => !item.includes('main') && (
                            <LinkItem
                                exp={this.exp}
                                key={item}
                                item={item}
                                // ready={this.state.status === 'READY'}
                                ready={true}
                            />
                        )
                    )
                }
            </div>
        )
    }

    render() {
        if (this.state.AllExperiments.indexOf(this.exp) < 0) {
            return <Navigate to='/not_found'/>;
        }

        const exp_label = CURRENT_URL() + '/' + GetExperimentLabel(this.exp);

        return (

            <div
                style={{backgroundColor: "#CEDFF6"}}
                className='w-full h-full flex justify-center items-center'
            >
                <div
                    className={"w-[80%] rounded-3xl overflow-hidden bg-white drop-shadow-xl flex flex-col"}
                    style={{height: "80dvh"}}
                    onClick={(e) => {
                        try {
                            let tag = e.target.attributes.group.value;
                            if (tag !== 'DROPDOWN_TAG')
                                toggleOpen.bind(this)('ALL');
                        } catch (e) {
                            toggleOpen.bind(this)('ALL');
                        }
                    }}
                >
                    <div className={"w-full border-light-gray border-b flex justify-between items-center"}
                         style={{height: "15%", padding: "0px 30px"}}>
                        <h1 className={"font-exo text-clamping-lg m-0"}>{this.exp} Task</h1>
                        <div className={"flex flex-col h-full items-start justify-center gap-3"}>
                            <div className={"flex flex-row gap-4"}>
                                <h2 className={"font-exo text-uppercase text-clamping-sm"}>
                                    <span
                                        className={"font-exo text-uppercase text-clamping-sm opacity-50"}>version:</span> {(this.state.active_settings) ? this.state.active_settings.version : '-'}
                                </h2>
                                <h2 className={"font-exo text-uppercase text-clamping-sm"}>
                                    <span
                                        className={"font-exo text-uppercase text-clamping-sm opacity-50"}>Running:</span> {(this.state.active_settings) ? this.state.active_settings.running_name : '-'}
                                </h2>
                            </div>
                            <h2 className={"font-exo gradient-text cursor-pointer text-uppercase text-clamping-sm text-black-50"}
                                onClick={() => copyToClipboard(exp_label)}>
                                <span
                                    className={"font-exo text-uppercase text-clamping-sm opacity-50"}>Experiment url:</span> {exp_label}
                            </h2>
                        </div>
                    </div>

                    <div className={"w-full flex flex-row "} style={{height: "85%"}}>
                        <div className={"border-r p-4 border-light-gray h-full overflow-y-scroll"} style={{width: "80%"}}>
                            {this.btnOptions()}

                        </div>
                        <div
                            className={"p-3"}
                            style={{width: "20%"}}
                        >
                            {this.debuggerItem()}
                        </div>
                    </div>

                </div>
            </div>
        );
    };
}

Main.propTypes = {
    isAuthenticated: PropTypes.bool,
    setGameMode: PropTypes.func.isRequired,
    setWaitForAction: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {setGameMode, setWaitForAction})(Main);

/// ADD URL FOR NON ADMIN USERS
