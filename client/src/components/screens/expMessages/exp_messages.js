import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {getCurrentExp, preventPageGoBack, setCurrentExp} from "../../../utils/helpers";
import {toggleOpen} from "../dropdown/dropdown";
import PromptMessage from "../promptMessage/PromptMessage";
import {Header} from "../../layout/header/header";

const TestDiv = () => {
    const [textRef, setTextRef] = useState('');
    const value_ = 12345;
    return (
        <div>
            <p dangerouslySetInnerHTML={{ __html: textRef.replace('{v}', value_.toString()) }} />
            <textarea value={textRef} onChange={e => setTextRef(e.target.value)}/>
        </div>
    )
}

class ExpMessages extends React.Component {

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

        // this.select_drop_item = this.select_drop_item.bind(this);
        // this.onClickOnForm = this.onClickOnForm.bind(this);
        // this.changeSettings = this.changeSettings.bind(this);
        // this.modifyRunningCounter = this.modifyRunningCounter.bind(this);
        // this.promptCallback = this.promptCallback.bind(this);
        // this.deleteSettings = this.deleteSettings.bind(this);
    }

    // componentDidMount() {
    //     this.props.setGameMode(false);
    //     preventPageGoBack();
    //     if (this.state.exp_selected)
    //         getExpVersions(this, this.state.exp_selected);
    // }
    //
    // changeSettings(settings){
    //     let sc = this.state;
    //
    //     if (Array.isArray(settings)){
    //         for (let i=0; i<settings.length; i++){
    //             const {settings_of, key, key2, value} = settings[i];
    //
    //             if (key2) {
    //                 if (sc[settings_of][key] === undefined)
    //                     sc[settings_of][key] = {};
    //                 sc[settings_of][key][key2] = value;
    //             }
    //             else
    //                 sc[settings_of][key] = value;
    //         }
    //
    //     }
    //     else {
    //         const {settings_of, key, key2, value} = settings;
    //
    //         if (key2) {
    //             if (sc[settings_of][key] === undefined)
    //                 sc[settings_of][key] = {};
    //             sc[settings_of][key][key2] = value;
    //         }            else
    //             sc[settings_of][key] = value;
    //
    //     }
    //
    //     this.setState(sc);
    // }
    //
    // select_drop_item(item, tag) {
    //     if (tag === 'EXP') {
    //         setCurrentExp(item);
    //         getExpVersions(this, item);
    //     }
    //     else if (tag === 'SETTING')
    //         getSpecificSettingsAction(this, item);
    // }
    //
    // onClickOnForm(e) {
    //     try {
    //         let tag = e.target.attributes.group.value;
    //         if (tag !== 'DROPDOWN_TAG')
    //             toggleOpen.bind(this)('ALL');
    //     }
    //     catch (e) {
    //         toggleOpen.bind(this)('ALL');
    //     }
    // }
    //
    // modifyRunningCounter(running_name, action) {
    //
    //     if (action === 'remove'){
    //         let sc = this.state;
    //         sc.prompt_message.show = true;
    //         sc.prompt_message.messageType =  'danger';
    //         sc.prompt_message.children_type =  'BEFORE_DELETE';
    //         sc.prompt_message.msg_of = 'COUNTERS_DELETE';
    //         sc.prompt_message.action_on = running_name;
    //         sc.prompt_message.action = action;
    //         sc.prompt_message.buttons =  [
    //             {
    //                 text: 'Yes',
    //                 result: 'YES',
    //                 className: '',
    //                 callbackFunc: this.promptCallback
    //             },
    //             {
    //                 text: 'No',
    //                 result: 'NO',
    //                 className: '',
    //                 callbackFunc: this.promptCallback
    //             }
    //         ];
    //
    //         this.setState(sc);
    //     }
    //     else
    //         modifyRunningCounterAction(this, running_name, action);
    //
    // }
    //
    // promptCallback({msg_of, click_result, action_on, action}) {
    //     this.setState({
    //         prompt_message: {
    //             show: false,
    //             messageType: null,
    //             children_type: null,
    //             action_on: null,
    //             action: null,
    //             buttons: []
    //         }
    //     }, () => {
    //         if (msg_of === 'COUNTERS_DELETE'){
    //             if (click_result === 'YES')
    //                 modifyRunningCounterAction(this, action_on, action);
    //         }
    //         if (msg_of === 'SETTING_DELETE'){
    //             if (click_result === 'YES')
    //                 deleteSettingsAction(this);
    //         }
    //     })
    // }
    //
    // deleteSettings() {
    //     let sc = this.state;
    //     sc.prompt_message.show = true;
    //     sc.prompt_message.messageType =  'danger';
    //     sc.prompt_message.children_type =  'BEFORE_DELETE';
    //     sc.prompt_message.msg_of = 'SETTING_DELETE';
    //     sc.prompt_message.action_on = this.state.version_selected;
    //     sc.prompt_message.action = 'delete';
    //     sc.prompt_message.buttons =  [
    //         {
    //             text: 'Yes',
    //             result: 'YES',
    //             className: '',
    //             callbackFunc: this.promptCallback
    //         },
    //         {
    //             text: 'No',
    //             result: 'NO',
    //             className: '',
    //             callbackFunc: this.promptCallback
    //         }
    //     ];
    //
    //     this.setState(sc);
    // }
    //
    // render() {
    //     try {
    //         return (
    //             <>
    //                 <PromptMessage
    //                     {...this.state.prompt_message}
    //                 >
    //                     {
    //                         this.state.prompt_message.children_type && promptMessages(this.state.prompt_message.children_type, this.state.prompt_message.action_on)
    //                     }
    //                 </PromptMessage>
    //
    //                 <div
    //                     className={'admin-settings-panel ' + (this.state.prompt_message.show ? 'dimming-page' : '')}
    //                     onClick={this.onClickOnForm}
    //                 >
    //                     <Header
    //                         item_selected={this.state.exp_selected}
    //                         list_open={this.state.experiment_list_dropdown}
    //                         optionsList={this.state.AllExperiments}
    //                         select_item={this.select_drop_item}
    //                         reference={this}
    //                     />
    //
    //                     {
    //                         !this.state.game_settings ? <NonExpElements error={this.state.error}/> : (
    //                             <SettingsBody
    //                                 _this={this}
    //                                 changeSettings={this.changeSettings}
    //                             />
    //                         )
    //                     }
    //                 </div>
    //             </>
    //         );
    //     }
    //     catch (e) {
    //         return <></>;
    //     }
    // };
}


ExpMessages.propTypes = {
    setAlert: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({

    auth: state.auth,
});

// export default connect(mapStateToProps, {})(ExpMessages);


