import React from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {setGameMode, setWaitForAction} from "../../../actions/app_actions";
import {DropDown, toggleOpen} from "../dropdown/dropdown";
import './settings.css';
import './styles/wp_settings.css';
import './styles/meta_sampling.css';
import {setAlert} from "../../../actions/alert";
import { GiSave } from 'react-icons/gi';
import { IoDuplicate, IoNewspaper } from 'react-icons/io5';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import PromptMessage from "../promptMessage/PromptMessage";
import loadExpSetting from "./loadExpSetting";
import {Counters} from "./counters";
import {
    addNewRunning, deleteSettings, getVersion, getSpecificSettings, modifyCounter,
    newSettings, saveActiveSettings, saveSettings
} from "../../../actions/exp_actions";
import {DivContainer} from "./elements_builder";
import {Header} from "../../layout/header/header";
import {getCurrentExp, preventPageGoBack, setCurrentExp} from "../../../utils/helpers";

/* utils */
function promptMessages(children_type, action_on){
    if (children_type === 'BEFORE_DELETE')
        return (
            <label
                style={{
                    textAlign: 'center',
                    fontSize: 'x-large'
                }}
            >
                Are you sure you want to
                <span style={{color: 'red', marginLeft: 5, marginRight: 5}}>delete</span>
                <span style={{fontWeight: 'bold', color: 'darkblue', marginLeft: 5, marginRight: 5}}>{action_on}</span>
                ?
            </label>
        )
};
function getExpVersions(_this, exp) {
    _this.props.setWaitForAction(true);
    _this.setState({isLoading: true, game_settings: null}, () => {
        getVersion(exp).then(
            res => {
                try {
                    if (res.data.error)
                        throw res.data.error;
                    LAST_SETTING_NAME = res.data.version.version;
                    _this.setState({
                        isLoading: false,
                        game_settings: res.data.version,
                        active_settings: res.data.active_settings,
                        counters: res.data.counters,
                        version_selected: res.data.version.version,
                        versions_list: res.data.more.versions_list,
                        exp_more_settings: res.data.more,
                        exp_selected: exp,
                    }, () => {
                        _this.props.setWaitForAction(false);
                    });
                }
                catch (e) {
                    _this.setState({
                        error: e === 'NOT_SETTINGS' ? 'Experiment in development' : 'None experiment selected',
                        isLoading: false,
                        exp_selected: exp,
                        game_settings: null,
                        counters: [],
                        active_settings: null,
                        version_selected: null,
                        versions_list: null,
                        exp_more_settings: null,
                    }, () => _this.props.setWaitForAction(false));
                }

            }
        )
    });
}
function getSpecificSettingsAction(_this, version) {
    _this.props.setWaitForAction(true);
    _this.setState({isLoading: true, game_settings: null}, () => {
        getSpecificSettings({exp: _this.state.exp_selected, version}).then(
            res => {
                try {
                    LAST_SETTING_NAME = res.data.version.version;
                    _this.setState({
                        isLoading: false,
                        game_settings: res.data.version,
                        version_selected: res.data.version.version,
                    }, () => {
                        _this.props.setWaitForAction(false);
                    });
                }
                catch (e) {
                    _this.setState({
                        isLoading: false,
                    }, () => _this.props.setWaitForAction(false));
                }

            }
        )
    });
}
function saveNewActiveSettings(_this) {
    _this.props.setWaitForAction(true);
    _this.setState({isLoading: true}, () => {
        saveActiveSettings({
            user_id: _this.state.auth.user.email, active_settings: _this.state.active_settings
        }).then(
            res => {
                try {
                    let state_ = {
                        isLoading: false,
                    };
                    let alert;
                    if (!res.data.error) {
                        state_.active_settings = res.data.active_settings;
                        alert = {
                            message: 'Active settings was updated successfully',
                            type: 'success'
                        }
                    }
                    else {
                        alert = {
                            message: res.data.error,
                            type: 'danger'
                        }
                    }
                    _this.setState(state_, () => {
                        _this.props.setWaitForAction(false);
                        _this.props.setAlert(alert.message, alert.type);
                    });
                }
                catch (e) {
                    _this.setState({
                        isLoading: false,
                    }, () => {
                        _this.props.setWaitForAction(false);
                        _this.props.setAlert('Some error happened, please try later', 'danger')
                    });
                }
                // Already exist
            }
        )
    });
}
function addNewCounter(_this, new_counter) {
    _this.props.setWaitForAction(true);
    _this.setState({isLoading: true}, () => {
        addNewRunning({
            exp: _this.state.exp_selected,
            running_name: new_counter
        }).then(
            res => {
                try {
                    let counters = res.data.counters;
                    if (res.data.error){
                        _this.setState({
                            isLoading: false,
                        }, () => {
                            _this.props.setWaitForAction(false);
                            _this.props.setAlert(res.data.error, 'danger');
                        });
                    }
                    else {
                        _this.setState({
                            isLoading: false,
                            counters
                        }, () => {
                            _this.props.setWaitForAction(false);
                            _this.props.setAlert('Added successfully', 'success')
                        });
                    }
                }
                catch (e) {
                    _this.setState({
                        isLoading: false,
                    }, () => {
                        _this.props.setWaitForAction(false);
                        _this.props.setAlert('Some error happened, please try later', 'danger')
                    });
                }
                // Already exist
            }
        )
    })
}
function saveSettingsChanges(_this) {
    _this.props.setWaitForAction(true);
    _this.setState({isLoading: true}, () => {
        saveSettings({
            exp: _this.state.exp_selected,
            version: _this.state.game_settings,
            user_id: _this.state.auth.user.email,
            version_before: LAST_SETTING_NAME
        }).then(
            res => {
                try {
                    let sc = _this.state;
                    sc.isLoading = false;
                    if (res.data.msg === 'SUCCESS') {
                        LAST_SETTING_NAME = res.data.version.version;
                        sc.versions_list = res.data.versions_list;
                        sc.game_settings = res.data.version;
                        sc.version_selected = res.data.version.version;
                        sc.active_settings = res.data.active_settings;
                    }
                    _this.setState(sc, () => {
                        _this.props.setWaitForAction(false);
                        if (res.data.msg === 'SUCCESS')
                            _this.props.setAlert('Version saved successfully', 'success');
                        else if (res.data.error === 'NOT_FOUND')
                            _this.props.setAlert('Version not found', 'danger');
                        else if (res.data.error === 'ALREADY_EXIST')
                            _this.props.setAlert('Version exist', 'danger');
                        else if (res.data.error === 'CANNOT_RENAME')
                            _this.props.setAlert('Version cannot be renamed', 'danger');
                    });
                }
                catch (e) {
                    _this.setState({
                        isLoading: false,
                    }, () => {
                        _this.props.setWaitForAction(false);
                        _this.props.setAlert('Some error happened, please try later', 'danger')
                    });
                }
            }
        )
    })
}
function deleteSettingsAction(_this) {
    _this.props.setWaitForAction(true);
    _this.setState({isLoading: true}, () => {
        deleteSettings({
            exp: _this.state.exp_selected,
            version: _this.state.version_selected,
            user_id: _this.state.auth.user.email,
        }).then(
            res => {
                try {
                    if (res.data.error){
                        _this.setState({
                            isLoading: false,
                        }, () => {
                            _this.props.setWaitForAction(false);
                            _this.props.setAlert(res.data.error, 'danger');
                        });
                        return;
                    }
                    LAST_SETTING_NAME = null;
                    _this.setState({
                        isLoading: false,
                        versions_list: res.data.versions_list,
                        active_settings: res.data.active_settings,
                        version_selected: null,
                    }, () => {
                        _this.props.setWaitForAction(false);
                        if (res.data.msg === 'SUCCESS')
                            _this.props.setAlert('Settings removed successfully', 'success');
                    });
                }
                catch (e) {
                    _this.setState({
                        isLoading: false,
                    }, () => {
                        _this.props.setWaitForAction(false);
                        _this.props.setAlert('Some error happened, please try later', 'danger')
                    });
                }
            }
        )
    })
}
function createNewSettings(_this, action) {
    _this.props.setWaitForAction(true);
    _this.setState({isLoading: true, game_settings: null}, () => {
        newSettings({
            exp: _this.state.exp_selected,
            user_id: _this.state.auth.user.email,
            action,
            version: _this.state.version_selected,
        }).then(
            res => {
                try {
                    LAST_SETTING_NAME = res.data.new_version.version;
                    _this.setState({
                        isLoading: false,
                        // ADDED
                        game_settings: res.data.new_version,
                        version_selected: res.data.new_version.version,
                        versions_list: res.data.versions_list,
                    }, () => {
                        _this.props.setWaitForAction(false);
                        let msg = res.data.msg === 'ADDED' ? 'New settings added' : 'New settings not added';
                        let type = res.data.msg === 'ADDED' ? 'success' : 'danger';
                        _this.props.setAlert(msg, type);
                    });
                }
                catch (e) {
                    _this.setState({
                        isLoading: false,
                    }, () => {
                        _this.props.setWaitForAction(false);
                        _this.props.setAlert('Some error happened, please try later', 'danger')
                    });
                }

            }
        )
    });
}
function modifyRunningCounterAction(_this, running_name, action){
    _this.props.setWaitForAction(true);
    _this.setState({isLoading: true}, () => {
        modifyCounter({
            exp: _this.state.exp_selected,
            running_name,
            action,
            user_id: _this.state.auth.user.email
        }).then(
            res => {
                try {
                    if (res.error){
                        _this.setState({
                            isLoading: false,
                        }, () => {
                            _this.props.setWaitForAction(false);
                            _this.props.setAlert(res.error, 'danger');
                        });
                        return;
                    }

                    _this.setState({
                        isLoading: false,
                        counters: res.counters,
                        active_settings: res.active_settings,
                    }, () => {
                        _this.props.setWaitForAction(false);
                        if (res.msg === 'RESET_SUCCESS')
                            _this.props.setAlert('Counter reset successfully', 'success');
                        else if (res.msg === 'DEL_SUCCESS')
                            _this.props.setAlert('Counter removed successfully', 'success');
                    });
                }
                catch (e) {
                    _this.setState({
                        isLoading: false,
                    }, () => {
                        _this.props.setWaitForAction(false);
                        _this.props.setAlert('Some error happened, please try later', 'danger')
                    });
                }
                // Already exist
            }
        )
    });
}
/* utils */


