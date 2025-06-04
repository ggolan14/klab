import React from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {setGameMode, setWaitForAction} from "../../../actions/app_actions";
import {setAlert} from "../../../actions/alert";
import {saveConsentForm, getConsentForm, getExpsList, getExpVerList} from "../../../actions/exp_actions";
import './consent_form_editor.css';
import ClassicEditorElement from "../editor/classic_editor";
import ConsentForm from "./consent_form";
import {DropDown, toggleOpen} from "../dropdown/dropdown";
import {getRedirectBackUrl, preventPageGoBack, setCurrentExp} from "../../../utils/helpers";
import {Link} from "react-router-dom";

class ConsentFormEditor extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;

        let exp = undefined;
        try {
            exp = this.props.location.state.exp;
        }
        catch (e){
        }

        setCurrentExp(exp);

        this.state = {
            auth: props.auth,
            isAuthenticated: props.isAuthenticated,
            isLoading: true,
            experiment_selected: exp,
            version_selected: null,
            experiment_list_dropdown: false,
            copy_from_exp: null,
            copy_from_ver_list: [],
            copy_from_ver: null,
            isActiveConsentVersion: null,
            experiment_form_data: {
                consent_form: {
                    body: '',
                    radio_consent_text: '',
                    radio_not_consent_text: '',
                }
            },
            consent_preview: false,
            AllExperiments: [],
            exp_versions_list: []
        };

        this.select_experiment = this.select_experiment.bind(this);
        this.select_copy_experiment = this.select_copy_experiment.bind(this);
        this.select_version = this.select_version.bind(this);
        this.select_copy_version = this.select_copy_version.bind(this);
        this.save_consent_form = this.save_consent_form.bind(this);
        this.buttonsOnClick = this.buttonsOnClick.bind(this);
    }

    componentDidMount() {
        this.props.setGameMode(false);
        preventPageGoBack();

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

    select_copy_experiment(exp) {
        this.props.setWaitForAction(true);
        this.setState({
            copy_from_ver_list: [],
            copy_from_ver: null,
            // copy_from_exp: null
        }, () => {
            getExpVerList(exp).then(
                res => {
                    try {
                        this.setState({
                            copy_from_exp: exp,
                            copy_from_ver_list: res.data.exp_ver_list,
                        }, () => this.props.setWaitForAction(false));
                    }
                    catch (e) {
                        this.props.setWaitForAction(false)
                    }
                }
            );
        });
    }

    select_copy_version(version) {
        this.setState({
            copy_from_ver: version
        });
    }

    select_experiment(exp) {
        if (!exp) {
            this.props.setWaitForAction(false);
            return;
        }

        this.props.setWaitForAction(true);

        this.setState({
            version_selected: null,
            isActiveConsentVersion: null,
            experiment_form_data: {
                consent_form: {
                    body: '',
                    radio_consent_text: '',
                    radio_not_consent_text: '',
                }
            }
        }, () => {
            getExpVerList(exp).then(
                res => {
                    try {
                        this.setState({
                            experiment_selected: exp,
                            exp_versions_list: res.data.exp_ver_list,
                            experiment_list_dropdown: false,
                            version_selected: null,
                            isActiveConsentVersion: null,
                            experiment_form_data: {
                                consent_form: {
                                    body: '',
                                    radio_consent_text: '',
                                    radio_not_consent_text: '',
                                }
                            }
                        }, () => this.props.setWaitForAction(false));
                    }
                    catch (e) {
                        this.props.setWaitForAction(false)
                    }
                }
            );
        });
    }

    select_version(version) {
        this.props.setWaitForAction(true);

        getConsentForm({
            exp: this.state.experiment_selected,
            version
        }).then(
            res => {
                try {
                    if (res.data.error){
                        this.setState({
                            version_selected: null,
                            isActiveConsentVersion: null,
                            experiment_form_data: {
                                consent_form: {
                                    body: '',
                                    radio_consent_text: '',
                                    radio_not_consent_text: '',
                                }
                            }
                        }, () => {
                            this.props.setWaitForAction(false);
                            this.props.setAlert(res.data.error, 'danger');
                        });
                        return;
                    }
                    this.setState({
                        isActiveConsentVersion: res.data.consentForm.active,
                        version_selected: res.data.consentForm.version,
                        experiment_selected: res.data.consentForm.exp,
                        experiment_form_data: res.data.consentForm,
                        experiment_list_dropdown: false
                    }, () => this.props.setWaitForAction(false));
                }
                catch (e) {
                    this.props.setWaitForAction(false)
                }
            }
        );
    }

    copyConsentFrom() {
        this.props.setWaitForAction(true);
        getConsentForm({
            exp: this.state.copy_from_exp,
            version: this.state.copy_from_ver
        }).then(
            res => {
                try {
                    if (res.data.error){
                        this.props.setWaitForAction(false);
                        this.props.setAlert(res.data.error, 'danger');
                        return;
                    }

                    let sc = this.state;
                    sc.experiment_form_data.consent_form = res.data.consentForm.consent_form
                    this.setState(sc, () => {
                        this.props.setWaitForAction(false);
                        this.props.setAlert('Copied!', 'success');
                    });
                }
                catch (e) {
                    this.props.setWaitForAction(false);
                    this.props.setAlert('Some Error happened, please try later', 'danger');
                }
            }
        );
    }

    save_consent_form(){
        this.props.setWaitForAction(true);
        saveConsentForm({
            id: this.state.experiment_form_data._id,
            consent_form: this.state.experiment_form_data.consent_form,
            user_id: this.state.auth.user.email
        }).then(
            res => {
                if (res.data.error){
                    this.props.setWaitForAction(false);
                    this.props.setAlert(res.data.error, 'danger');
                    return;
                }
                this.setState({
                    experiment_form_data: res.data.consentForm,
                }, () => {
                    this.props.setWaitForAction(false);
                    this.props.setAlert('Consent form was updated successfully', 'success');
                });
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
                    className='admin-consent_form-exp_options-ver'
                    style={{
                        opacity: !this.state.experiment_selected ? 0.3 : 1
                    }}
                >
                    <label>Version</label>
                    <select
                        className={!this.state.experiment_selected ? 'disabledElem' : ''}
                        onChange={!this.state.experiment_selected ? () => {} : e => this.select_version(e.target.value)}
                        value={this.state.version_selected || 'Select'}
                    >
                        <option disabled value='Select'>Select...</option>
                        {
                            this.state.exp_versions_list.map(
                                ver => <option key={'select-ver-' + ver} value={ver}>{ver}</option>
                            )
                        }
                    </select>
                </div>

                <div
                    className='admin-consent_form-exp_options-btn'
                >
                    <button
                        disabled={!this.state.version_selected || this.state.auth.user.Experiments.indexOf(this.state.experiment_selected) < 0}
                        className={'btn-save ' + (!this.state.version_selected || this.state.auth.user.Experiments.indexOf(this.state.experiment_selected) < 0 ? 'disabledElem' : '')}
                        onClick={(!this.state.version_selected || this.state.auth.user.Experiments.indexOf(this.state.experiment_selected) < 0) ? () => {} : () => this.save_consent_form()}
                    >
                        Save
                    </button>
                    <button
                        disabled={!this.state.version_selected}
                        className={!this.state.version_selected ? 'disabledElem' : ''}
                        onClick={!this.state.version_selected ? () => {} : () => this.buttonsOnClick('Preview')}
                    >
                        Preview
                    </button>
                    <Link
                        {...getRedirectBackUrl()}
                    >
                        <button>Go back</button>
                    </Link>
                </div>

                <div
                    className={'admin-consent_form-exp_options-copy ' + (!this.state.version_selected || this.state.auth.user.Experiments.indexOf(this.state.experiment_selected) < 0 ? 'disabledElem' : '')}
                >
                    <label>Copy from:</label>
                    <select
                        onChange={(e) => this.select_copy_experiment(e.target.value)}
                        value={this.state.copy_from_exp || 'Select'}
                    >
                        <option disabled value='Select'>Select...</option>
                        {
                            this.state.AllExperiments.map(
                                exp => <option key={'copy-from-' + exp} value={exp}>{exp}</option>
                            )
                        }
                    </select>

                    <select
                        onChange={(e) => this.select_copy_version(e.target.value)}
                        value={this.state.copy_from_ver || 'Select'}
                    >
                        <option disabled value='Select'>Select...</option>
                        {
                            this.state.copy_from_ver_list.map(
                                ver => <option key={'copy-from-' + ver} value={ver}>{ver}</option>
                            )
                        }
                    </select>
                    <button
                        disabled={!this.state.copy_from_ver || !this.state.experiment_selected || this.state.auth.user.Experiments.indexOf(this.state.experiment_selected) < 0}
                        className={!this.state.copy_from_ver || !this.state.experiment_selected || this.state.auth.user.Experiments.indexOf(this.state.experiment_selected) < 0 ? 'disabledElem' : ''}
                        onClick={(!this.state.copy_from_ver || !this.state.experiment_selected || this.state.auth.user.Experiments.indexOf(this.state.experiment_selected) < 0) ? () => {} : () => this.copyConsentFrom()}
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
                style={{
                    opacity: !this.state.version_selected ? 0.3 : 1
                }}
            >
                <ClassicEditorElement
                    toolbar={['heading', '|', 'bold', 'italic', '|', 'bulletedList', 'numberedList', 'todoList', '|', 'blockQuote', 'link', '|', 'undo', 'redo']}
                    data={this.state.experiment_form_data.consent_form.body}
                    onChange={this.onChangeText}
                    part='body'
                    isReadOnly={!this.state.version_selected || this.state.auth.user.Experiments.indexOf(this.state.experiment_selected) < 0}
                    disabled={!this.state.version_selected || this.state.auth.user.Experiments.indexOf(this.state.experiment_selected) < 0}
                />
            </div>
        )
    }

    consent_form_view_part2() {
        return (
            <div
                className='admin-consent_form-consent_form_view_part2'
                style={{
                    opacity: !this.state.version_selected ? 0.3 : 1
                }}
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
                        isReadOnly={!this.state.version_selected || this.state.auth.user.Experiments.indexOf(this.state.experiment_selected) < 0}
                        disabled={!this.state.version_selected || this.state.auth.user.Experiments.indexOf(this.state.experiment_selected) < 0}
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
                        isReadOnly={!this.state.version_selected || this.state.auth.user.Experiments.indexOf(this.state.experiment_selected) < 0}
                        disabled={!this.state.version_selected || this.state.auth.user.Experiments.indexOf(this.state.experiment_selected) < 0}
                    />
                </div>
            </div>
        )
    }

    render() {
        return (
            <>
                <div
                    className='admin-consent_form-panel'
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
                        {this.consent_form_view_part1()}
                        {this.consent_form_view_part2()}
                    </div>
                </div>

                {
                    this.state.isActiveConsentVersion !== null && (
                        <div
                            className='isActiveConsentVersion'
                            style={{
                                display: this.state.consent_preview ? 'none' : 'grid'
                            }}
                        >
                            <label>Consent form is active in this version: <span>{this.state.isActiveConsentVersion}</span></label>
                        </div>
                    )
                }

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


