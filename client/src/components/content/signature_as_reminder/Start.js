import React, {useEffect, useRef, useState} from 'react';
import './gameStyles.css';
import PropTypes from "prop-types";
import {NewLogs} from "../../../actions/logger";
import {adjustFont, getTimeDate} from "../../../utils/app_utils";
import WaitForAction2 from "../../screens/waitForAction/wait_for_action2";

import {KeyTableID} from "../../screens/gameHandle/game_handle";

const ThisExperiment = 'SignatureAsReminder';

let UserId = null;
let RunningName = '-';
let PaymentsSettings = null;
let FontSize = null;
let ReadTime = null;

let AllowBonusQuestions = false;

let GameSet = {};

let GameQues = [], BonusQues = [] ;

const ResetAll = () => {
    UserId = 'empty';
    RunningName = '-';
    PaymentsSettings = null;
    GameSet = {};
    GameQues = [];
    BonusQues = [];
    ReadTime = null;
};

const ResetNewGame = () => {
    ReadTime = null;
    GameQues = [];
    BonusQues = [];
};

const Story = ({story, Forward, defineFont, total_pages, current_page}) => {
    const [fontSize, setFontSize] = useState(FontSize);
    let textRef = useRef();

    useEffect(() => {
        if (!textRef || !defineFont) return ;

        const handleResize = () => {
            const f_s = adjustFont(textRef);

            if (defineFont) {
                return Forward(f_s);
            }
            setFontSize(f_s);
        };

        // window.addEventListener('resize', handleResize);

        handleResize();

        return () => {
            // window.removeEventListener('resize', handleResize);
        }
    }, [textRef, story, defineFont, current_page, Forward]);

    const last_page = total_pages === current_page;

    return (
        <div
            className='SAR_board STE_board'
            style={{
                visibility: (fontSize && !defineFont)? 'visible' : 'hidden'
            }}
        >
            <label><span>Story</span></label>
            <div
                className='SAR_storyCont'
                ref={textRef}
                style={{fontSize}}
            >
                <p
                    // className='STE_story2'
                >
                    {story}
                </p>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateRows: 'max-content max-content',
                    width: 'max-content',
                    justifyItems: 'center',
                    margin: '0 0 0 auto',
                }}
            >
                <label style={{fontSize: 'x-large', fontWeight: 'bold'}}>PAGE {current_page}/{total_pages}</label>
                <button className='STE_next_btn' onClick={Forward}>{last_page? 'GO TO THE QUESTIONS' : 'NEXT PAGE'}</button>
            </div>
        </div>
    )
}

const Question = ({question, selectAnswer, question_index}) => {

    return (
        <div className='STE_Que'>
            <label>{(question_index+1) +'. '+ question.que}</label>
            <div>
                {
                    question.answers.map(
                        (answer, answer_index) => (
                            <label
                                key={'q' +answer_index+answer}
                            >
                                <input
                                    onClick={() => selectAnswer(question_index, answer_index)}
                                    type="radio"
                                    key={answer_index+answer}
                                    name={'q' + question_index}

                                />
                                {answer}
                            </label>

                        )
                    )
                }
            </div>
        </div>
    )
}