/* common */
const RunningSettings = ({_this}) => {
    const body_elements = [
        {
            type: 'Select',
            label: 'Active version:',
            show: true,
            options: _this.state.versions_list,
            value: _this.state.active_settings.version,
            callback: value => _this.changeSettings({
                settings_of: 'active_settings',
                key: 'version',
                key2: null,
                value,
            })
        },
        // {
        //     type: 'Select',
        //     label: 'Current mode:',
        //     show: true,
        //     options: ['Test', 'Real'],
        //     disabled: !_this.state.auth.user.permission.includes('SuperAdmin'),
        //     value: _this.state.active_settings.mode,
        //     callback: value => _this.changeSettings({
        //             settings_of: 'active_settings',
        //             key: 'mode',
        //             key2: null,
        //             value,
        //         })
        // },
        {
            type: 'Select',
            label: 'Running name:',
            show: true,
            options: _this.state.counters.map(counter => counter.running_name),
            value: _this.state.active_settings.running_name,
            callback: value => _this.changeSettings( {
                settings_of: 'active_settings',
                key: 'running_name',
                key2: null,
                value,
            })
        },
    ];

    const header_elements = [
        {
            type: 'Label',
            label: 'Experiment running settings:',
        },
        {
            type: 'Button',
            class_name: 'btn-save',
            label: 'Update',
            show: true,
            callback: () => saveNewActiveSettings(_this)
        }
    ];

    const modified_info = [
        {
            type: 'Label',
            label: 'Last modified:',
            show: true,
            class_name_b: 'settings-modified-lbl',
            second_label: _this.state.active_settings.last_modified
        },
        {
            type: 'Label',
            label: 'Date modified:',
            show: true,
            class_name_b: 'settings-modified-lbl',
            second_label: _this.state.active_settings.date_modified
        },
    ];

    return (
        <DivContainer
            className='admin-settings-section admin-settings-section-raw'
        >
            <DivContainer
                className='admin-settings-section-col admin-settings-section-h'
                elements={header_elements}
            />
            <DivContainer
                className='admin-settings-section-raw admin-settings-section-b'
                elements={body_elements}
            />

            <DivContainer
                className='admin-settings-section-raw admin-settings-section-modified_info admin-settings-section-b'
                elements={modified_info}
            />
        </DivContainer>
    )
}
/* common */

