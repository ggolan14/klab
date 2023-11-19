import React from "react";
import PropTypes from 'prop-types';
import './exp_details.css';
import {connect} from "react-redux";
import {setGameMode, setWaitForAction} from "../../../actions/app_actions";
import {setAlert} from "../../../actions/alert";
import {
    saveExpDevDetails,
    getExpDevDetails,
    uploadExpFiles,
    deleteUploadExpFile,
    downloadFile,
} from "../../../actions/exp_actions";
import {toggleOpen} from "../dropdown/dropdown";
import PromptMessage from "../promptMessage/PromptMessage";
import {Header} from "../../layout/header/header";
import {GoBack, preventPageGoBack} from "../../../utils/helpers";
import {CURRENT_URL} from "../../../utils/current_url";

/*
exp
description
version_of
status
messages
date_modified
last_modified
created_by
date_created
 */

const FileDownload = require('js-file-download');
let RedirectBack;

const new_exp_obj = {
    exp: '', //
    description: '',//
    version_of: 'None',//
    status: 'SENT',
    files: []
};

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

// const Header = ({mode, item_selected, list_open, optionsList, select_item, reference, setMode, SuperAdmin, goBack}) => {
//     return (
//         <div
//             className='exp-details-panel-h'
//         >
//             {
//                 mode === 'Edit' && (
//                     <>
//                         <div
//                             className='exp-details-panel-h-btn'
//                         >
//                             {/*{SuperAdmin && (*/}
//                             {/*    <button*/}
//                             {/*        onClick={() => setMode('New')}*/}
//                             {/*    >*/}
//                             {/*        New experiment*/}
//                             {/*    </button>*/}
//                             {/*)}*/}
//                             <button
//                                 onClick={() => {
//                                     goBack();
//                                 }}
//                             >
//                                 Back
//                             </button>
//                         </div>
//                         <DropDown
//                             label='Experiment'
//                             tag='EXP'
//                             dropdown_item='experiment_list'
//                             item_selected={item_selected}
//                             list_open={list_open}
//                             optionsList={optionsList}
//                             select_item={select_item}
//                             reference={reference}
//                         />
//                     </>
//                 )
//             }
//             {
//                 (SuperAdmin && mode === 'New') ? (
//                     <>
//                         <div
//                             className='exp-details-panel-h-btn'
//                         >
//                             <button
//                                 onClick={() => setMode('Edit')}
//                             >Cancel</button>
//                         </div>
//                         <label className='new_head'>New experiment</label>
//                     </>
//                 ) : <div></div>
//             }
//         </div>
//     )
// };

const FileItem = ({exp, file, removeFile, setAlert}) => {
    return (
        <div
            className='exp-details-_file_item'
        >
            <label
                onClick={() => removeFile(file)}
            >X</label>
            <label
                onClick={() => downloadFile(exp, file, 'ExpDev').then(
                    res => {
                        try {
                            FileDownload(res.data, file);
                        }
                        catch (e) {
                            setAlert('download_failed', 'danger');
                        }

                    }
                )}
            >{file}</label>
        </div>
    )
}

const GeneralDetails = ({exp_details, mode, changeDetails, modifyPrompt, loadFiles, filesList, saveExpDetails, AllExperiments, setAlert}) => {
    return (
        <div
            className='exp-details-panel-general'
        >
            <button
                onClick={!exp_details.exp ? () => {} : () => saveExpDetails()}
                className={!exp_details.exp ? 'disabledElem' : ''}
            >
                Save
            </button>
            <label>Experiment name:</label>
            <input
                type='text'
                value={exp_details.exp}
                onKeyDown={e => e.keyCode === 32 ? e.preventDefault() : {}}
                onChange={mode === 'Edit' ? () => {} : e => changeDetails('exp', e.target.value)}
            />

            <label>Experiment url:</label>
            <input
                type='text'
                value={!exp_details.exp ? '' : (CURRENT_URL() + '/' + exp_details.exp)}
                onChange={() => {}}
            />

            {/*<label>Version of:</label>*/}
            {/*<select*/}
            {/*    value={exp_details.version_of}*/}
            {/*    onChange={e => changeDetails('version_of', e.target.value) }*/}
            {/*>*/}
            {/*    <option value='None'>None</option>*/}
            {/*    {*/}
            {/*        AllExperiments.map(*/}
            {/*            exp => <option key={'new_exp_ins_of-' + exp} value={exp}>{exp}</option>*/}
            {/*        )*/}
            {/*    }*/}
            {/*</select>*/}

            <label>Experiment description:</label>
            <textarea
                value={exp_details.description}
                onChange={e => changeDetails('description', e.target.value)}
            />

            {mode !== 'New' && (
                <>
                    <label>files:</label>
                    <div className='exp-details-general-files_list'>
                        {exp_details.files.map(
                            file => {
                                return (
                                    <FileItem
                                        exp={exp_details.exp}
                                        key={'exp-details-general-files_list_'  + file}
                                        file={file}
                                        setAlert={setAlert}
                                        removeFile={file => modifyPrompt({action: 'remove_file', file})}
                                    />
                                )
                            }
                        )}
                    </div>
                </>
            )}

            <label>Add files:</label>
            <div
                className='exp-details-general-files_list'
                style={{
                    gridTemplateColumns: 'repeat(' + (filesList.length + 1) + ', max-content)'
                }}
            >
                <input
                    type="file"
                    multiple
                    onChange={event => loadFiles(event.target.files)}
                    name="file_chosen"
                    id="file_chosen"
                    style={{display: "none"}}
                />
                <label className="choose-file" htmlFor="file_chosen">Choose a file</label>

                {filesList.map(
                    file => {
                        return (
                            <FileItem
                                key={'exp-details-general-filesList_'  + file.name}
                                file={file.name}
                                removeFile={file => modifyPrompt({action: 'remove_file', file})}
                            />
                        )
                    }
                )}
            </div>
        </div>
    )
};

