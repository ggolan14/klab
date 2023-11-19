import React from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import {setGameMode, setWaitForAction} from "../../../actions/app_actions";
import './ver_changes.css';
import {getMyExps, isValidExperiment} from "../../../utils/app_utils";
import {DropDown, toggleOpen} from "../dropdown/dropdown";
import {getExpVerChanges, addExpVerChanges} from "../../../actions/exp_actions";
import {setAlert} from "../../../actions/alert";
import {Header} from "../../layout/header/header";

let LOADING_TIMEOUT = null;
let RedirectBack;

class VerChanges extends React.Component {

    constructor(props) {
        super(props);
        this.elementRef = React.createRef();

        this.state = {
            auth: props.auth,
            isAuthenticated: props.isAuthenticated,
            isLoading: true,
            myExps: getMyExps(),
            exp_selected: undefined,
            experiment_list_dropdown: false,
            exp_version_changes: []
        };

        this.checkIfMounted = this.checkIfMounted.bind(this);
        this.isAuth = this.isAuth.bind(this);
        this.isExps = this.isExps.bind(this);
        this.select_drop_item = this.select_drop_item.bind(this);
        this.getExpChanges = this.getExpChanges.bind(this);
        this.onClickOnForm = this.onClickOnForm.bind(this);
    }

    getExpChanges(exp) {
        let _this = this;
        _this.props.setWaitForAction(true);
        getExpVerChanges({
            exp
        }).then(
            res => {
                let msg = '';
                let sc = _this.state;
                sc.isLoading = false;
                try {
                    if (res.data.msg !== 'NOT_FOUND'){
                        sc.exp_version_changes = res.data.exp_version_changes;
                        sc.exp_selected = exp;
                    }
                    else {
                        msg = 'Changes not founded for this experiment';
                    }
                }
                catch (e) {
                    msg = 'Some error was happened try later';
                }
                _this.setState(sc, () => {
                    _this.props.setWaitForAction(false);
                    if (msg)
                        _this.props.setAlert(msg, 'danger');
                });
            }
        )
    }

    select_drop_item(item, tag) {
        if (tag === 'EXP')
            this.getExpChanges(item);
    }

    checkIfMounted() {
        return this.elementRef.current != null;
    }

    isAuth(){
        let exp;

        try {
            exp = this.props.location.state.exp;
        }
        catch (e){
            exp = undefined;
        }

        RedirectBack = exp ? (exp + '/main') : '/';

        let sc = this.state;
        sc.isAuthenticated = this.props.isAuthenticated;
        sc.auth = this.props.auth;
        sc.authLoading = false;
        sc.exp_selected = exp;
        this.setState(sc);
    }

    isExps(){
        let sc = this.state;
        sc.allExperiments = this.props.allExperiments;
        sc.myExps = getMyExps();
        sc.expListLoading = false;
        this.setState(sc);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isAuthenticated !== this.props.isAuthenticated || prevProps.auth !== this.props.auth){
            this.isAuth();
        }
        if (prevProps.allExperiments !== this.props.allExperiments){
            this.isExps();
        }

        if (prevState.exp_selected !== this.state.exp_selected && this.state.exp_selected && this.props.isAuthenticated){
            this.getExpChanges(this.state.exp_selected);
        }
    }

    componentDidMount() {
        this.props.setGameMode(false);

        let _this = this;

        _this.props.setWaitForAction(true);

        if (this.props.isAuthenticated)
            this.isAuth();

        if (this.props.allExperiments)
            this.isExps();

        if (!this.props.isAuthenticated){
            let interval_counter = Date.now();
            LOADING_TIMEOUT = setInterval(() => {
                let elapsed_time = Date.now() - interval_counter;
                if (_this.props.isAuthenticated || elapsed_time > 500){
                    clearInterval(LOADING_TIMEOUT);
                    _this.props.setWaitForAction(false);
                    let is_still_mount = _this.checkIfMounted();
                    if (is_still_mount && this.props.isAuthenticated)
                        _this.setState({
                            isLoading: false
                        });
                }
            }, 100);
        }
        else {
            _this.setState({
                isLoading: false
            }, () => _this.props.setWaitForAction(false));
        }
    }

    onClickOnForm(e) {
        try {
            let tag = e.target.attributes.group.value;
            if (tag !== 'DROPDOWN_TAG')
                toggleOpen.bind(this)('ALL');
        }
        catch (e) {
            toggleOpen.bind(this)('ALL');
        }
    }

    render() {
        if (!this.state || this.state.isLoading || this.state.expListLoading || this.state.authLoading)
            return <div ref={this.elementRef}></div>;

        if (!this.state.isAuthenticated || !this.state.auth.user.permission.includes('Admin')) {
            return <Redirect to='/login'/>;
        }

        // if (!this.exp) {
        //     return <Redirect to='/not_found'/>;
        // }
        //
        // if (this.state.auth.user_permissions.experiments.indexOf(this.exp) < 0){
        //     return <Redirect to='/dashboard' />;
        // }

        return (
            <div
                className='admin-ver-changes-panel'
                ref={this.elementRef}
                onClick={this.onClickOnForm}
            >
                <Header
                    item_selected={this.state.exp_selected}
                    list_open={this.state.experiment_list_dropdown}
                    optionsList={this.state.myExps.sort()}
                    select_item={this.select_drop_item}
                    goBack={() => {
                        return this.props.history.push(RedirectBack);
                    }}
                    reference={this}
                />
            </div>
        );
    };
}

VerChanges.propTypes = {
    isAuthenticated: PropTypes.bool,
    setGameMode: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
    setWaitForAction: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    allExperiments: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    isAuthenticated: state.auth.isAuthenticated,
    allExperiments: state.app.allExperiments,
});

export default connect(mapStateToProps, {setGameMode, setWaitForAction, setAlert})(VerChanges);

/// ADD URL FOR NON ADMIN USERS
