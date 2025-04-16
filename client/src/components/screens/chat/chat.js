import React, {useEffect, useRef, useState} from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {setGameMode, setWaitForAction} from "../../../actions/app_actions";
import './chat.css';
import { getTimeDate} from "../../../utils/app_utils";
import {toggleOpen} from "../dropdown/dropdown";
import {addExpChat, downloadFile, uploadExpFiles} from "../../../actions/exp_actions";
import {setAlert} from "../../../actions/alert";
import FileDownload from "js-file-download";
import {getUserInfo} from "../../../actions/auth";
import WaitForAction2 from "../waitForAction/wait_for_action2";
import {Header} from "../../layout/header/header";
import {preventPageGoBack, setCurrentExp} from "../../../utils/helpers";
import {CURRENT_URL} from "../../../utils/current_url";
let LAST_COUNT = 0;

// const FileDownload = require('js-file-download');

const emoji_img = [
    '😀', '😁', '😂', '😃', '😄', '😅', '😆', '😇', '😈', '😉', '😊', '😋', '😌', '😍', '😎', '😏', '😐', '😑', '😒', '😓', '😔', '😕', '😖', '😗', '😘', '😙', '😚', '😛', '😜', '😝', '😞', '😟', '😠', '😡', '😢', '😣', '😤', '😥', '😦', '😧', '😨', '😩', '😪', '😫', '😬', '😭', '😮', '😯', '😰', '😱', '😲', '😳', '😴', '😵', '😶', '😷', '🙁', '🙂', '🙃', '🙄', '🤐', '🤑', '🤒', '🤓', '🤔', '🤕', '🤠', '🤡', '🤢', '🤣', '🤤', '🤥', '🤧', '🤨', '🤩', '🤪', '🤫', '🤬', '🤭', '🤮', '🤯', '🧐',
];

// const emoji_tag = [
//     <>&#128512;</>, <>&#128513;</>, <>&#128514;</>, <>&#128515;</>, <>&#128516;</>, <>&#128517;</>, <>&#128518;</>, <>&#128519;</>, <>&#128520;</>, <>&#128521;</>, <>&#128522;</>, <>&#128523;</>, <>&#128524;</>, <>&#128525;</>, <>&#128526;</>, <>&#128527;</>, <>&#128528;</>, <>&#128529;</>, <>&#128530;</>, <>&#128531;</>, <>&#128532;</>, <>&#128533;</>, <>&#128534;</>, <>&#128535;</>, <>&#128536;</>, <>&#128537;</>, <>&#128538;</>, <>&#128539;</>, <>&#128540;</>, <>&#128541;</>, <>&#128542;</>, <>&#128543;</>, <>&#128544;</>, <>&#128545;</>, <>&#128546;</>, <>&#128547;</>, <>&#128548;</>, <>&#128549;</>, <>&#128550;</>, <>&#128551;</>, <>&#128552;</>, <>&#128553;</>, <>&#128554;</>, <>&#128555;</>, <>&#128556;</>, <>&#128557;</>, <>&#128558;</>, <>&#128559;</>, <>&#128560;</>, <>&#128561;</>, <>&#128562;</>, <>&#128563;</>, <>&#128564;</>, <>&#128565;</>, <>&#128566;</>, <>&#128567;</>, <>&#128577;</>, <>&#128578;</>, <>&#128579;</>, <>&#128580;</>, <>&#129296;</>, <>&#129297;</>, <>&#129298;</>, <>&#129299;</>, <>&#129300;</>, <>&#129301;</>, <>&#129312;</>, <>&#129313;</>, <>&#129314;</>, <>&#129315;</>, <>&#129316;</>, <>&#129317;</>, <>&#129319;</>, <>&#129320;</>, <>&#129321;</>, <>&#129322;</>, <>&#129323;</>, <>&#129324;</>, <>&#129325;</>, <>&#129326;</>, <>&#129327;</>,
// ];

const ImagePreview = ({source}) => {
    const [fullPreview, setFullPreview] = useState(false);

    let width= Math.min(document.documentElement.clientWidth, window.innerWidth || 0);
    let height = Math.min(document.documentElement.clientHeight, window.innerHeight || 0);

    let style = {};
    if (width>height)
        style.maxHeight = 0.85 * height;
    else
        style.maxWidth = 0.85 * width;

    return (
        <>
            <img onClick={() => setFullPreview(true)} src={source} alt="upload"/>
            {
                fullPreview && (
                    <div
                        className='msg_full_img'
                        onClick={() => setFullPreview(false)}
                    >
                        <label onClick={() => setFullPreview(false)}>X</label>
                        <img
                            src={source} alt="upload"
                            style={style}
                        />
                    </div>
                )
            }
        </>
    )
};