const Questions = ({questions, Forward, Part}) => {

    const [quesAns, setQuesAns] = useState(null);

    useEffect(() => {

        let q = [];
        try {
            q = (new Array(questions.length)).fill(null);
        }
        catch (e) {

        }
        if (Part === 'GAME')
            GameQues = [...q];
        else
            BonusQues = [...q];
        setQuesAns(q);

    }, [questions, Part]);

    const selectAnswer = (question_index, answer_index) => {
        let q_ = [...quesAns];
        q_[question_index] = answer_index;

        if (Part === 'GAME')
            GameQues[question_index] = answer_index+1;
        else
            BonusQues[question_index] = answer_index+1;
        setQuesAns(q_);
    }

    const Continue = () => {

        NewLogs({
            user_id: UserId,
            exp: ThisExperiment,
            running_name: RunningName,
            action: 'F.Q',
            type: 'LogGameType',
            more_params: {
                answers: GameQues.join(', '),
                part: Part,
                local_t: getTimeDate().time,
                local_d: getTimeDate().date,
            },
        }).then((res) => {});

        Forward();
    };
    if (!quesAns) return <></>;

    let err_ans = false;
    for (let i=0; i<quesAns.length; i++)
        if (quesAns[i] === null){
            err_ans = true;
            break;
        }


    return (
        <div className='SAR_Ques STE_Ques'>
            <div className='STE_Ques-h'>
                <label>Questions</label>
                <label>Please answer the questions below.</label>
            </div>
            <div className='STE_QuesList'>
                {
                    questions.map(
                        (question, question_index) => (
                            <Question
                                key={question_index+question.que}
                                question={question}
                                question_index={question_index}
                                selectAnswer={selectAnswer}
                            />
                        )
                    )
                }
            </div>

            <button className={'STE_next_btn ' + (err_ans? 'disabledElem' : '')} onClick={err_ans? undefined : Continue}>Next</button>
        </div>
    )
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        ReadTime = [];
        for (let i=0; i<GameSet.story.pages.length; i++)
            ReadTime.push({
                page: i,
                start: null,
                end: null,
                elapsedMil: null
            });

        this.state = {
            step: 0,
            page: 0,
            define_page: 0,
            isLoading: false,
            defineFont: true,
        }

        this.nextStep = this.nextStep.bind(this);
        this.finishSetFont = this.finishSetFont.bind(this);

        this.StoryTimeBegin = null;
        this.StoryTimeEnd = null;

        this.trial_sum = {
            read_time: null,
            answers: null,
            questions: null
        }
    }

    componentDidMount() {
        this.StoryTimeBegin = Date.now();
        ReadTime[0].start = Date.now();
    }

    nextStep(){
        let sc = this.state;

        if (sc.step === 1){
            let sum = 0;
            for (let i=0; i<ReadTime.length; i++){
                sum += ReadTime[i].elapsedMil;
            }
            NewLogs({
                user_id: UserId,
                exp: ThisExperiment,
                running_name: RunningName,
                action: 'F.S',
                type: 'LogGameType',
                more_params: {
                    cond: GameSet.game_condition,
                    total_read: sum,
                    local_t: getTimeDate().time,
                    local_d: getTimeDate().date,
                },
            }).then((res) => {
            });

            return this.props.Forward();
        }
        else {
            const {pages} = GameSet.story;
            ReadTime[sc.page].end = Date.now();
            ReadTime[sc.page].elapsedMil = ReadTime[sc.page].end - ReadTime[sc.page].start;

            NewLogs({
                user_id: UserId,
                exp: ThisExperiment,
                running_name: RunningName,
                action: 'F.P',
                type: 'LogGameType',
                more_params: {
                    cond: GameSet.game_condition,
                    page: sc.page+1,
                    read: ReadTime[sc.page].elapsedMil,
                    local_t: getTimeDate().time,
                    local_d: getTimeDate().date,
                },
            }).then((res) => {
            });

            if (sc.page === (pages.length-1)) {
                this.StoryTimeEnd = Date.now();
                sc.step++;
            }
            else {
                sc.page++;
                ReadTime[sc.page].start = Date.now();
            }
        }
        this.setState(sc);
    }

    finishSetFont(font_size){
        let sc = this.state;
        const {pages} = GameSet.story;
        if (sc.define_page === (pages.length-1)) {
            sc.defineFont = false;
            FontSize = font_size;
        }
        else
            sc.define_page++;

        this.setState(sc);
    }

    render() {
        const {step} = this.state;

        if (this.state.isLoading) return <WaitForAction2/>;

        if (this.state.defineFont)
            return (
                <>
                    <WaitForAction2/>
                    <Story
                        defineFont={true}
                        Forward={this.finishSetFont}
                        story={GameSet.story.pages[this.state.define_page]}
                        current_page={this.state.define_page}
                    />
                </>
            );

        return (
            <>
                {step === 0 && (
                    <Story
                        defineFont={false}
                        Forward={this.nextStep}
                        total_pages={GameSet.story.pages.length}
                        current_page={this.state.page+1}
                        story={GameSet.story.pages[this.state.page]}
                    />)}
                {step === 1 && (
                    <Questions
                        Forward={this.nextStep}
                        Part='GAME'
                        questions={GameSet.story.questions}
                    />
                )}
            </>
        );
    }
}