class NewExp extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;

        let exp = undefined;
        try {
            exp = this.props.location.state.exp;
        }
        catch (e){
        }

        RedirectBack = exp ? (exp + '/main') : '/';


        this.state = {
            auth: props.auth,
            isAuthenticated: props.isAuthenticated,
            mode: 'Edit',
            exp_details: null,
            selectedFiles: [],
            experiment_list: [],
            exp_selected: exp,
            experiment_list_dropdown: false,
            prompt_message: {
                show: false,
                messageType: null,
                children_type: null,
                buttons: [],
                action_on: null,
                action: null,
            },
            AllExperiments: this.props.auth.user.Experiments
        };

        this.select_drop_item = this.select_drop_item.bind(this);
        this.saveExpDetails = this.saveExpDetails.bind(this);
        this.getExpDetails = this.getExpDetails.bind(this);
        this.changeDetails = this.changeDetails.bind(this);
        this.loadFiles = this.loadFiles.bind(this);
        this.onClickOnForm = this.onClickOnForm.bind(this);
        this.setMode = this.setMode.bind(this);
        this.modifyPrompt = this.modifyPrompt.bind(this);
        this.promptCallback = this.promptCallback.bind(this);
        this.removeFile = this.removeFile.bind(this);
    }

    componentDidMount() {
        this.props.setGameMode(false);
        preventPageGoBack();

        if (this.state.exp_selected) {
            this.getExpDetails(this.state.exp_selected);
        }
    }

    saveExpDetails() {
        this.props.setWaitForAction(true);

        if (!this.state.exp_details.exp) return;
        saveExpDevDetails({
            user_id: this.state.auth.user.email,
            id: this.state.exp_details._id,
            description: this.state.exp_details.description,
            version_of: this.state.exp_details.version_of,
            status: this.state.exp_details.status,
        }).then(
            res => {
                try {
                    if (res.data.error){
                        this.props.setWaitForAction(false);
                        this.props.setAlert(res.data.error, 'danger');
                        return;
                    }

                    let sc = this.state;
                    sc.exp_details = res.data.exp_details;
                    sc.exp_selected = res.data.exp_details.exp;
                    this.setState(sc, () => {
                        this.props.setWaitForAction(false);
                        this.props.setAlert('Experiment saved', 'success');
                    });
                }
                catch (e) {
                    this.props.setWaitForAction(false);
                    this.props.setAlert('Some error happened, please try later', 'danger');
                }
            }
        )

    }

    getExpDetails(exp) {
        this.props.setWaitForAction(true);
        getExpDevDetails({
            exp
        }).then(
            res => {
                let sc = this.state;
                try {
                    if (res.data.error){
                        this.props.setWaitForAction(false);
                        this.props.setAlert(res.data.error, 'danger');
                        return;
                    }
                    sc.exp_details = res.data.expDev;
                    sc.exp_selected = res.data.expDev.exp;
                }
                catch (e) {
                    sc.exp_details = null;
                }

                this.setState(sc, () => this.props.setWaitForAction(false));
            }
        )

    }

    changeDetails(key, value){
        let sc = this.state;
        sc.exp_details[key] = value;
        this.setState(sc);
    }

    loadFiles(files){
        if (files.length > 0){

            const data = new FormData();

            for(let x=0; x<files.length; x++) {
                data.append('file', files[x]);
            }

            // for (let key of data.entries()) {
            //     log('--', key[0] + ', ' + key[1]);
            // }
            this.props.setWaitForAction(true);

            uploadExpFiles({
                exp: this.state.exp_details.exp,
                action: 'ExpDev',
                from: this.state.auth.user.email,
                data
            }).then(
                res => {
                    try {
                        if (res.data.error ){
                            this.props.setWaitForAction(false);
                            this.props.setAlert(res.data.error, 'danger');
                        }
                        else {
                            let sc = this.state;
                            sc.exp_details.files = res.data.all_files;
                            this.setState(sc, () => {
                                this.props.setWaitForAction(false);
                                this.props.setAlert(res.data.msg, 'success');
                            });
                        }
                    }
                    catch (e) {
                        this.props.setWaitForAction(false);
                        this.props.setAlert('Some error happened, please try later', 'danger');
                    }
                }
            );
        }

        // let sc = this.state;
        // sc.selectedFiles = [...sc.selectedFiles, ...files];
        // this.setState(sc, () => this.props.setAlert('Files will complete upload after saving', 'attention'));
    }

    removeFile({action_on, action}){
        this.props.setWaitForAction(true);
        deleteUploadExpFile({
            exp: this.state.exp_selected,
            file_name: action_on,
            user_id: this.state.auth.user.email
        }).then(
            res => {
                try {
                    if (res.data.error){
                        this.props.setWaitForAction(false);
                        this.props.setAlert(res.data.error, 'danger');
                        return;
                    }
                    let sc = this.state;
                    sc.exp_details.files = res.data.files;
                    this.setState(sc, () => {
                        this.props.setWaitForAction(false);
                        this.props.setAlert(res.data.msg, 'success');
                    });
                }
                catch (e) {
                    this.props.setWaitForAction(false);
                    this.props.setAlert('Some error happened, please try later', 'danger');
                }
            }
        )
    }

    select_drop_item(item, tag) {
        if (tag === 'EXP')
            this.getExpDetails(item);
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

    setMode(mode) {
        let sc = this.state;
        sc.mode = mode;
        if (mode === 'New'){
            sc.exp_details = {...new_exp_obj};
            sc.selectedFiles = [];
            sc.exp_selected = null;
        }
        else {
            sc.exp_details = null;
            sc.selectedFiles = [];
        }
        this.setState(sc);
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
            if (msg_of === 'FILE_DELETE'){
                if (click_result === 'YES')
                    this.removeFile({action_on, action});
            }
        })
    }

    modifyPrompt({file, action}){
        let sc = this.state;

        if (action === 'remove_file'){
            sc.prompt_message.show = true;
            sc.prompt_message.messageType = 'danger';
            sc.prompt_message.children_type = 'BEFORE_DELETE';
            sc.prompt_message.msg_of = 'FILE_DELETE';
            sc.prompt_message.action_on = file;
            sc.prompt_message.action = action;
            sc.prompt_message.buttons = [
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
        }
        // else if (action === 'remove_file_local'){
        //     let sc = this.state;
        //     sc.selectedFiles = sc.selectedFiles.filter(
        //         file_in => file_in.name !== file
        //     );
        // }
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
                        className={'exp-details-panel ' + (this.state.prompt_message.show ? 'dimming-page' : '')}
                        onClick={this.onClickOnForm}
                    >
                        <Header
                            // mode={this.state.mode}
                            item_selected={this.state.exp_selected}
                            list_open={this.state.experiment_list_dropdown}
                            optionsList={this.state.auth.user.Experiments}
                            select_item={this.select_drop_item}
                            // setMode={mode => this.setMode(mode)}
                            // SuperAdmin={this.state.auth.user.permission === 'SuperAdmin'}
                            goBack={() => GoBack(RedirectBack)}
                            reference={this}
                        />


                        {
                            !this.state.exp_details ? (
                                <label className='non-exp'>Choose experiment</label>
                            ) : (
                                <GeneralDetails
                                    exp_details={this.state.exp_details}
                                    mode={this.state.mode}
                                    changeDetails={(key, value) => this.changeDetails(key,value)}
                                    modifyPrompt={({file, action}) => this.modifyPrompt({file, action})}
                                    loadFiles={files => this.loadFiles(files)}
                                    filesList={this.state.selectedFiles}
                                    AllExperiments={this.state.AllExperiments}
                                    saveExpDetails={this.saveExpDetails}
                                    setAlert={this.props.setAlert}
                                />
                            )
                        }
                        {/*<div>*/}
                        {/*    <label>Experiment details</label>*/}
                        {/*    <button*/}
                        {/*        onClick={() => this.saveExpDetails()}*/}
                        {/*    >Save</button>*/}
                        {/*</div>*/}

                    </div>
                </>
            );
        }
        catch (e) {
            return <></>
        }
    };
}

NewExp.propTypes = {
    isAuthenticated: PropTypes.bool,
    setGameMode: PropTypes.func.isRequired,
    setWaitForAction: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    auth: state.auth
});

export default connect(mapStateToProps, {setGameMode, setWaitForAction, setAlert})(NewExp);


