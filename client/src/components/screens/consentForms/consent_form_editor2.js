import React from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import {setGameMode, setWaitForAction} from "../../../actions/app_actions";
import {getMyExps} from "../../../utils/app_utils";
import {setAlert} from "../../../actions/alert";
import {saveConsentForm, getConsentForm, getExpsList} from "../../../actions/exp_actions";
import './consent_form_editor.css';
import ClassicEditorElement from "../editor/classic_editor";
import ConsentForm from "./consent_form";
import {DropDown, toggleOpen} from "../dropdown/dropdown";

let RedirectBack;
let LOADING_TIMEOUT = null;

class ConsentFormEditor extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;

        this.elementRef = React.createRef();

        let exp = undefined;
        try {
            exp = this.props.location.state.exp;
        }
        catch (e){
        }

        RedirectBack = exp ? ('/' + exp + '/main') : '/';

        this.state = {
            auth: props.auth,
            isAuthenticated: props.isAuthenticated,
            isLoading: true,
            experiment_selected: exp,
            experiment_list_dropdown: false,
            copy_from: null,
            experiment_form_data: {
                consent_form: {
                    body: '',
                    radio_consent_text: '',
                    radio_not_consent_text: '',
                }
            },
            consent_preview: false,
            AllExperiments: []
        };

        this.select_experiment = this.select_experiment.bind(this);
        this.save_consent_form = this.save_consent_form.bind(this);
        this.buttonsOnClick = this.buttonsOnClick.bind(this);
        this.checkIfMounted = this.checkIfMounted.bind(this);
        this.userIsAuth = this.userIsAuth.bind(this);
        this.userNotAuth = this.userNotAuth.bind(this);
    }

    checkIfMounted() {
        return this.elementRef.current != null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isAuthenticated !== this.props.isAuthenticated || prevProps.auth !== this.props.auth){
            if (this.props.isAuthenticated){
                this.userIsAuth();
            }
        }
    }

    componentDidMount() {
        let _this = this;
        this.props.setGameMode(false);
        _this.props.setWaitForAction(true);
        window.history.pushState(null, null, document.URL);
        window.addEventListener('popstate', function () {
            window.history.pushState(null, null, document.URL);
        });

        if (this.state.isAuthenticated){
            this.userIsAuth();
        }
        else {
            this.userNotAuth();
        }
    }

    userIsAuth(){
        getExpsList().then(
            res => {
                let sc = this.state;
                sc.isLoading = false;
                sc.isAuthenticated = this.props.isAuthenticated;
                sc.auth = this.props.auth;
                sc.AllExperiments = res.data.exps_list;
                this.setState(sc, () => this.select_experiment(this.state.experiment_selected));
            }
        )
    }

    userNotAuth(){
        let _this = this;

        let interval_counter = 0;

        LOADING_TIMEOUT = setInterval(() => {
            interval_counter++;

            if (_this.props.isAuthenticated || interval_counter > 7){
                clearInterval(LOADING_TIMEOUT);
                _this.props.setWaitForAction(false);
                let is_still_mount = _this.checkIfMounted();
                if (is_still_mount){
                    _this.userIsAuth();
                }
            }
        }, 1000);
    }

    select_experiment(exp) {
        this.props.setWaitForAction(true);
        if (exp) return;

        getConsentForm(exp).then(
            res => {
                try {
                    let _this = this;
                    this.setState({
                        experiment_selected: res.data.consentForm.exp,
                        experiment_form_data: res.data.consentForm,
                        experiment_list_dropdown: false
                    }, () => _this.props.setWaitForAction(false));
                }
                catch (e) {
                    this.props.setWaitForAction(false)
                }
            }
        );
    }

    select_version(exp) {
        this.props.setWaitForAction(true);
        if (exp) return;

        getConsentForm(exp).then(
            res => {
                try {
                    let _this = this;
                    this.setState({
                        experiment_selected: res.data.consentForm.exp,
                        experiment_form_data: res.data.consentForm,
                        experiment_list_dropdown: false
                    }, () => _this.props.setWaitForAction(false));
                }
                catch (e) {
                    this.props.setWaitForAction(false)
                }
            }
        );
    }

    copyConsentFrom() {
        let _this = this;
        _this.props.setWaitForAction(true);
        getConsentForm(_this.state.copy_from).then(
            res => {
                try {
                    this.setState({
                        experiment_form_data: res.data.consentForm,
                    }, () => {
                        _this.props.setWaitForAction(false);
                        _this.props.setAlert('Copied!', 'success');
                    });
                }
                catch (e) {
                    _this.props.setWaitForAction(false);
                    _this.props.setAlert('Some Error happened, please try later', 'danger');
                }
            }
        );
    }

    save_consent_form(){
        let _this = this;

        _this.props.setWaitForAction(true);
        saveConsentForm({
            exp: _this.state.experiment_selected,
            consent_form: _this.state.experiment_form_data.consent_form,
            user_id: _this.state.auth.user.email
        }).then(
            res => {
                _this.props.setWaitForAction(false);
                _this.props.setAlert('Consent form was updated successfully', 'success');
            }
        )
    }

    buttonsOnClick = (option) => {
        let sc = this.state;
        if (option === 'Preview'){
            // setGameMode(true);
            sc.consent_preview = true;
        }
        else if (option === 'PreviewHide'){
            sc.consent_preview = false;
        }
        else if (option === 'GoBack'){
            return this.props.history.push(RedirectBack);
        }
        this.setState(sc, () => {
            if (option.includes('Preview')){
                this.props.setGameMode(option === 'Preview' ? true : false);
            }
        });
    }

    exp_options() {
        return (
            <div
                className='admin-consent_form-exp_options'
            >
                <DropDown
                    label='Experiment'
                    tag='EXP'
                    dropdown_item='experiment_list'
                    item_selected={this.state.experiment_selected}
                    list_open={this.state.experiment_list_dropdown}
                    optionsList={this.state.AllExperiments}
                    select_item={this.select_experiment}
                    reference={this}
                />

                <div
                    className='admin-consent_form-exp_options-btn'
                >
                    <button
                        disabled={!this.state.experiment_selected || this.state.auth.user_permissions.experiments.indexOf(this.state.experiment_selected) < 0}
                        className={'btn-save ' + (!this.state.experiment_selected || this.state.auth.user_permissions.experiments.indexOf(this.state.experiment_selected) < 0 ? 'disabledElem' : '')}
                        onClick={() => this.save_consent_form()}
                    >
                        Save
                    </button>
                    <button
                        disabled={!this.state.experiment_selected}
                        className={!this.state.experiment_selected ? 'disabledElem' : ''}
                        onClick={() => this.buttonsOnClick('Preview')}
                    >
                        Preview
                    </button>
                    <button onClick={() => this.buttonsOnClick('GoBack')}>Go back</button>
                </div>

                <div
                    className={'admin-consent_form-exp_options-copy ' + (!this.state.experiment_selected || this.state.auth.user_permissions.experiments.indexOf(this.state.experiment_selected) < 0 ? 'disabledElem' : '')}
                >
                    <label>Copy from:</label>
                    <select
                        onChange={(e) => this.setState({copy_from: e.target.value})}
                        value={this.state.copy_from || 'Select'}
                    >
                        <option disabled value='Select'>Select...</option>
                        {
                            this.state.AllExperiments.filter(
                                exp => exp !== this.state.experiment_selected
                            ).map(
                                exp => <option key={'copy-from-' + exp} value={exp}>{exp}</option>
                            )
                        }
                    </select>
                    <button
                        disabled={!this.state.copy_from || !this.state.experiment_selected || this.state.auth.user_permissions.experiments.indexOf(this.state.experiment_selected) < 0}
                        className={!this.state.copy_from || !this.state.experiment_selected || this.state.auth.user_permissions.experiments.indexOf(this.state.experiment_selected) < 0 ? 'disabledElem' : ''}
                        onClick={() => this.copyConsentFrom()}
                    >
                        Copy
                    </button>
                </div>
            </div>
        )
    }

    onChangeText = (part, value) => {
        let sc = this.state;
        sc.experiment_form_data.consent_form[part] = value;
        this.setState(sc);
    }

    consent_form_view_part1() {
        return (
            <div
                className='admin-consent_form-consent_form_view_part1'
            >
                <ClassicEditorElement
                    toolbar={['heading', '|', 'bold', 'italic', '|', 'bulletedList', 'numberedList', 'todoList', '|', 'blockQuote', 'link', '|', 'undo', 'redo']}
                    data={this.state.experiment_form_data.consent_form.body}
                    onChange={this.onChangeText}
                    part='body'
                    isReadOnly={this.state.auth.user_permissions.experiments.indexOf(this.state.experiment_selected) < 0}
                    disabled={this.state.auth.user_permissions.experiments.indexOf(this.state.experiment_selected) < 0}
                />
            </div>
        )
    }

    consent_form_view_part2() {
        return (
            <div
                className='admin-consent_form-consent_form_view_part2'
            >
                <label>First option:<b>Consent</b>,  Second options: <b>Not consent</b></label>
                <div>
                    <input
                        type="radio"
                        name='consent_form_editor_radio'
                    />
                    <ClassicEditorElement
                        toolbar={['bold', 'italic', '|', 'undo', 'redo']}
                        data={this.state.experiment_form_data.consent_form.radio_consent_text}
                        onChange={this.onChangeText}
                        part='radio_consent_text'
                        isReadOnly={this.state.auth.user_permissions.experiments.indexOf(this.state.experiment_selected) < 0}
                        disabled={this.state.auth.user_permissions.experiments.indexOf(this.state.experiment_selected) < 0}
                    />
                </div>
                <div>
                    <input
                        type="radio"
                        name='consent_form_editor_radio'
                    />
                    <ClassicEditorElement
                        toolbar={['bold', 'italic', '|', 'undo', 'redo']}
                        data={this.state.experiment_form_data.consent_form.radio_not_consent_text}
                        onChange={this.onChangeText}
                        part='radio_not_consent_text'
                        isReadOnly={this.state.auth.user_permissions.experiments.indexOf(this.state.experiment_selected) < 0}
                        disabled={this.state.auth.user_permissions.experiments.indexOf(this.state.experiment_selected) < 0}
                    />
                </div>
            </div>
        )
    }

    render() {
        if (!this.state || this.state.isLoading || !this.state.auth)
            return <div ref={this.elementRef}></div>;

        if (!this.state.isAuthenticated || !this.state.auth.user.permission.includes('Admin')) {
            return <Redirect to='/login'/>;
        }


        return (
            <>
                <div
                    className='admin-consent_form-panel'
                    ref={this.elementRef}
                    onClick={(e) => {
                        try {
                            let tag = e.target.attributes.group.value;
                            if (tag !== 'DROPDOWN_TAG')
                                toggleOpen.bind(this)('ALL');
                        }
                        catch (e) {
                            toggleOpen.bind(this)('ALL');
                        }
                    }}
                    style={{
                        display: this.state.consent_preview ? 'none' : 'grid'
                    }}
                >
                    <div
                        className={'admin-consent_form-panel_modified ' + (!this.state.experiment_form_data.date_modified ? 'hide-elem' : '') }
                    >
                        <label>Last modified:</label>
                        <label>{this.state.experiment_form_data.last_modified}</label>
                        <label>Date modified:</label>
                        <label>{this.state.experiment_form_data.date_modified}</label>
                    </div>
                    {this.exp_options()}
                    <div
                        className='admin-consent_form-panel-editor'
                    >
                        {/*{this.consent_form_view_part1()}*/}
                        {/*{this.consent_form_view_part2()}*/}
                    </div>
                </div>

                {
                    this.state.consent_preview && (
                        <ConsentForm
                            consent_form={this.state.experiment_form_data.consent_form}
                            callback={() => this.buttonsOnClick('PreviewHide')}
                            mode='DEMO'
                        />
                    )
                }
            </>
        );
    };
}

ConsentFormEditor.propTypes = {
    isAuthenticated: PropTypes.bool,
    setGameMode: PropTypes.func.isRequired,
    setWaitForAction: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {setGameMode, setWaitForAction, setAlert})(ConsentFormEditor);