class Start extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        ResetAll();

        UserId = props.user_id;
        RunningName = props.running_name;

        PaymentsSettings = props.game_settings.payments;

        GameSet.app_back = props.game_settings.game.app_back;
        GameSet.a_s = Number(props.game_settings.game.a_s);
        GameSet.game_condition = props.game_settings.game.cond;
        GameSet.story = props.game_settings.game.stories;
        GameSet.bonus_ques = props.game_settings.game.b_ques;
        GameSet.b_q = props.game_settings.game.b_q;

        GameQues = (new Array(GameSet.story.questions.length)).fill(null)

        const all_cond = ['f_d', 'e_d'];

        if (GameSet.game_condition === 'r'){
            GameSet.game_condition = all_cond[Math.floor(Math.random() * all_cond.length)];
        }
        else if (GameSet.game_condition === 'u_d'){
            let RunCounter = KeyTableID();
            GameSet.game_condition = all_cond[RunCounter%all_cond.length];
        }

        if (GameSet.game_condition === 'f_d'){
            GameSet.declaration_txt = props.game_settings.game.f_d_txt;
            GameSet.declaration_chk = props.game_settings.game.f_d_chk;
            GameSet.declaration_txt2 = '';
        }
        else {
            GameSet.declaration_txt = props.game_settings.game.e_d_txt;
            GameSet.declaration_chk = props.game_settings.game.e_d_chk;
            GameSet.declaration_txt2 = props.game_settings.game.e_d_txt2;
        }

        this.Forward = this.Forward.bind(this);
        this.initializeGame = this.initializeGame.bind(this);

        this.state = {
            tasks_index: 0,
            isa: props.isa,
            isLoading: true,
            error: !GameSet.story,
            bonus_part: false,
        };

        this.game_template = null;
        this.props.SetLimitedTime(false);

    }

    initNewGame = () => {
        ResetNewGame();
        this.initializeGame();
        this.setState({
            tasks_index: 0,
            isLoading: false,
        })
    }

    initializeGame() {
        let game_template = [];

        game_template.push({
            Component: GameWelcome
        });

        if (GameSet.game_condition.includes('f_d'))
            game_template.push({
                Component: Declaration,
                Location: 'First'
            });

        game_template.push({
            Component: Game,
        });

        if (GameSet.game_condition.includes('e_d')) {
            game_template.push({
                Component: Declaration,
                Location: 'End'
            });
        }

        if (GameSet.game_condition.includes('f_d')) {
            game_template.push({
                Component: DecFirstFinal,
            });
        }

        game_template.push({
            Component: FinishStory,
        });

        this.game_template = game_template;
    }

    componentDidMount(){
        NewLogs({
            user_id: UserId,
            exp: ThisExperiment,
            running_name: RunningName,
            action: 'G.L',
            type: 'LogGameType',
            more_params: {
                cond: GameSet.game_condition,
                local_t: getTimeDate().time,
                local_d: getTimeDate().date,
            },
        }).then((res) => {
            this.initNewGame();
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isa !== this.props.isa){
            let sc = this.state;
            sc.isa = this.props.isa;
            this.setState(sc);
        }
    }

    Forward(option){
        let sc = this.state;

        if (option === 'NewGame' || sc.tasks_index === (this.game_template.length-1)){
            if (GameSet.b_q === 'Yes' && GameSet.bonus_ques.length && AllowBonusQuestions){
                AllowBonusQuestions = false;
                sc.bonus_part = true;
                return this.setState(sc);
            }
            this.props.SetLimitedTime(false);

            this.props.insertTextInput('condition', GameSet.game_condition);
            this.props.insertTextInput('FinalOption', option === 'NewGame');


            let obj = {};

            for (let i=0; i<ReadTime.length; i++){
                obj[`page${i+1}_readTime` ] = ReadTime[i].elapsedMil;
            }

            for (let i=0; i<GameSet.story.questions.length; i++){
                const ques = GameSet.story.questions[i];
                obj[`q${i+1}_answer` ] = GameQues[i];
                obj[`q${i+1}_correct` ] = Number(ques.co)+1;
                obj[`q${i+1}_is_correct` ] = (GameQues[i] === (Number(ques.co))+1).toString().toUpperCase();
            }

            if (GameSet.b_q === 'Yes')
                for (let i=0; i<GameSet.bonus_ques.length; i++){
                    const ques = GameSet.bonus_ques[i];
                    const answer = BonusQues.length>0? BonusQues[i] : '-';
                    obj[`bq${i+1}_answer` ] = answer;
                    obj[`bq${i+1}_correct` ] = Number(ques.co)+1;
                    obj[`bq${i+1}_is_correct` ] = (answer === (Number(ques.co)+1)).toString().toUpperCase();
                }

            obj.TimingCond = GameSet.game_condition === 'e_d'? 'END' : 'START';

            this.props.insertGameLine(obj);

            let game_points = 0;
            let total_pay = PaymentsSettings.show_up_fee;

            const current_time = getTimeDate();
            NewLogs({
                user_id: UserId,
                exp: ThisExperiment,
                running_name: RunningName,
                action: 'G.E',
                type: 'LogGameType',
                more_params: {
                    game_points,
                    total_payment: total_pay,
                    local_t: current_time.time,
                    local_d: current_time.date,
                },
            }).then((res) => {});

            this.props.insertPayment({
                game_points,
                sign_of_reward: PaymentsSettings.sign_of_reward,
                show_up_fee: PaymentsSettings.show_up_fee,
                exchange_ratio: PaymentsSettings.exchange_ratio,
                bonus_endowment: PaymentsSettings.bonus_endowment,
                total_payment: total_pay,
                Time: current_time.time,
                Date: current_time.date
            });
            sc.bonus_part = false;

            sc.isLoading = true;
            this.setState(sc, () => {
                this.props.sendGameDataToDB().then(
                    () => {
                        NewLogs({
                            user_id: UserId,
                            exp: ThisExperiment,
                            running_name: RunningName,
                            action: 'G.E.S',
                            type: 'LogGameType',
                            more_params: {
                                local_t: current_time.time,
                                local_d: current_time.date,
                            },
                        }).then((res) => {});
                        this.props.callbackFunction('FinishGame', {need_summary: option !== 'NewGame', new_game: option === 'NewGame', args: {game_points}});
                    }
                );
            });
        }
        else {
            if (option === 'Back')
                sc.tasks_index--;
            else
                sc.tasks_index++;
        }
        this.setState(sc);
    }

    render() {
        if (!this.state || this.state.isLoading)
            return <WaitForAction2/>;

        if(this.state.error)
            return (
                <div className='game_error'>Game Error</div>
            )

        if (this.state.bonus_part)
            return (
                <Questions
                    Forward={this.Forward}
                    Part='BONUS'
                    questions={GameSet.bonus_ques}
                />
            )

        const Component = this.game_template[this.state.tasks_index].Component;
        const Location = this.game_template[this.state.tasks_index].Location;

        return (
            <div
                className='STE_main unselectable'
                style={{
                    backgroundColor: `rgba(${GameSet.app_back.r}, ${GameSet.app_back.g}, ${GameSet.app_back.b}, ${GameSet.app_back.a})`
                }}
            >
                <Component
                    Forward={this.Forward}
                    Location={Location}
                />
            </div>
        );
    }
}

