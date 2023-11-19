import React, {useEffect, useState} from 'react';
import './gameStyles.css';
import './message.css';
import PropTypes from "prop-types";
import {NewLogs} from "../../../actions/logger";
import {getTimeDate} from "../../../utils/app_utils";
import WaitForAction2 from "../../screens/waitForAction/wait_for_action2";

import {KeyTableID} from "../../screens/gameHandle/game_handle";

const ThisExperiment = 'AbstractAndDeclarationEffect';

let UserId = null;
let RunningName = '-';
let PaymentsSettings = null;
let StartTime = null;

let NumberOfStories = null;
let GameSet = {};

let GameRec = {};
let GameQues = {}, PracticeQues = [];


const ResetAll = () => {
    UserId = 'empty';
    RunningName = '-';
    StartTime = null;
    PaymentsSettings = null;
    GameSet = {};
    GameRec = {};
    GameQues = {};
    PracticeQues = [];
};

const ResetNewGame = () => {
    GameRec = {};
    GameQues = {};
    PracticeQues = [];
};

const Story = ({part, story, Forward}) => {

    return (
        <div
            className='ADE_story'
        >
            <label>
                {
                    part === 'Practice' ? (
                        <span>Practice - story</span>
                    ) : (
                        <span>Story {NumberOfStories - GameSet.stories.length + 1} out of {NumberOfStories}</span>
                    )
                }
            </label>
            <div className='ADE_story_b'>
                <div
                    className={'ADE_storyCont '}
                >
                    <label>Abstract:</label>
                    <p className=''>
                        {story.abstract_txt}
                    </p>
                </div>

                <div
                    className={'ADE_storyCont '}
                >
                    <label>Story:</label>
                    <p className=''>
                        {story.story_txt}

                    </p>
                </div>
            </div>

            <button className='STE_next_btn' onClick={Forward}>Next</button>
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

const Questions = ({questions, Forward, part, setTrialSum}) => {

    const [quesAns, setQuesAns] = useState(null);

    useEffect(() => {

        const story_number = NumberOfStories - GameSet.stories.length;
        const story_key = 'story_' + story_number;
        let CurrentPart = part === 'Practice' ? PracticeQues : GameQues[story_key];

        if (CurrentPart.length === 0)
            CurrentPart = new Array(questions.length);

        let q = [];
        try {
            q = (new Array(questions.length)).fill(null);
        }
        catch (e) {

        }

        setQuesAns(q);

    }, [questions, part]);

    const selectAnswer = (question_index, answer_index) => {
        let q_ = [...quesAns];
        q_[question_index] = answer_index;
        const story_number = NumberOfStories - GameSet.stories.length;
        const story_key = 'story_' + story_number;
        let CurrentPart = part === 'Practice' ? PracticeQues : GameQues[story_key];

        CurrentPart[question_index] = answer_index+1;
        setQuesAns(q_);
    }

    const Continue = () => {
        const story_number = NumberOfStories - GameSet.stories.length;
        const story_key = 'story_' + story_number;
        let CurrentPart = part === 'Practice' ? PracticeQues : GameQues[story_key];

        NewLogs({
            user_id: UserId,
            exp: ThisExperiment,
            running_name: RunningName,
            action: 'F.Q',
            type: 'LogGameType',
            more_params: {
                part: part.charAt(0).toLowerCase(),
                story: part === 'Practice'? 0 : (story_number+1),
                answers: CurrentPart.join(', '),
                local_t: getTimeDate().time,
                local_d: getTimeDate().date,
            },
        }).then((res) => {});

        setTrialSum('answers', [...quesAns]);

        Forward();
    };
    if (!quesAns)

        return <></>;

    let err_ans = false;
    for (let i=0; i<quesAns.length; i++)
        if (quesAns[i] === null){
            err_ans = true;
            break;
        }


    return (
        <div className='STE_Ques'>
            <div className='STE_Ques-h'>
                <label>{part === 'Practice' ? 'Practice - ' : ''}Questions</label>
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

        this.state = {
            step: 0,
            isLoading: false
        }

        this.nextStep = this.nextStep.bind(this);
        this.sendPartToDb = this.sendPartToDb.bind(this);
        this.setTrialSum = this.setTrialSum.bind(this);
        this.checkCustomDec = this.checkCustomDec.bind(this);

        this.StoryTimeBegin = null;

        this.trial_sum = {
            read_time: null,
            answers: null,
            questions: null
        }
    }

    componentDidMount() {
        this.StoryTimeBegin = Date.now();
    }

    sendPartToDb(){
        const story_number = NumberOfStories - GameSet.stories.length;
        const new_date = Date.now();

        const format_1 = getTimeDate(new_date)
        const format_2 = getTimeDate(this.StoryTimeBegin)

        const elapsedMil = new_date - this.StoryTimeBegin;
        let db_line = {
            story: this.props.Part === 'Practice' ? '0' : (story_number+1),
            time_story_begin: new_date - this.StoryTimeBegin,
            start_story: format_2.time,
            end_story: format_1.time,
            elapsedMil,
            elapsedMilFromBegin: new_date - StartTime,
        }

        const questions = this.props.Part === 'Practice' ? GameSet.practice_story.questions : GameSet.stories[0].questions;
        this.setTrialSum('read_time', elapsedMil);
        this.setTrialSum('questions', [...questions]);

        let sc = this.state;
        sc.isLoading = true;
        this.props.insertGameLine(db_line);
        this.setState(sc, () => {
            this.props.sendGameDataToDB().then(
                () => {
                    NewLogs({
                        user_id: UserId,
                        exp: ThisExperiment,
                        running_name: RunningName,
                        action: 'F.S',
                        type: 'LogGameType',
                        more_params: {
                            part: this.props.Part.charAt(0).toLowerCase(),
                            story: this.props.Part === 'Practice'? 0 : (story_number+1),
                            local_t: getTimeDate().time,
                            local_d: getTimeDate().date,
                        },
                    }).then((res) => {});

                    sc = this.state;
                    sc.isLoading = false;
                    this.setState(sc);
                }
            );
        });
    }

    setTrialSum(attr, value) {
        this.trial_sum[attr] = value;
    }

    checkCustomDec(){
        try {
            let mistakes = 0;
            const {questions, answers, read_time} = this.trial_sum;
            for (let i=0; i<questions.length; i++){
                const correct_ans = questions[i].co;
                if (!isNaN(correct_ans)){
                    const user_answer = answers[i];
                    if (Number(correct_ans) !== Number(user_answer))
                        mistakes++;
                }
            }
            const mistakes_percent = (mistakes / questions.length)*100;

            return read_time < GameSet.read_time || mistakes_percent > GameSet.minimum_mistakes;
        }
        catch (e) {
        }
    }

    nextStep(){
        let sc = this.state;

        if (sc.step === 3){
            if (this.props.Part === 'Practice') {
                return this.props.Forward();
            }
            else if (GameSet.stories.length === 0) {
                return this.props.Forward();
            }
            else {
                sc.step = 0;
            }
        }
        else if (sc.step === 2){
            if (GameSet.game_condition === 'e_d')
                sc.step = 3;
            else if (GameSet.game_condition === 'c_d'){
                const need_dec = this.checkCustomDec();
                if (need_dec)
                    sc.step = 3;
                else
                    sc.step = 0;
            }
            else
                sc.step = 0;
        }
        else if (sc.step === 1){

            if (this.props.Part === 'Practice') {

                return this.props.Forward();
            }

            GameSet.stories = GameSet.stories.filter((d_, index) => index !== 0);

            if (GameSet.stories.length === 0) {
                if (GameSet.game_condition === 'e_d')
                    sc.step = 3;
                else if (GameSet.game_condition === 'c_d'){
                    const need_dec = this.checkCustomDec();
                    if (need_dec)
                        sc.step = 3;
                    else
                        sc.step = 0;
                }
                else {

                    return this.props.Forward();
                }            }
            else {
                sc.step = 2;
            }
        }
        else {
            this.sendPartToDb();
            sc.step++;
        }

        if (sc.step === 0){
            this.StoryTimeBegin = Date.now();
            this.trial_sum = {
                read_time: null,
                answers: null,
                questions: null
            }
        }

        this.setState(sc);
    }

    render() {
        const {step} = this.state;
        const next_story = this.props.Part === 'Practice' ? GameSet.practice_story : GameSet.stories[0];
        const questions = this.props.Part === 'Practice' ? GameSet.practice_story.questions : GameSet.stories[0].questions;

        if (this.state.isLoading) return <WaitForAction2/>;

        return (
            <>
                {step === 0 && <Story part={this.props.Part} Forward={this.nextStep} story={next_story}/>}
                {step === 1 && <Questions part={this.props.Part} Forward={this.nextStep} questions={questions} setTrialSum={this.setTrialSum}/>}
                {step === 2 && <FinishStory part={this.props.Part} Forward={this.nextStep} />}
                {step === 3 && <Declaration Forward={this.nextStep} />}
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
        GameSet.read_time = Number(props.game_settings.game.r_t);
        GameSet.minimum_mistakes = Number(props.game_settings.game.m_m);
        GameSet.random_story = props.game_settings.game.r_s;
        GameSet.each_set_declaration = props.game_settings.game.e_d_t;
        GameSet.each_set_declaration_input = props.game_settings.game.e_d_t_i;
        GameSet.custom_declaration = props.game_settings.game.c_d_t;
        GameSet.custom_declaration_input = props.game_settings.game.c_d_t_i;
        GameSet.game_condition = props.game_settings.game.cond;


        const all_cond = ['n_d', 'e_d', 'c_d',];

        if (GameSet.game_condition === 'r'){
            GameSet.game_condition = all_cond[Math.floor(Math.random() * all_cond.length)];
        }
        else if (GameSet.game_condition === 'u_d'){
            let RunCounter = KeyTableID();
            GameSet.game_condition = all_cond[RunCounter%all_cond.length];
        }

        this.Forward = this.Forward.bind(this);
        this.initializeGame = this.initializeGame.bind(this);

        this.state = {
            tasks_index: 0,
            isa: props.isa,
            isLoading: true,
        };

        this.game_template = null;
        this.props.SetLimitedTime(false);
    }

    initNewGame = () => {
        ResetNewGame();
        let stories = this.props.game_settings.game.stories;
        const practice_story = this.props.game_settings.game.p_s;

        if (practice_story !== 'None') {
            GameSet.practice_index = Number(practice_story-1);
            GameSet.practice_story = stories[GameSet.practice_index];
            GameSet.stories = stories.filter((s, s_i) => s_i !== (GameSet.practice_index));
        }
        else {
            GameSet.practice_index = null;
            GameSet.practice_story = null;
            GameSet.stories = stories;
        }
        NumberOfStories = GameSet.stories.length;

        for (let i=0; i<NumberOfStories; i++) {
            GameRec['story_' + (i)] = [];
            GameQues['story_' + (i)] = [];
        }

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

        if (GameSet.practice_story !== null)
            game_template.push({
                Component: Game,
                Part: 'Practice'
            });

        if (NumberOfStories > 0){
            game_template.push({
                Component: Game,
                Part: 'Real'
            });

        }

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
            StartTime = Date.now();
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

        if (sc.tasks_index === (this.game_template.length-1)){
            this.props.SetLimitedTime(false);

            this.props.insertTextInput('condition', GameSet.game_condition);
            this.props.insertTextInput('FinalOption', option === 'NewGame');

            for (let story_que in GameQues){
                let que_answers = GameQues[story_que];
                let story_num = Number(story_que.replace('story_', '')) + 1;
                for (let i=0; i<que_answers.length; i++){
                    this.props.insertTextInput(`S${story_num}#${i+1}`, que_answers[i])
                }
            }

            for (let i=0; i<PracticeQues.length; i++){
                this.props.insertTextInput(`P#${i+1}`, PracticeQues[i])
            }

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

            sc.isLoading = true;
            this.setState(sc, () => {
                this.props.callbackFunction('FinishGame', {need_summary: option !== 'NewGame', new_game: option === 'NewGame', args: {game_points}});
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

        const Component = this.game_template[this.state.tasks_index].Component;
        const Part = this.game_template[this.state.tasks_index].Part;

        return (
            <div
                className='STE_main unselectable'
                style={{
                    backgroundColor: `rgba(${GameSet.app_back.r}, ${GameSet.app_back.g}, ${GameSet.app_back.b}, ${GameSet.app_back.a})`
                }}
            >
                <Component
                    Forward={this.Forward}
                    sendGameDataToDB={this.props.sendGameDataToDB}
                    insertGameLine={this.props.insertGameLine}
                    Part={Part}
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
                In this study, you will be asked to read a total of {NumberOfStories+1} short stories and then answer questions concerning these stories.
                It will take about 15 minutes to complete the task. Please read each of the stories before answering the questions.
                Each story can be read once. After pressing the "Next" key it will not be possible to go back and read the story once again.
                All questions must be answered, without answering the questions it will not be possible to proceed to the next story.
                At the beginning of the study, there will be a practice story with questions, you can read it and answer the questions as
                many times as you want. When you want to finish practicing, please press "Go to story 1".
                The basic payment for participation is {PaymentsSettings.sign_of_reward}{PaymentsSettings.show_up_fee}. To get the Prolific completion code, as well as your basic payment and bonus,
                you will have to complete the task in good faith and without breaks. This task cannot be taken from a mobile device.
                If one of the stories makes you uncomfortable you may leave the study at any time. You will receive your completion code once you
                have completed all the stories and questions. If everything is clear, please press "Next"
            </p>
            <label>If everything is clear, please press "Next"</label>
            <button onClick={Forward} className='STE_next_btn'>Next</button>
        </div>
    )
};

const Declaration = ({Forward}) => {
    const [checked, setChecked] = useState(false);

    return (
        <div className='STE_Dec STE_Prompt' >
            <label>Declaration</label>
            {GameSet.game_condition === 'e_d' && <label>{GameSet.each_set_declaration}</label>}
            {GameSet.game_condition === 'c_d' && <label>{GameSet.custom_declaration}</label>}
            <label>
                <input
                    checked={checked}
                    type='checkbox'
                    onChange={e => setChecked(e.target.checked) }
                />
                {GameSet.game_condition === 'e_d' && <label>{GameSet.each_set_declaration_input}</label>}
                {GameSet.game_condition === 'c_d' && <label>{GameSet.custom_declaration_input}</label>}
            </label>


            <button
                className={'STE_next_btn ' + (checked? '': 'disabledElem')}
                onClick={Forward}
            >Go to story 1
            </button>
        </div>
    )
};

const FinishStory = ({Forward}) => {

    const story_num = NumberOfStories - GameSet.stories.length;

    return (
        <div className='STE_Dec STE_Prompt'>
            <label></label>
            <label>
                Great, you finished the questions for story {story_num}.<br/>
                To move to the next story please press 'Go to story {story_num+1}'.
            </label>


            <button className='STE_next_btn ' onClick={Forward}>Go to story {story_num+1}</button>
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