const PersonInfo = ({person_mail, setShowPersonInfo, setAlert}) => {
    const [person, setPerson] = useState(null);
    useEffect(() => {
        getUserInfo(person_mail).then(
            res => {
                try {
                    if (res.data.error){
                        setAlert(res.data.error, 'danger');
                        setShowPersonInfo(false);
                    }
                    else
                        setPerson(res.data.user_info);
                }
                catch (e){
                    setAlert('Some errors happened', 'danger');
                    setShowPersonInfo(false);
                }
            }
        )
    });

    if (!person)
        return <WaitForAction2/>;

    return (
        <div className='admin-chat-msg_balloon_p-i'>
            <div>
                <label onClick={() => setShowPersonInfo(false)}>X</label>
                <div>
                    <label>Name: <span>{person.name}</span></label>
                    <label>Age: <span>{person.age}</span></label>
                    <label>Gender: <span>{person.gender}</span></label>
                    <label>Phone: <span>{person.phone}</span></label>
                    <label>Join at: <span>{getTimeDate(person.create_date).date}</span></label>
                    <label>Experiments:</label>
                    <div>
                        {
                            person.Experiments.map(
                                experiment => <label key={experiment}>{experiment}</label>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
const MessageFrom = ({message_from,setAlert, Me}) => {
    const [showPersonInfo, setShowPersonInfo] = useState(false);
    return (
        <>
            <label onClick={() => setShowPersonInfo(true)} className='from'>{message_from}</label>
            {
                showPersonInfo && <PersonInfo setAlert={setAlert} setShowPersonInfo={setShowPersonInfo} person_mail={message_from === 'You' ? Me : message_from}/>
            }
        </>
    )
};

const MsgBalloon = ({exp, m_type, message, direction, message_from, date, isMe, Me, setAlert}) => {
    let time_date = getTimeDate(date);

    let message_content;
    if (m_type === 'FILE'){
        const its_image = (/\.(gif|jpe?g|a?png|svg|bmp)$/i).test(message.toLowerCase());
        const src = `${CURRENT_URL()}/uploads/ExpChat/${exp}/${message}`;
        let file_name = src.split('/').slice(-1)[0];
        const file_name_lbl = (
            <label>{file_name}
                <span
                    onClick={() => downloadFile(exp, message, 'ExpChat').then(
                        res => {
                            try {
                                FileDownload(res.data, file_name);
                            }
                            catch (e) {
                                setAlert('download_failed', 'danger');
                            }

                        }
                    )}
                >&#x21a7;</span>
            </label>
        );
        if (its_image) {
            message_content = (
                <div className='message_f image'>
                    <ImagePreview source={src.toString()}/>
                    {/*<img src={src} alt="upload"/>*/}
                    {file_name_lbl}
                </div>
            );
        }
        else {
            message_content = (
                <div className='message_f file'>
                    {file_name_lbl}
                </div>
            );
        }
    }
    else {
        message_content = (<label style={{direction, textAlign: direction === 'rtl'? 'right' : 'left'}} className='message'>{message}</label>);
    }
    return (
        <div
            className={'admin-chat-msg_balloon ' + (isMe ? 'msg_balloon_me' : '')}
        >
            <MessageFrom Me={Me} message_from={message_from} setAlert={setAlert}/>
            {message_content}
            <label className='date'><span>{time_date.date}</span> <span>{time_date.time}</span></label>
        </div>
    )
};

const MessagesBox = ({chat, Me, Exp, setAlert}) => {
    const messagesEndRef = React.createRef();

    useEffect(() => {
        try {
            messagesEndRef.current.scrollIntoView({ behavior: 'auto' })
        }
        catch (e) {}
    }, [chat, messagesEndRef]);

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
                                Me={Me}
                                message_from={Me === conv.from ? 'You' : conv.from}
                                message={conv.message}
                                m_type={conv.m_type}
                                exp={conv.exp}
                                direction={conv.direction}
                                date={conv.createdAt}
                                setAlert={setAlert}
                            />
                        )
                    }
                )
            }
            <div ref={messagesEndRef} />
        </div>
    )
}

const setFocus = inputEl => {
    try {
        inputEl.current.focus();
    }
    catch (e) {}
};