Start.propTypes = {
    game_settings: PropTypes.object,
};

export default Start;

const GameWelcome = ({Forward}) => {

    return (
        <div
            className='STE_GW'
        >
            <label>Welcome to the <b>"Subjective story"</b> study.</label>
            <p>
                You will be asked to read a story and answer questions. It will take about 10 minutes. Please read the story before answering the questions. The story can be read once. It is important that you carefully read the story and will not skip sentences. In the questions, you will be asked about the feeling of the heroes in the story. All questions must be answered. The basic payment is £1. You will have to complete the task in good faith and without breaks. This task cannot be taken from a mobile device. If the story makes you uncomfortable you may leave the study at any time.
            </p>
            <label>If everything is clear, please press "Next"</label>
            <button onClick={Forward} className='STE_next_btn'>Next</button>
        </div>
    )
};

const Declaration = ({Forward, Location}) => {
    const [checked, setChecked] = useState(false);
    const [notDecMsg, setNotDecMsg] = useState(false);

    let NextBtnTxt = 'GO TO THE STORY';

    if (Location === 'End'){
        NextBtnTxt = 'NEXT';
    }

    if (notDecMsg)
        NextBtnTxt = 'NO';

    const onClickNext = (option) => {
        if (option === 'GO TO THE STORY'){
            if (checked)
                AllowBonusQuestions = true;
            Forward();
        }
        else if (option === 'NEXT'){
            if (!checked) return;
            AllowBonusQuestions = true;
            Forward();
        }
        else if (option === 'BACK'){
            setNotDecMsg(true);
        }
        else if (option === 'NO'){
            setNotDecMsg(false);
        }
        else if (option === 'YES'){
            AllowBonusQuestions = false;
            return Forward('NewGame');
        }
    }

    let next_btn_disable;
    if (Location === 'End'){
        if (notDecMsg)
            next_btn_disable = false;
        else {
            next_btn_disable = !checked;
        }
    }
    else {
        next_btn_disable = false;
    }

    return (
        <div className='STE_Dec STE_Prompt SAR_Dec' >
            <label>Declaration</label>
            {
                !notDecMsg? (
                    <>
                        <label>{GameSet.declaration_txt}</label>
                        <label>
                            <input
                                checked={checked}
                                type='checkbox'
                                onChange={e => {
                                    setChecked(e.target.checked);
                                } }
                            />
                            {GameSet.declaration_chk}
                        </label>

                        <label>{GameSet.declaration_txt2}</label>
                    </>
                ) : (
                    <p>
                        Are you sure you want to do the experiment from the beginning?
                    </p>
                )
            }

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${Location === 'End'?2:1}, 1fr)`
                }}
            >
                {
                    Location === 'End' && (
                        <button
                            style={{
                                margin: '0 auto 0 0',
                            }}
                            className={'STE_next_btn '}
                            onClick={() => onClickNext(!notDecMsg?'BACK':'YES')}
                            // className={'STE_next_btn ' + (checked? '': 'disabledElem')}
                            // onClick={checked?Forward:undefined}
                        >{!notDecMsg?'BACK':'YES'}
                        </button>
                    )
                }

                <button
                    style={{
                        margin: '0 0 0 auto',
                    }}
                    // className={'STE_next_btn '}
                    onClick={() => onClickNext(NextBtnTxt)}
                    className={'STE_next_btn ' + (next_btn_disable? 'disabledElem' : '')}
                    // onClick={checked?Forward:undefined}
                >{NextBtnTxt}
                </button>
            </div>
        </div>
    )
};

const DecFirstFinal = ({Forward}) => {
    const [notDecMsg, setNotDecMsg] = useState(false);

    let NextBtnTxt = 'NEXT';

    if (notDecMsg)
        NextBtnTxt = 'NO';

    const onClickNext = (option) => {
        if (option === 'NEXT'){
            return Forward();
        }
        else if (option === 'BACK'){
            return setNotDecMsg(true);
        }
        else if (option === 'NO'){
            return Forward();
        }
        else if (option === 'YES'){
            AllowBonusQuestions = false;
            return Forward('NewGame');
        }
    }

    return (
        <div className='STE_Dec STE_Prompt SAR_Dec' >
            <label></label>
            {
                !notDecMsg? (
                    <label>
                        You have almost finished the experiment, if you did not read the instructions properly and want to do the experiment from the beginning, press BACK
                    </label>
                ) : (
                    <p>
                        Are you sure you want to do the experiment from the beginning?
                    </p>
                )
            }

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(2, 1fr)`
                }}
            >
                <button
                    style={{
                        margin: '0 auto 0 0',
                    }}
                    className={'STE_next_btn '}
                    onClick={() => onClickNext(!notDecMsg?'BACK':'YES')}
                >{!notDecMsg?'BACK':'YES'}
                </button>

                <button
                    style={{
                        margin: '0 0 0 auto',
                    }}
                    onClick={() => onClickNext(NextBtnTxt)}
                    className={'STE_next_btn '}
                >{NextBtnTxt}
                </button>
            </div>
        </div>
    )
};

const FinishStory = ({Forward}) => {

    const btn_label = (GameSet.b_q === 'Yes' && GameSet.bonus_ques.length && AllowBonusQuestions)? 'GO TO THE QUESTIONS' : 'Get completion code';
    return (
        <div className='STE_Dec STE_Prompt'>
            <label>Congratulations,</label>
            <label>You finish the study. The "Subjective story study" has come to an end.</label>
            {
                GameSet.b_q === 'Yes' && GameSet.bonus_ques.length && AllowBonusQuestions && (
                    <label>
                        Before you go to the completion code, please answer {GameSet.bonus_ques.length} questions. For every correct answer, you will receive a 0.1 pounds bonus,
                        Important! Your basic payment for the experiment will be paid regardless of your answers.
                    </label>
                )
            }

            <button className='STE_next_btn ' onClick={Forward}>
                {btn_label}
            </button>
        </div>
    )
};

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