/* Global vars */
let LAST_SETTING_NAME = null;
/* Global vars */

const NonExpElements = ({error}) => {
    return (
        <div
            className='admin-settings-group'
        >
            <label>{error}</label>
        </div>
    )
};

const SettingButtons = ({_this,}) => {
    return (
        <div
            className='admin-settings-action-buttons'
        >
            <div>
                <IoNewspaper
                    className="admin-settings-action-btn"
                    onClick={() => createNewSettings(_this, 'NEW')}
                />
                <div
                    className='admin-tooltip-btn'
                >
                    <label>New settings</label>
                </div>
            </div>
            <div>
                <GiSave
                    className={"admin-settings-action-btn " + ((!_this.state.version_selected || (_this.state.game_settings.version !== LAST_SETTING_NAME && _this.state.versions_list.indexOf(_this.state.game_settings.version) > -1)) ? 'disabledElem' : '')}
                    onClick={((!_this.state.version_selected || (_this.state.game_settings.version !== LAST_SETTING_NAME && _this.state.versions_list.indexOf(_this.state.game_settings.version) > -1)) ? () => {} : () => saveSettingsChanges(_this))}
                />
                <div
                    className='admin-tooltip-btn'
                >
                    <label>Save version</label>
                </div>
            </div>
            <div>
                <IoDuplicate
                    className={"admin-settings-action-btn " + (!_this.state.version_selected ? 'disabledElem' : '')}
                    onClick={(!_this.state.version_selected ? () => {} : () => createNewSettings(_this, 'DUPLICATE'))}
                />
                <div
                    className='admin-tooltip-btn'
                >
                    <label>Duplicate settings</label>
                </div>
            </div>
            <div>
                <RiDeleteBin5Fill
                    className={"admin-settings-action-btn " + (!_this.state.version_selected || _this.state.version_selected === 'test' ? 'disabledElem' : '')}
                    onClick={((!_this.state.version_selected || _this.state.version_selected === 'test') ? () => {} : () => _this.deleteSettings())}
                />
                <div
                    className='admin-tooltip-btn'
                >
                    <label>Delete settings</label>
                </div>
            </div>
        </div>
    )
};