const EmojiBar = ({inputEl, message, setMessage}) => {

    const addEmoji = (emoji) => {
        let new_msg = message + emoji;
        setMessage(new_msg);
        setFocus(inputEl);
    }
    return (
        <div
            className='emoji_bar'
        >
            {
                emoji_img.map(
                    emoji => (
                        <label key={emoji} onClick={() => addEmoji(emoji)}>{emoji}</label>
                    )
                )
            }
        </div>
    )
}
const InputBox = ({sendMsg, Me, Exp, loadFiles}) => {
    const [areaHeight, setAreaHeight] = useState('auto');
    const [message, setMessage] = useState('');
    const [messageDirection, setMessageDirection] = useState('ltr');
    const inputEl = useRef(null);

    useEffect(() => {
        setFocus(inputEl);
    }, [messageDirection]);
    return (
        <div
            className='admin-chat-input_panel'
        >
            <EmojiBar inputEl={inputEl} message={message} setMessage={setMessage}/>

            <div
                className='admin-chat-input_box'
            >
                <input
                    type="file"
                    multiple
                    onChange={event => loadFiles(event.target.files, Me, Exp)}
                    name="file_chosen"
                    id="file_chosen"
                    style={{display: "none"}}
                />

                <label className="choose-file" htmlFor="file_chosen">
                    &#x21a5;
                    <span>Upload file</span>
                </label>

                <label className="change-lang"
                       onClick={() => messageDirection === 'ltr' ? setMessageDirection('rtl') : setMessageDirection('ltr')}
                >
                    &#x2194;
                    <span>Change direction to {messageDirection === 'ltr' ? 'rtl' : 'ltr'}</span>
                </label>

                <textarea
                    ref={inputEl}
                    className="div_textarea"
                    style={{
                        height: areaHeight,
                        direction: messageDirection
                    }}
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
                        sendMsg(message, Me, Exp, 'TEXT', messageDirection);
                        setMessage('');
                    }}
                >Send</button>
            </div>
        </div>
    )
}

class Chat extends React.Component {

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
            isLoading: false,
            exp_selected: exp,
            experiment_list_dropdown: false,
            chats: props.chats,
            AllExperiments: this.props.auth.user.Experiments,
        };

        this.select_drop_item = this.select_drop_item.bind(this);
        this.onClickOnForm = this.onClickOnForm.bind(this);
        this.sendMsg = this.sendMsg.bind(this);

        // const REACT_VERSION = React.version;
        // console.log('REACT_VERSION', REACT_VERSION);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.chats !== this.props.chats){

           this.setState({
               chats: this.props.chats
           });
        }
    }

    componentDidMount() {
        this.props.setGameMode(false);
        preventPageGoBack();
    }

    sendMsg(message, from, exp, m_type, direction) {
        this.props.setWaitForAction(true);
        addExpChat({exp, from, message, m_type, direction})
            .then(
            res => {
                try {
                    this.props.setWaitForAction(false);
                    if (!res.data.success){

                        this.props.setAlert('Some Error happened, please try later', 'danger');
                    }
                    else {

                    }
                }
                catch (e) {
                    this.props.setWaitForAction(false);
                    this.props.setAlert('Some Error happened, please try later', 'danger');
                }
            }
        )
    }

    loadFiles = (files, Me, Exp) => {
        if (files.length > 0){

            const data = new FormData();

            for(let x=0; x<files.length; x++) {
                data.append('file', files[x]);
            }

            this.props.setWaitForAction(true);

            uploadExpFiles({
                exp: Exp,
                from: Me,
                action: 'ExpChat',
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
                            this.setState(sc, () => {
                                this.props.setWaitForAction(false);
                                this.props.setAlert(res.data.msg, 'success');
                            });
                        }
                    }
                    catch (e) {
                        this.props.setWaitForAction(false);
                        this.props.setAlert('Some Error happened, please try later', 'danger');
                    }
                }
            );
        }

        // let sc = this.state;
        // sc.selectedFiles = [...sc.selectedFiles, ...files];
        // this.setState(sc, () => this.props.setAlert('Files will complete upload after saving', 'attention'));
    }

    select_drop_item(item, tag) {
        if (tag === 'EXP'){
            let sc = this.state;
            sc.exp_selected = item;
            setCurrentExp(item);
            this.setState(sc);
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
        return (
            <div
                className='admin-chat-panel'
                onClick={this.onClickOnForm}
            >
                <Header
                    item_selected={this.state.exp_selected}
                    list_open={this.state.experiment_list_dropdown}
                    optionsList={this.state.AllExperiments.sort()}
                    select_item={this.select_drop_item}
                    reference={this}
                />

                {
                    this.state.exp_selected? (
                        <div
                            className='admin-chat-chat_box'
                        >
                            <MessagesBox
                                chat={this.state.chats[this.state.exp_selected]}
                                Exp={this.state.exp_selected}
                                Me={this.state.auth.user.email}
                                setAlert={this.props.setAlert}
                            />
                            <InputBox
                                sendMsg={this.sendMsg}
                                loadFiles={this.loadFiles}
                                Exp={this.state.exp_selected}
                                Me={this.state.auth.user.email}
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
    chats: PropTypes.object,
};

const mapStateToProps = state => ({
    auth: state.auth,
    isAuthenticated: state.auth.isAuthenticated,
    chats: state.chats,
});

export default connect(mapStateToProps, {setGameMode, setWaitForAction, setAlert})(Chat);

/// ADD URL FOR NON ADMIN USERS

