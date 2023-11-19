import React, {useEffect, useRef, useState} from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import {setGameMode, setWaitForAction} from "../../../actions/app_actions";
import './chat.css';
import {getMyExps, isValidExperiment, getTimeDate} from "../../../utils/app_utils";
import {DropDown, toggleOpen} from "../dropdown/dropdown";
import { addExpChat} from "../../../actions/exp_actions";
import {setAlert} from "../../../actions/alert";
let LOADING_TIMEOUT = null;
let RedirectBack;
let LAST_COUNT = 0;
let CHECK_FOR_NEW_MSG = true;

const Header = ({item_selected, list_open, optionsList, select_item, reference, goBack}) => {
    return (
        <div
            className='exp-details-panel-h'
        >
            <button
                onClick={() => {
                    goBack();
                }}
            >
                Back
            </button>

            <DropDown
                label='Experiment'
                tag='EXP'
                dropdown_item='experiment_list'
                item_selected={item_selected}
                list_open={list_open}
                optionsList={optionsList.sort()}
                select_item={select_item}
                reference={reference}
            />
        </div>
    )
};

const MsgBalloon = ({message, message_from, date, isMe}) => {
    let time_date = getTimeDate(date);
    return (
        <div
            className={'admin-chat-msg_balloon ' + (isMe ? 'msg_balloon_me' : '')}
        >
            <label className='from'>{message_from}</label>
            <label className='message'>{message}</label>
            <label className='date'><span>{time_date.date}</span> <span>{time_date.time}</span></label>
        </div>
    )
};