const SettingsBody = ({_this, changeSettings}) => {
    console.log("--->  in SettingsBody=",changeSettings)
    try {
        return (
            <>
                <RunningSettings _this={_this}/>

                <Counters
                    counters={_this.state.counters}
                    addNewCounter={new_counter => addNewCounter(_this, new_counter)}
                    modifyRunningCounter={_this.modifyRunningCounter}
                />

                <div
                    className='admin-settings-options'
                >
                    <DropDown
                        label='Versions'
                        tag='SETTING'
                        dropdown_item='versions_list'
                        item_selected={_this.state.version_selected}
                        list_open={_this.state.versions_list_dropdown}
                        optionsList={_this.state.versions_list}
                        select_item={_this.select_drop_item}
                        reference={_this}
                    />

                    <SettingButtons _this={_this}/>

                </div>

                {_this.state.version_selected && _this.state.exp_selected && loadExpSetting({
                    exp: _this.state.exp_selected,
                })({
                    exp: _this.state.exp_selected,
                    game_settings: _this.state.game_settings,
                    changeSettings,
                    versions_list: _this.state.versions_list,
                    exp_more_settings: _this.state.exp_more_settings,
                    LAST_SETTING_NAME,
                })
                }
            </>
        )
    }
    catch (e) {
        console.log(e)
        return <label>Some error happened</label>
    }
};

export const convertPointsRatio = (sign_of_reward, exchange_ratio) => {
    return (
        <>
            <span style={{marginLeft: '1rem'}}></span>
            {sign_of_reward}<span style={{color: 'blueviolet'}}>1</span>
            =
            <span style={{color: 'blueviolet'}}>{exchange_ratio}</span>
            <span style={{marginLeft: '0.3rem'}}>{exchange_ratio !== 1 ? 'points' : 'point'}</span>
            <span style={{marginLeft: '1.5rem'}}></span>
            <span style={{color: 'blueviolet'}}>1</span> point
            =
            {sign_of_reward}
            <span style={{color: 'blueviolet'}}>{exchange_ratio === 0 ? 0 : (Math.floor((1/exchange_ratio)*1000))/1000}</span>
        </>
    )
};