const MessagesBox = ({chat, Me}) => {
    const messagesEndRef = React.createRef();
    const scrollToBottom = () => {
        try {
            messagesEndRef.current.scrollIntoView({ behavior: 'auto' })
        }
        catch (e) {}
        // messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    };
    useEffect(() => {
        scrollToBottom();
    }, [chat]);

    return (
        <div
            className='admin-chat-msg_box'
        >
            {
                chat.map(
                    conv => {
                        return (
                            <MsgBalloon
                                key={conv._id}
                                isMe={Me === conv.from}
                                message_from={Me === conv.from ? 'You' : conv.from}
                                message={conv.message}
                                date={conv.date}
                            />
                        )
                    }
                )
            }
            <div ref={messagesEndRef} />
        </div>
    )
}

const InputBox = ({sendMsg}) => {
    const [areaHeight, setAreaHeight] = useState('auto');
    const [message, setMessage] = useState('');
    const inputEl = useRef(null);

    return (
        <div
            className='admin-chat-input_box'
        >
            <textarea
                ref={inputEl}
                className="div_textarea"
                style={{height: areaHeight}}
                value={message}
                onChange={e => {
                    let lines = e.target.value.split(/\r|\r\n|\n/);
                    let count = lines.length;
                    if (count !== LAST_COUNT){
                        let new_height = (e.target.scrollHeight > e.target.clientHeight) ? (e.target.scrollHeight)+"px" : "auto";
                        LAST_COUNT = count;
                        setAreaHeight(new_height);
                    }
                    setMessage(e.target.value);
                }}
            />
            <button
                className={!message ? 'disabledElem' : ''}
                onClick={!message ? () => {} : () => {
                    sendMsg(message);
                    setMessage('');
                }}
            >Send</button>
        </div>
    )
}

class Chat extends React.Component {

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
            exp_selected: exp,
            experiment_list_dropdown: false,
            exp_chat: {},
            AllExperiments: []
        };

        this.checkIfMounted = this.checkIfMounted.bind(this);
        this.userIsAuth = this.userIsAuth.bind(this);
        this.userNotAuth = this.userNotAuth.bind(this);
        this.select_drop_item = this.select_drop_item.bind(this);
        this.getExpChats = this.getExpChats.bind(this);
        this.onClickOnForm = this.onClickOnForm.bind(this);
        this.sendMsg = this.sendMsg.bind(this);
        this.checkForNewMsg = this.checkForNewMsg.bind(this);
        this.checkForNewMsgInterval = null;

        // const REACT_VERSION = React.version;
        // console.log('REACT_VERSION', REACT_VERSION);
    }

    checkIfMounted() {
        return this.elementRef.current != null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isAuthenticated !== this.props.isAuthenticated){
            if (this.props.isAuthenticated){
                this.userIsAuth();
            }
        }
    }

    componentDidMount() {
        this.props.setGameMode(false);
        this.props.setWaitForAction(true);

        window.history.pushState(null, null, document.URL);
        window.addEventListener('popstate', function () {
            window.history.pushState(null, null, document.URL);
        });

        if (this.props.isAuthenticated)
            this.userIsAuth();
        else {
            this.userNotAuth();
        }
    }

    userIsAuth(){
        let sc = this.state;
        sc.isLoading = false;
        sc.isAuthenticated = this.props.isAuthenticated;
        sc.auth = this.props.auth;
        sc.AllExperiments = this.props.auth.user.Experiments;
        this.setState(sc, () => {
            if (this.state.exp_selected)
                this.getExpChats(this.state.exp_selected);
            else
                this.props.setWaitForAction(false);
        });
    }

    userNotAuth(){
        let interval_counter = 0;

        LOADING_TIMEOUT = setInterval(() => {
            interval_counter++;

            if (this.props.isAuthenticated || interval_counter > 7){
                clearInterval(LOADING_TIMEOUT);
                this.props.setWaitForAction(false);
                let is_still_mount = this.checkIfMounted();
                if (is_still_mount && this.props.isAuthenticated){
                    this.userIsAuth();
                }
            }
        }, 1000);
    }

    componentWillUnmount() {
        clearTimeout(this.checkForNewMsgInterval);
    }

    sendMsg(message) {
        this.props.setWaitForAction(true);
        addExpChat({
            id: this.state.exp_chat._id,
            from: this.state.auth.user.email,
            message
        }).then(
            res => {
                let sc = this.state;
                try {
                    if (res.data.error){
                        this.props.setWaitForAction(false);
                        this.props.setAlert(res.data.error, 'danger');
                        return;
                    }
                    sc.exp_chat = res.data.exp_chat;
                    sc.exp_selected = res.data.exp_chat.exp;
                    this.setState(sc, () => {
                        this.props.setWaitForAction(false);
                    });
                }
                catch (e) {
                    this.props.setWaitForAction(false);
                    this.props.setAlert('Some error happened, please try later', 'danger');
                }
            }
        )
    }

    checkForNewMsg(){
        this.checkForNewMsgInterval = setTimeout(() => {
            if (this.checkIfMounted){
                if (!CHECK_FOR_NEW_MSG) return;
                this.getExpChats(this.state.exp_selected);
            }
            else {
                CHECK_FOR_NEW_MSG = false;
                clearTimeout(this.checkForNewMsgInterval);
            }
        }, 2000);
    }

    getExpChats(exp) {
        CHECK_FOR_NEW_MSG = false;
        clearTimeout(this.checkForNewMsgInterval);

        if (!exp) return;

        this.props.setWaitForAction(true);
        // getExpChat({
        //     exp
        // }).then(
        //     res => {
        //         let sc = this.state;
        //         try {
        //             if (res.data.error){
        //                 this.props.setWaitForAction(false);
        //                 this.props.setAlert(res.data.error, 'danger');
        //                 return;
        //             }
        //
        //             if (!sc.exp_chat.chat || sc.exp_chat.chat.length !== res.data.exp_chat.chat.length || sc.exp_selected !== res.data.exp_chat.exp) {
        //                 sc.exp_chat = res.data.exp_chat;
        //                 sc.exp_selected = res.data.exp_chat.exp;
        //                 this.setState(sc, () => {
        //                     this.props.setWaitForAction(false);
        //                     this.checkForNewMsg();
        //                 });
        //             }
        //             else {
        //                 this.props.setWaitForAction(false);
        //                 this.checkForNewMsg();
        //             }
        //             CHECK_FOR_NEW_MSG = true;
        //         }
        //         catch (e) {
        //             this.props.setWaitForAction(false);
        //             this.props.setAlert('Some error happened, please try later', 'danger');
        //         }
        //     }
        // )
    }

    select_drop_item(item, tag) {
        if (tag === 'EXP')
            this.getExpChats(item);
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
        if (!this.state || this.state.isLoading)
            return <div ref={this.elementRef}></div>;

        if (!this.state.isAuthenticated || !this.state.auth.user.permission.includes('Admin')) {
            return <Redirect to='/login'/>;
        }

        return (
            <div
                className='admin-chat-panel'
                ref={this.elementRef}
                onClick={this.onClickOnForm}
            >
                <Header
                    item_selected={this.state.exp_selected}
                    list_open={this.state.experiment_list_dropdown}
                    optionsList={this.state.AllExperiments.sort()}
                    select_item={this.select_drop_item}
                    goBack={() => {
                        return this.props.history.push(RedirectBack);
                    }}
                    reference={this}
                />

                {
                    this.state.exp_selected && this.state.exp_chat.chat ? (
                        <div
                            className='admin-chat-chat_box'
                        >
                            <MessagesBox
                                chat={this.state.exp_chat.chat}
                                Me={this.state.auth.user.email}
                            />
                            <InputBox
                                sendMsg={this.sendMsg}
                            />
                        </div>
                    ) : (
                        <label>Select experiment</label>
                    )
                }
            </div>
        );
    };
}

Chat.propTypes = {
    isAuthenticated: PropTypes.bool,
    setGameMode: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
    setWaitForAction: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {setGameMode, setWaitForAction, setAlert})(Chat);

/// ADD URL FOR NON ADMIN USERS