class Settings extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;

        let exp = undefined;
        try {
            exp = this.props.location.state.exp;
        }
        catch (e){
        }

        if (!exp) {
            const local_s = getCurrentExp();
            if (local_s)
                exp = local_s;
        }

        // exp = 'NoCupsGame';

        setCurrentExp(exp);

        let AllExperiments;
        try {
            AllExperiments = this.props.auth.user.Experiments;
        }
        catch (e) {
            AllExperiments = [];
        }

        this.state = {
            auth: props.auth,
            error: 'None experiment selected',
            isAuthenticated: props.isAuthenticated,
            game_settings: null,
            counters: [],
            active_settings: null,
            exp_selected: exp,
            experiment_list_dropdown: false,
            version_selected: null,
            versions_list: null,
            exp_more_settings: null,
            versions_list_dropdown: false,
            prompt_message: {
                show: false,
                messageType: null,
                children_type: null,
                buttons: [],
                action_on: null,
                action: null,
            },
            AllExperiments,
        };

        this.select_drop_item = this.select_drop_item.bind(this);
        this.onClickOnForm = this.onClickOnForm.bind(this);
        this.changeSettings = this.changeSettings.bind(this);
        this.modifyRunningCounter = this.modifyRunningCounter.bind(this);
        this.promptCallback = this.promptCallback.bind(this);
        this.deleteSettings = this.deleteSettings.bind(this);
    }

    componentDidMount() {
        this.props.setGameMode(false);
        preventPageGoBack();
        if (this.state.exp_selected)
            getExpVersions(this, this.state.exp_selected);
    }

    changeSettings(settings){
        let sc = this.state;

        if (Array.isArray(settings)){
            for (let i=0; i<settings.length; i++){
                const {settings_of, key, key2, value} = settings[i];

                if (key2) {
                    if (sc[settings_of][key] === undefined)
                        sc[settings_of][key] = {};
                    sc[settings_of][key][key2] = value;
                }
                else
                    sc[settings_of][key] = value;
            }

        }
        else {
            const {settings_of, key, key2, value} = settings;

            if (key2) {
                if (sc[settings_of][key] === undefined)
                    sc[settings_of][key] = {};
                sc[settings_of][key][key2] = value;
            }            else
                sc[settings_of][key] = value;

        }

        this.setState(sc);
    }

    select_drop_item(item, tag) {
        if (tag === 'EXP') {
            setCurrentExp(item);
            getExpVersions(this, item);
        }
        else if (tag === 'SETTING')
            getSpecificSettingsAction(this, item);
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

    modifyRunningCounter(running_name, action) {

        if (action === 'remove'){
            let sc = this.state;
            sc.prompt_message.show = true;
            sc.prompt_message.messageType =  'danger';
            sc.prompt_message.children_type =  'BEFORE_DELETE';
            sc.prompt_message.msg_of = 'COUNTERS_DELETE';
            sc.prompt_message.action_on = running_name;
            sc.prompt_message.action = action;
            sc.prompt_message.buttons =  [
                {
                    text: 'Yes',
                    result: 'YES',
                    className: '',
                    callbackFunc: this.promptCallback
                },
                {
                    text: 'No',
                    result: 'NO',
                    className: '',
                    callbackFunc: this.promptCallback
                }
            ];

            this.setState(sc);
        }
        else
            modifyRunningCounterAction(this, running_name, action);

    }

    promptCallback({msg_of, click_result, action_on, action}) {
        this.setState({
            prompt_message: {
                show: false,
                messageType: null,
                children_type: null,
                action_on: null,
                action: null,
                buttons: []
            }
        }, () => {
            if (msg_of === 'COUNTERS_DELETE'){
                if (click_result === 'YES')
                    modifyRunningCounterAction(this, action_on, action);
            }
            if (msg_of === 'SETTING_DELETE'){
                if (click_result === 'YES')
                    deleteSettingsAction(this);
            }
        })
    }

    deleteSettings() {
        let sc = this.state;
        sc.prompt_message.show = true;
        sc.prompt_message.messageType =  'danger';
        sc.prompt_message.children_type =  'BEFORE_DELETE';
        sc.prompt_message.msg_of = 'SETTING_DELETE';
        sc.prompt_message.action_on = this.state.version_selected;
        sc.prompt_message.action = 'delete';
        sc.prompt_message.buttons =  [
            {
                text: 'Yes',
                result: 'YES',
                className: '',
                callbackFunc: this.promptCallback
            },
            {
                text: 'No',
                result: 'NO',
                className: '',
                callbackFunc: this.promptCallback
            }
        ];

        this.setState(sc);
    }

    render() {
        try {
            return (
                <>
                    <PromptMessage
                        {...this.state.prompt_message}
                    >
                        {
                            this.state.prompt_message.children_type && promptMessages(this.state.prompt_message.children_type, this.state.prompt_message.action_on)
                        }
                    </PromptMessage>

                    <div
                        className={'admin-settings-panel ' + (this.state.prompt_message.show ? 'dimming-page' : '')}
                        onClick={this.onClickOnForm}
                    >
                        <Header
                            item_selected={this.state.exp_selected}
                            list_open={this.state.experiment_list_dropdown}
                            optionsList={this.state.AllExperiments}
                            select_item={this.select_drop_item}
                            reference={this}
                        />

                        {
                            !this.state.game_settings ? <NonExpElements error={this.state.error}/> : (
                                <SettingsBody
                                    _this={this}
                                    changeSettings={this.changeSettings}
                                />
                            )
                        }
                    </div>
                </>
            );
        }
        catch (e) {
            return <></>;
        }
    };
}

Settings.propTypes = {
    isAuthenticated: PropTypes.bool,
    setGameMode: PropTypes.func.isRequired,
    setWaitForAction: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {setGameMode, setWaitForAction, setAlert})(Settings);


