import React, {Fragment, useEffect, useRef, useState} from 'react';
import './gameStyles.css';
import PropTypes from "prop-types";
import {NewLogs} from "../../../actions/logger";
import {getTimeDate, isDevUser} from "../../../utils/app_utils";
import WaitForAction2 from "../../screens/waitForAction/wait_for_action2";
import $ from 'jquery';
import {DebuggerModalView, KeyTableID} from "../../screens/gameHandle/game_handle";
const ThisExperiment = 'SP';

let DebugMode = null;
let UserId = 'empty';
let RunningName = '-';

let START_MIL = 0;
let GameSettings = {};
let PaymentsSettings = null;
let Mean1Res = {}, Mean2Res = {}, NFC_ANSWERS = [];
let AttentionPoints = null;
let AllRecords = [];
let IS_BLOCKED_CONDITION = false;
let PracticeMeanOrder;

let MULTIPLE = 1;

const randomNormal = require('random-normal');
const convertRgb = rgb_obj => {
    return `rgb(${rgb_obj.r}, ${rgb_obj.g}, ${rgb_obj.b})`;
}
// payments:
// bonus_endowment
// exchange_ratio
// show_up_fee
// sign_of_reward
const ResetAll = () => {
    UserId = 'empty';
    RunningName = '-';
    GameSettings = {};
    PaymentsSettings = null;
    DebugMode = null;
    Mean1Res = {};
    Mean2Res = {};
    AttentionPoints = null;
    AllRecords = [];
    IS_BLOCKED_CONDITION = false;
}

const GameHeader = ({Card, Ncards, Round, Nrounds, nextMean, texts_colors}) => {

    return (
        <div
            className='sp-game-header'
        >
            <label>Card no. <span>{Card}</span> out of <span>{Ncards}</span> cards in this deck.</label>
            <label>Deck no. <span>{Round}</span> out of <span>{Nrounds}</span> decks.</label>
            {
                GameSettings.mode === 'Gains-full description' && (
                    <>
                        <label>Deck average:
                            <span
                                style={{
                                    marginLeft: 5,
                                    color: convertRgb(texts_colors.d_a),
                                    // color: GameSettings.HigherMean === nextMean[0]? 'rgb(3,53,180)' : 'rgb(33,190,4)',
                                }}
                            >{GameSettings[nextMean[0]]}
                                </span></label>
                        <label>Deck standard deviation:
                            <span
                                style={{
                                    marginLeft: 5,
                                    color: convertRgb(texts_colors.d_s_d),
                                    // color: GameSettings.HigherMean === nextMean[0]? 'rgb(3,53,180)' : 'rgb(33,190,4)'
                                }}
                            >{GameSettings[nextMean[1]]}
                                </span></label>
                    </>
                )
            }
        </div>
    )
}

const GameButtons = ({flipButtonText, flipClassName, choose_card, chooseCard, flip_card, flipAnotherCard}) => {
    return (
        <div
            className='sp-game-footer'
        >
            {
                choose_card && (
                    <button
                        onClick={chooseCard}
                        className='unselectable'
                    >
                        <b>Choose</b> this card
                    </button>
                )
            }

            {
                flip_card && (
                    <button
                        className={flipClassName + '  unselectable'}
                        onClick={flipAnotherCard}
                    >
                        {flipButtonText}
                    </button>
                )
            }
        </div>
    )
}

const Card = ({strong_card, strong_card_value, card_colors, instruction}) => {

    const card_props_li = {}, card_props_span = {};
    if (strong_card) {
        card_props_li.id = 'strong-card';
        // card_props_li.className = 'strong-card-hide';
        card_props_li.className = (strong_card && instruction) ? 'strong-card-show' : 'strong-card-hide';
        card_props_span.className = 'suit ' + ((strong_card && instruction) ? 'strong-card-show' : '');
        card_props_span.value = strong_card_value;
        // card_props_span.value = MULTIPLE*currentCardValue;
    }

    const a_props = {};
    if (card_colors) {
        a_props.style = {
            backgroundColor: convertRgb(card_colors.cb),
            borderColor: convertRgb(card_colors.cbo),
            color: strong_card? convertRgb(card_colors.s_txt) : convertRgb(card_colors.c_txt),
            bottom: (strong_card && instruction)? '4.2em' : '0'
        };
    }

    let a_tag_class_name = 'card back rank-9';
    if (strong_card && instruction)
        a_tag_class_name = a_tag_class_name.replace('back', '');

    return (
        <li {...card_props_li}>
            <a
                className={a_tag_class_name} href="/#"
                {...a_props}
            >
                <span {...card_props_span}/>
            </a>
        </li>
    )
};

const GameCards = ({currentCardValue, card_colors, ques_label, instruction}) => {
    const CARD_NUMBER = 9;
    useEffect(() => {
        // restartCards();
    }, []);
    return (
        <div
            className='sp-game-body'
        >
            <div className='playingCards rotateHand'>
                <ul className="hand">
                    {
                        new Array(CARD_NUMBER).fill('').map(
                            (card, card_i) => (
                                <Card
                                    instruction={instruction}
                                    key={card_i}
                                    card_colors={card_colors}
                                    strong_card={card_i === Math.floor(CARD_NUMBER/2)}
                                    strong_card_value={MULTIPLE*currentCardValue}
                                />
                            )
                        )
                    }
                </ul>
            </div>
            {
                <label style={{visibility: ques_label? 'visible' : 'hidden'}} className='sp-game-body-l'>What would you like to do?</label>
            }
        </div>
    )
}

const restartCards = () => {
    let current_card = 0;
    let max_cards = $('.hand li').length;
    if(!$('.hand li').hasClass('hide-me'))
        $('.hand li').addClass('hide-me');

    $("#strong-card").css('bottom', 0);

    if (!$("#strong-card a").hasClass('back'))
        $("#strong-card a").addClass('back');

    if (!$("#strong-card").hasClass('strong-card-hide'))
        $("#strong-card").addClass('strong-card-hide');


    if ($("#strong-card span").hasClass('strong-card-show'))
        $("#strong-card span").removeClass('strong-card-show');

    $(".sp-game-footer button").addClass('disabledElem');

    let cards_anim = setInterval(() => {
        $($('.hand li')[current_card]).removeClass('hide-me');
        current_card++;
        if (current_card === max_cards) {
            clearInterval(cards_anim);
            $("#strong-card").animate({
                bottom: "4.2em",
            }, 50, () => { //800
                $(".sp-game-footer button").removeClass('disabledElem');
                $("#strong-card a").removeClass('back');
                $("#strong-card").removeClass('strong-card-hide');
                $("#strong-card span").addClass('strong-card-show');
            });
        };
    }, GameSettings.cards_animation_timing/4);
}

class Messages extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            message: this.props.Message
        };

        this.Forward = this.props.Forward;
        this.Button = this.props.Button;

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.Message !== prevProps.Message) {
            this.setState({
                message: this.props.Message
            });

        }

    }

    render() {

        return (
            <div
                className='sp-message-mode'
            >
                {this.state.message}
                <button
                    style={{margin: 'auto'}}
                    onClick={() => this.Forward()}>{this.Button}</button>
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.Forward = this.props.Forward;

        this.game = this.game.bind(this);
        this.nextRound = this.nextRound.bind(this);
        this.chooseCard = this.chooseCard.bind(this);
        this.flipAnotherCard = this.flipAnotherCard.bind(this);
        this.message = this.message.bind(this);
        this.createNormallyDistributedValue = this.createNormallyDistributedValue.bind(this);
        this.getNextMean = this.getNextMean.bind(this);
        this.getNewCard = this.getNewCard.bind(this);
        this.initGameMean = this.initGameMean.bind(this);

        this.MaxRounds = this.props.Part === 'Practice'? 2 : GameSettings.Nrounds;
        this.MaxCards = this.props.Part === 'Practice'? 10 : GameSettings.Ncards;


        this.state = {
            Round: 1,
            Card: 1,
            no_action: false,
            before_x_message: false,
            mode: 'Game', // message
        };

        this.all_values = [];

        NewLogs({
            user_id: UserId,
            exp: ThisExperiment,
            running_name: RunningName,
            action: 'M.G',
            type: 'LogGameType',
            more_params: {
                part: this.props.Part,
                local_t: getTimeDate().time,
                local_d: getTimeDate().date,
            },
        }).then((res) => {});

        // MeanDis1_MeanDis2 MeanDis2_MeanDis1

        this.CurrentMean = 0;
        this.GameMean = [];

        this.initGameMean();
        this.GameMeanAll = [...this.GameMean];

        this.getNextMean();
        this.getNewCard();
    }

    initGameMean(){
        if (this.props.Part === 'Practice'){
            const order = PracticeMeanOrder.replace('MeanDis','').replace('MeanDis','').split('_');
            this.GameMean.push(['MeanDis'+order[0], 'StdDis'+order[0]]);
            this.GameMean.push(['MeanDis'+order[1], 'StdDis'+order[1]]);
            return;

        }

        let half1 = Math.floor(GameSettings.Nrounds / 2);
        let half2 = GameSettings.Nrounds - half1;

        if (GameSettings.condition === 'Mixed'){
            let all = [];
            for (let i=0; i<half1; i++)
                all.push(['MeanDis1', 'StdDis1']);
            for (let i=0; i<half2; i++)
                all.push(['MeanDis2', 'StdDis2']);

            while (all.length > 0){
                const rnd_index = Math.floor(Math.random() * all.length);
                this.GameMean.push(all[rnd_index]);
                all = all.filter((a, i_) => i_ !== rnd_index);
            }
        }
        else {
            if(GameSettings.condition === 'MeanDis1_MeanDis2'){
                for (let i=0; i<half1; i++)
                    this.GameMean.push(['MeanDis1', 'StdDis1']);
                for (let i=0; i<half2; i++)
                    this.GameMean.push(['MeanDis2', 'StdDis2']);
            }
            else {
                for (let i=0; i<half1; i++)
                    this.GameMean.push(['MeanDis2', 'StdDis2']);
                for (let i=0; i<half2; i++)
                    this.GameMean.push(['MeanDis1', 'StdDis1']);
            }
            // if(GameSettings.condition === 'MeanDis1_MeanDis2'){
            //     this.GameMean.push(['MeanDis1', 'StdDis1']);
            // }
            // else if (GameSettings.condition === 'MeanDis2_MeanDis1') {
            //     this.GameMean.push(['MeanDis2', 'StdDis2']);
            // }
            //
            //
            // // let half1_choose = null, half2_choose = null;
            // //
            // // for (let i=0; i<half1; i++){
            // //     if(GameSettings.condition === 'MeanDis1_MeanDis2'){
            // //         this.GameMean.push(['MeanDis1', 'StdDis1']);
            // //     }
            // //     else if (GameSettings.condition === 'MeanDis2_MeanDis1') {
            // //         this.GameMean.push(['MeanDis2', 'StdDis2']);
            // //     }
            // //     else {
            // //         if (GameSettings.condition === 'Random'){
            // //             if (half1_choose === null){
            // //                 let rnd_num = Math.floor(Math.random() * 2);
            // //                 if (rnd_num){
            // //                     half1_choose = ['MeanDis1', 'StdDis1'];
            // //                     half2_choose = ['MeanDis2', 'StdDis2'];
            // //                 }
            // //                 else {
            // //                     half1_choose = ['MeanDis2', 'StdDis2'];
            // //                     half2_choose = ['MeanDis1', 'StdDis1'];
            // //                 }
            // //             }
            // //             this.GameMean.push([...half1_choose]);
            // //         }
            // //         else { // Full Random
            // //             let rnd_num = Math.floor(Math.random() * 2) + 1;
            // //             this.GameMean.push(['MeanDis'+rnd_num, 'StdDis'+rnd_num]);
            // //         }
            // //     }
            // // }
            // //
            // // for (let i=0; i<half2; i++){
            // //     if(GameSettings.condition === 'MeanDis1_MeanDis2'){
            // //         this.GameMean.push(['MeanDis2', 'StdDis2']);
            // //     }
            // //     else if (GameSettings.condition === 'MeanDis2_MeanDis1') {
            // //         this.GameMean.push(['MeanDis1', 'StdDis1']);
            // //     }
            // //     else {
            // //         if (GameSettings.condition === 'Random'){
            // //             this.GameMean.push([...half2_choose]);
            // //         }
            // //         else { // Full Random
            // //             let rnd_num = Math.floor(Math.random() * 2) + 1;
            // //             this.GameMean.push(['MeanDis'+rnd_num, 'StdDis'+rnd_num])
            // //         }
            // //     }
            // // }
        }

    }

    componentDidMount() {
        restartCards();
    }

    getNextMean() {
        let next_index = 0;
        // if(GameSettings.condition === 'Random'){
        //     next_index = Math.floor(Math.random() * this.GameMean.length);
        // }
        this.nextMean = this.GameMean[next_index];
        this.GameMean = this.GameMean.filter((v, index) => index !== next_index);
    }

    createNormallyDistributedValue() {
        // game_settings.game['rDis' + mean]
        let mean_number = this.nextMean[0].replace('MeanDis', '');

        let range = GameSettings['rDis' + mean_number];

        let next_val;
        const mean = GameSettings[this.nextMean[0]];
        const dev = GameSettings[this.nextMean[1]];

        let error = false;
        let start_time = new Date();
        do {
            next_val = randomNormal({mean , dev});
            let diff = Math.round((new Date() - start_time)/1000);
            if (diff > 2 )
                error = true;
        }
        while ((next_val < range[0] || next_val > range[1]) && !error);

        this.currentCardValue = Math.round(next_val);

        if (DebugMode)
            this.all_values.push(this.currentCardValue);
    }

    getNewCard() {
        this.createNormallyDistributedValue();
        if (this.props.Part === 'Practice') return;

        let obj = {
            Round: this.state.Round,
            Card: this.state.Card,
            // Part: this.props.Part,
            Nrounds: GameSettings.Nrounds,
            Ncards: GameSettings.Ncards,
            Condition: IS_BLOCKED_CONDITION? 'Blocked' : GameSettings.condition,
            Order: GameSettings.condition,
            CardValue: this.currentCardValue,
            Mode: 1,
            CurrentMean: GameSettings[this.nextMean[0]],
            CurrentStd: GameSettings[this.nextMean[1]],
            Time: getTimeDate().time,
            ElapsedTimeMil: Date.now() - START_MIL
        };

        if (this.nextMean[0] === 'MeanDis1')
            Mean1Res[this.state.Round] = this.currentCardValue;
        if (this.nextMean[0] === 'MeanDis2')
            Mean2Res[this.state.Round] = this.currentCardValue;

        this.props.insertGameLine(obj);
    }

    flipAnotherCard(){
        let sc = this.state;
        if (this.props.Part === 'Practice' && (sc.Card === this.MaxCards)){
            return this.chooseCard();
            // $($('.sp-game-footer button')[1]).addClass('')
        }
        sc.Card++;
        this.getNewCard();

        this.setState(sc, () => {
            restartCards();
            if (this.props.Part !== 'Practice')
                if (this.state.Card === (GameSettings.Ncards - GameSettings.cards_beforeX)){
                    this.setState({before_x_message: true})
                }
        });
    }

    chooseCard(){
        if (this.props.Part !== 'Practice')
            this.props.chooseLastCard();
        let sc = this.state;
        if (sc.Round === this.MaxRounds){
            this.Forward();
            return;
        }

        sc.Round++;
        sc.Card = 1;
        if (DebugMode)
            this.all_values = [];
        if (this.props.Part !== 'Practice')
            sc.mode = 'Message';

        this.setState(sc, () => {
            if (this.props.Part === 'Practice')
                this.nextRound();
        });
    }

    nextRound(){
        this.getNextMean();
        this.getNewCard();

        let sc = this.state;
        sc.mode = 'Game';
        this.CurrentMean += 1;
        this.setState(sc, () => {
            restartCards();
        });
    }

    message() {
        return (
            <div
                className='sp-game-mode-message'
            >
                <label>This round is now over.</label>
                <label>For this deck, the card you chose is worth {MULTIPLE*this.currentCardValue} {this.currentCardValue === 1 ? 'point' : 'points'}</label>
                <button onClick={() => this.nextRound()}>Move to the next deck of cards</button>
            </div>
        )
    }

    game() {
        let flipClassName = '';
        if (this.props.Part !== 'Practice' && (this.state.Card === this.MaxCards) )
            flipClassName = 'sp-dis-bt';
        let flipButtonText = <>Flip <b>another</b> card</>;
        if (this.props.Part === 'Practice' && (this.state.Card === this.MaxCards))
            flipButtonText = 'Continue';

        return (
            <div
                className='sp-game-mode-game'
            >
                <GameHeader
                    Card={this.state.Card}
                    Ncards={this.MaxCards}
                    Round={this.state.Round}
                    Nrounds={this.MaxRounds}
                    nextMean={this.nextMean}
                    texts_colors={GameSettings.MeansColors[this.nextMean[0]]}
                />
                <GameCards
                    card_colors={GameSettings.MeansColors[this.nextMean[0]]}
                    // card_colors={GameSettings.mode === 'Gains-Practice' ? GameSettings.MeansColors[this.nextMean[0]] : null}
                    currentCardValue={this.currentCardValue}
                    ques_label={GameSettings.mode !== 'Gains-Practice'}
                />

                <GameButtons
                    flipClassName={flipClassName}
                    choose_card={this.props.Part !== 'Practice'}
                    chooseCard={this.chooseCard}
                    flip_card={true}
                    flipAnotherCard={(this.props.Part !== 'Practice' && (this.state.Card === this.MaxCards))? () => {} : this.flipAnotherCard}
                    flipButtonText={flipButtonText}
                />
            </div>
        )
    }

    render() {
        return (
            <>
                <div
                    className='sp-game-mode'
                >
                    {
                        this.state.mode === 'Message' ? this.message() : this.game()
                    }

                    {
                        this.state.before_x_message && (
                            <div
                                className='sp-before_x-message'
                            >
                                <div>
                                    <label>You have more {GameSettings.cards_beforeX} cards.</label>
                                    <button onClick={() => this.setState({before_x_message: false})}>OK</button>
                                </div>
                            </div>
                        )
                    }
                </div>
                {
                    DebugMode && (
                        <DebuggerModalView>
                            <div className='meta_debug'>
                                <label>Condition:<span>{GameSettings.condition}</span></label>
                                <label>Mean:<span>{this.nextMean[0]}</span></label>
                                <label>Std:<span>{this.nextMean[1]}</span></label>
                                <label>MeanDis1:<span>{GameSettings.MeanDis1}</span></label>
                                <label>StdDis1:<span>{GameSettings.StdDis1}</span></label>
                                <label>rDis1:<span>[{GameSettings.rDis1[0]}, {GameSettings.rDis1[1]}]</span></label>
                                <label>MeanDis2:<span>{GameSettings.MeanDis2}</span></label>
                                <label>StdDis2:<span>{GameSettings.StdDis2}</span></label>
                                <label>rDis2:<span>[{GameSettings.rDis2[0]}, {GameSettings.rDis2[1]}]</span></label>

                                <div
                                    style={{marginTop: 10, marginBottom: 10}}
                                >
                                    <label><span style={{color: 'blue', marginTop: 10}}>All Round Values:</span></label>
                                    {
                                        this.all_values.map(
                                            (val, index) => (
                                                <label style={{color: '#16ffff'}} key={'l'+index}>{val}</label>
                                            )
                                        )
                                    }
                                </div>

                                <div>
                                    <label><span style={{color: 'blue', marginTop: 10}}>Game order:</span></label>
                                    {
                                        this.GameMeanAll.map(
                                            (val, index) => (
                                                <label
                                                    style={{color: this.CurrentMean === index ? '#16ffff' : '#2c0588'}}
                                                    key={'l'+index}
                                                >{val[0]}</label>
                                            )
                                        )
                                    }
                                </div>
                            </div>
                        </DebuggerModalView>
                    )
                }
            </>
        )
    }
}

const nfc_ques = [
    'I prefer complex to simple problems.',
    'I like to have the responsibility of handling a situation that requires a lot of thinking.',
    'Thinking is not my idea of fun.',
    'I would rather do something that requires little thought than something that is sure to challenge my thinking abilities',
    'I try to anticipate and avoid situations where there is a likely chance I will have to think in depth about something',
    'I find satisfaction in deliberating hard and for long hours.',
    'I only think as hard as I have to.',
    'I prefer to think about small daily projects to long term ones.',
    'I like tasks that require little thought once I’ve learned them.',
    'The idea of relying on thought to make my way to the top appeals to me.',
    'I really enjoy a task that involves coming up with new solutions to problems.',
    'Learning new ways to think doesn’t excite me very much.',
    'I prefer my life to be filled with puzzles I must solve.',
    'The notion of thinking abstractly is appealing to me.',
    'I would prefer a task that is intellectual, difficult, and important to one that is somewhat important but does not require much thought.',
    'I feel relief rather than satisfaction after completing a task that requires a lot of mental effort.',
    'It’s enough for me that something gets the job done; I don’t care how or why it works.',
    'I usually end up deliberating about issues even when they do not affect me personally.',
];

const nfc_item_type = [1, 1, -1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, 1, 1, -1, -1, 1];

const nfc_ques_points = [-3, -2, -1, 0, 1, 2, 3];

const QuesAnswerSelect = ({q_index, onChange}) => {
    return (
        <div
            className='sp-ques-bar'
        >
            <table>
                <thead>
                <tr>
                    <th><u>Extremely uncharacteristic of me</u></th>
                    <th><u></u></th>
                    <th><u></u></th>
                    <th><u>Uncertain</u></th>
                    <th><u></u></th>
                    <th><u></u></th>
                    <th><u>Extremely characteristic of me</u></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    {
                        nfc_ques_points.map(
                            point => (
                                <td key={'td' + point}>{point}</td>
                            )
                        )
                    }
                </tr>
                <tr>
                    {
                        nfc_ques_points.map(
                            point => (
                                <td
                                    key={'td*' + point}
                                >
                                    <input
                                        name={q_index !== null ? q_index : 'msg'}
                                        key={'input*' + point}
                                        type="radio"
                                        value={point}
                                        style={{textAlign: 'center'}}
                                        onChange={onChange?() => onChange(q_index, point) : undefined}
                                    />
                                </td>
                            )
                        )
                    }
                </tr>
                </tbody>
            </table>
        </div>
    )
}

const Ques = ({q, q_index, onChange}) => {
    return (
        <div
            className='sp-que'
        >
            <label>{!isNaN(q_index)?`${q_index+1}. ` : ''}{q}</label>
            <QuesAnswerSelect onChange={onChange} q_index={q_index}/>
        </div>
    )
}

const QuesNFC = ({Forward}) => {
    const [quesAnswers, setQuesAnswers] = useState(null);
    useEffect(() => {
        let ques_answers = (new Array(nfc_ques.length)).fill(null);
        setQuesAnswers([...ques_answers]);
        NFC_ANSWERS = [...ques_answers];
        if (isDevUser()){
            // for (let i=0; i<nfc_ques.length; i++){
            //     NFC_ANSWERS[i] = 0;
            //     // setQuesAnswers([...NFC_ANSWERS]);
            // }
            // Forward();
        }
    }, []);

    const onChange = (q_index, value) => {
        NFC_ANSWERS[q_index] = value;
        setQuesAnswers([...NFC_ANSWERS]);
    }

    let disableBtn = false;
    if (quesAnswers === null)
        return <></>;

    for (let i=0; i<quesAnswers.length; i++)
        if (quesAnswers[i] === null){
            disableBtn = true;
            break;
        }

    return (
        <div className='sp-nfc-ques'>
            {
                nfc_ques.map(
                    (q, q_index) => (
                        <Ques
                            key={q_index}
                            q={q}
                            q_index={q_index}
                            onChange={onChange}
                        />
                    )
                )
            }
            <button
                className={disableBtn? 'disabledElem' : ''}
                onClick={disableBtn? undefined : Forward}
            >Next</button>

        </div>
    )
}

const InstructionsNFC = ({Forward}) => {

    return (
        <div className='sp-nfc-inst'>
            <label>For each of the statements, please indicate whether or not the statement is characteristic of you or of what you believe, on a scale of -3 (not at all like you) to 3 (very much like you). </label>
            <label>For example,</label>
            <ul className="sp-nfc-ul">
                <li>If the statement is extremely uncharacteristic of you or of what you believe about yourself (not at all like you) please choose "-3".</li>
                <li>If the statement is extremely characteristic of you or of what you believe about yourself (very much like you) please choose "3" .</li>
            </ul>
            <div
                className='sp-nfc-msg-ques '
            >
                <Ques
                    q='You should use the following scale as you rate each of the statements below.'
                    q_index={null}
                />
                <button onClick={Forward}>Next</button>
            </div>
        </div>
    )
}

class Start extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        ResetAll();

        START_MIL = Date.now();

        GameSettings.Nrounds = Number(props.game_settings.game.Nrounds);
        GameSettings.Ncards = Number(props.game_settings.game.Ncards);
        // GameSettings.NumberOfPointsY = Number(props.game_settings.game.NumberOfPointsY);
        GameSettings.cards_beforeX = Number(props.game_settings.game.cards_beforeX);
        GameSettings.MeanDis1 = Number(props.game_settings.game.MeanDis1);
        GameSettings.StdDis1 = Number(props.game_settings.game.StdDis1);
        GameSettings.MeanDis2 = Number(props.game_settings.game.MeanDis2);
        GameSettings.StdDis2 = Number(props.game_settings.game.StdDis2);
        GameSettings.condition = props.game_settings.game.condition;
        GameSettings.rDis1 = props.game_settings.game.rDis1;
        GameSettings.rDis2 = props.game_settings.game.rDis2;
        GameSettings.ud = props.game_settings.game.ud;
        GameSettings.mode = props.game_settings.game.mode;
        GameSettings.StartPoints = Number(props.game_settings.game.s_p);
        GameSettings.cards_animation_timing = Number(props.game_settings.game.c_a_t);

        // MeanDis1_C
        // MeanDis1_SC
        // MeanDis1_TC
        // MeanDis1_BC
        // GameSettings.MeanDis1_Color = props.game_settings.game.MeanDis1_C;
        // GameSettings.MeansColors = props.game_settings.game.colors;

        PaymentsSettings = props.game_settings.payments;

        UserId = props.user_id;
        RunningName = props.running_name;
        DebugMode = props.dmr;

        let RunCounter = KeyTableID();

        GameSettings.StartPoints = GameSettings.StartPoints || 0;

        GameSettings.MeansColors = props.game_settings.game.colors;

        if (GameSettings.mode === 'l') {
            GameSettings.mode = 'Losses';
            MULTIPLE = -1;
        }
        else if (GameSettings.mode === 'g')
            GameSettings.mode = 'Gains';
        else if (GameSettings.mode === 'g2') {
            GameSettings.mode = 'Gains-full description';
            GameSettings.HigherMean = GameSettings.MeanDis1 > GameSettings.MeanDis2? 'MeanDis1' : 'MeanDis2';
        }
        else if (GameSettings.mode === 'gp') {
            GameSettings.mode = 'Gains-Practice';
            GameSettings.HigherMean = GameSettings.MeanDis1 > GameSettings.MeanDis2? 'MeanDis1' : 'MeanDis2';
            PracticeMeanOrder = RunCounter%2?'MeanDis1_MeanDis2':'MeanDis2_MeanDis1';
        }

        if (GameSettings.ud === 'Yes'){
            let Conditions = ['Blocked', 'Mixed'];
            // let Conditions = ['Mixed', 'MeanDis1_MeanDis2', 'MeanDis2_MeanDis1'];
            GameSettings.condition = Conditions[RunCounter%2];
        }

        if (GameSettings.condition === 'Blocked'){
            IS_BLOCKED_CONDITION = true;
            let Conditions = ['MeanDis1_MeanDis2', 'MeanDis2_MeanDis1'];
            if (GameSettings.ud === 'Yes') {
                GameSettings.condition = Conditions[(RunCounter / 2) % 2];
            }
            else
                GameSettings.condition = Conditions[RunCounter%2];
        }
        else {
            IS_BLOCKED_CONDITION = false;
        }

        this.state = {
            tasks_index: 0,
            isa: props.isa,
            isLoading: true,
        };

        this.tasks = ['Demo', 'Game'];

        this.game_template = null;

        this.initializeGame();

        this.props.SetLimitedTime(false);

        this.Forward = this.Forward.bind(this);

    }

    initializeGame() {

        let game_template = [];

        game_template.push({
            Mode: 'Message',
            Message: () => GameWelcome(this.props.insertTextInput),
            Button: 'Continue'
        });

        if (GameSettings.mode === 'Gains-full description'){
            game_template.push({
                Mode: 'Message',
                Message: Gains2Screen2,
                Button: 'Continue'
            });
            game_template.push({
                Mode: 'Message',
                Message: () => GameGainsWelcome2(),
                Button: 'Continue',
            });
        }
        else if (GameSettings.mode === 'Gains-Practice'){
            // game_template.push({
            //     Mode: 'Message',
            //     Message: GainsPracticeScreen2,
            //     Button: 'Continue'
            // });

            game_template.push({
                Mode: 'Game',
                Part: 'Practice'
            });

            game_template.push({
                Mode: 'Message',
                Message: () => GamePracticeGainsWelcome2(this.props.insertTextInput),
                Button: 'Continue',
            });

            game_template.push({
                Mode: 'Message',
                Message: () => GamePractice4(),
                Button: 'Continue',
            });
        }
        else {
            game_template.push({
                Mode: 'Message',
                Message: () => GameWelcome2(),
                Button: 'Start game',
            });
        }

        if (GameSettings.mode === 'Gains-full description'){
            game_template.push({
                Mode: 'QuestionsPage',
                Message: QuestionsPage,
                Button: 'Continue'
            });
        }

        game_template.push({
            Mode: 'Game',
            Part: 'Real'
        });

        game_template.push({
            Mode: 'Attention',
        });

        game_template.push({
            Mode: 'Message',
            Message: () => EndCardsGameMsg(),
            Button: 'Next'
        });

        game_template.push({
            Mode: 'InstructionsNFC',
        });

        game_template.push({
            Mode: 'QuesNFC',
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
                local_t: getTimeDate().time,
                local_d: getTimeDate().date,
            },
        }).then((res) => this.setState({isLoading: false}));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isa !== this.props.isa){
            let sc = this.state;
            sc.isa = this.props.isa;
            this.setState(sc);
        }
    }

    Forward(){
        let sc = this.state;
        if (sc.tasks_index === (this.game_template.length-1)){
            this.props.SetLimitedTime(false);
            if (PracticeMeanOrder)
                this.props.insertTextInput('PracticeOrder', PracticeMeanOrder);
            // const mean1_index = Math.floor(Math.random() * Object.keys(Mean1Res).length)
            // const mean2_index = Math.floor(Math.random() * Object.keys(Mean2Res).length)
            // const mean1_val = Mean1Res[Object.keys(Mean1Res)[mean1_index]];
            // const mean2_val = Mean2Res[Object.keys(Mean2Res)[mean2_index]];

            const mean1_res = [], mean2_res = [];

            let mean1_sum = 0, mean2_sum = 0;
            for (let key in Mean1Res) {
                mean1_sum += Mean1Res[key];
                mean1_res.push(Mean1Res[key]);
            }

            for (let key in Mean2Res) {
                mean2_sum += Mean2Res[key];
                mean2_res.push(Mean2Res[key]);
            }

            const mean1_count = Object.keys(Mean1Res).length || 1;
            const mean2_count = Object.keys(Mean2Res).length || 1;

            let mean1_average = Math.floor((mean1_sum / mean1_count)*1000)/1000;
            let mean2_average = Math.floor((mean2_sum / mean2_count)*1000)/1000;

            const m1_m2_sum = MULTIPLE*(mean1_average + mean2_average);

            /// Losses
            const m1_m2_sum_average = m1_m2_sum/(GameSettings.mode !== 'Losses'? 1 : 2);

            const means_dis_sum = GameSettings.MeanDis1 + GameSettings.MeanDis2;
            let points = m1_m2_sum_average + AttentionPoints;
            if (GameSettings.mode !== 'Losses'){
                points -= means_dis_sum;
            }
            else {
                points += (GameSettings.StartPoints);
            }
            const final_points = Math.floor((points / PaymentsSettings.exchange_ratio)*1000)/1000;

            let ques_sum = 0;
            let nfc_line = {};

            for (let i=0; i<NFC_ANSWERS.length; i++){
                ques_sum = ques_sum + (NFC_ANSWERS[i] * nfc_item_type[i]);
                nfc_line['q'+(i+1)] = NFC_ANSWERS[i];
            }

            const current_time = getTimeDate();
            NewLogs({
                user_id: UserId,
                exp: ThisExperiment,
                running_name: RunningName,
                action: 'G.E',
                type: 'LogGameType',
                more_params: {
                    local_t: current_time.time,
                    local_d: current_time.date,
                },
            }).then((res) => {});

            const results = {
                mean1_sum,
                mean2_sum,
                mean1_count,
                mean2_count,
                mean1_average,
                mean2_average,
                m1_m2_sum,
                m1_m2_sum_average,
                means_dis_sum,
                start_points: GameSettings.StartPoints,
                bonus_attention: AttentionPoints,
                points,
                final_points,
            };

            this.props.insertPayment({
                sign_of_reward: PaymentsSettings.sign_of_reward,
                show_up_fee: PaymentsSettings.show_up_fee,
                exchange_ratio: PaymentsSettings.exchange_ratio,
                bonus_endowment: PaymentsSettings.bonus_endowment,
                mode: GameSettings.mode,
                ...results,
                Time: current_time.time,
                Date: current_time.date,
            });

            nfc_line = {
                ...nfc_line,
                mean1_average,
                mean2_average,
                ques_sum,
                points,
                final_points,
            }

            this.props.insertLineCustomTable('NFC', nfc_line, 'object');
            sc.isLoading = true;

            let debug_args = null;

            if (DebugMode)
                debug_args = {...results, mean1_res, mean2_res};

            this.props.insertGameArray(AllRecords);
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
                        this.props.callbackFunction('FinishGame', {need_summary: true, args: debug_args});
                    }
                );
            });
        }
        else {
            sc.tasks_index++;
            if (this.game_template[sc.tasks_index].Mode === 'Game')
                this.props.SetLimitedTime(true);
        }
        this.setState(sc);
    }

    insertGameLine(line){
        AllRecords.push(line);
    }

    chooseLastCard(){
        AllRecords[AllRecords.length-1].Mode = 2;
    }

    render() {
        if (!this.state || this.state.isLoading || !Array.isArray(this.game_template)) {
            return <WaitForAction2/>;
        }

        return (
            <div
                className='sp-start-panel'
            >
                {this.game_template[this.state.tasks_index].Mode === 'Message' && (
                    <Messages
                        Message={this.game_template[this.state.tasks_index].Message()}
                        Button={this.game_template[this.state.tasks_index].Button}
                        Forward={this.Forward}
                    />
                )}

                {this.game_template[this.state.tasks_index].Mode === 'QuestionsPage' && (
                    <QuestionsPage
                        insertTextInput={this.props.insertTextInput}
                        Forward={this.Forward}
                    />
                )}

                {this.game_template[this.state.tasks_index].Mode === 'Game' && (
                    <Game
                        Forward={this.Forward}
                        insertGameLine={this.insertGameLine}
                        chooseLastCard={this.chooseLastCard}
                        Part={this.game_template[this.state.tasks_index].Part}
                    />
                )}

                {this.game_template[this.state.tasks_index].Mode === 'Attention' && (
                    <Attention
                        Forward={this.Forward}
                        insertTextInput={this.props.insertTextInput}
                    />
                )}

                {this.game_template[this.state.tasks_index].Mode === 'InstructionsNFC' && (
                    <InstructionsNFC
                        Forward={this.Forward}
                    />
                )}

                {this.game_template[this.state.tasks_index].Mode === 'QuesNFC' && (
                    <QuesNFC
                        Forward={this.Forward}
                    />
                )}
            </div>
        );
    }
}

Start.propTypes = {
    game_settings: PropTypes.object,
};

export default Start;


//////////////////////  Messages  //////////////////////

const GainsModeTextS1 = () => {
    return (
        <>
            <label>
                In this study, you will play a game where your goal is to collect as many points as possible.
            </label>

            <label>
                The game is played for {GameSettings.Nrounds} rounds. In each round you will get a shuffled deck of cards and will be asked to choose one card out of that deck.
            </label>

            <label>
                Each card has a numerical value written on it representing how many points it is worth. In the space for comments below, please type in the word "next" (in all capital letters) – this is to ensure that you read the current instructions.
            </label>

            {
                GameSettings.mode === 'Gains' && (
                    <label>
                        Your bonus will depend on the values of the cards you choose. That is, the higher the values of the cards you choose, the higher the chances to receive a larger bonus.
                    </label>
                )
            }

            <label>
                The game proceeds as follows:
            </label>

            <label>
                In each round, a shuffled deck will be presented on the screen, with only the top card revealed.
            </label>

            <label>
                You will have to decide whether to choose the current card or discard it and move on to the next card to continue searching for a higher value card in that deck.
            </label>

            <label>
                Clicking the "Choose this card" button will save the value you chose and proceed to the next round with a new deck.
            </label>

            <label>
                Clicking the "flip another card" button will discard the current card and reveal the next card in the deck. <b>Important!</b> you cannot go back to previously discarded cards and only one card can be chosen out of each deck.
            </label>

        </>
    )

}

const PracticeGainsModeTextS1 = () => {
    return (
        <label>
            In this study, you will play a game where your goal is to collect as many points as possible.<br/>
            Before we proceed to the real game and explain the instructions,<br/>
            you will have a short practice in which you will sample 10 cards from 2 decks.<br/>
            The decks in the practice rounds resemble the decks that will appear in the game.<br/>
            The following practice is important to enable you to maximize your bonus later in the game.<br/>

        </label>
    )

}

const LossesModeTextS1 = () => {
    return (
        <>
            <label>
                In this study, you will play a game where your goal is to minimize your losses.
            </label>

            <label>
                At the beginning of the game, you will get {GameSettings.StartPoints} points.
            </label>

            <label>
                The game is played for {GameSettings.Nrounds} rounds. In each round you will get a shuffled deck of cards and will be asked to choose one card out of that deck.
            </label>

            <label>
                Each card has a numerical value written on it representing how many points you would lose if you chose it. In the space for comments below, please type in the word "next" (in all capital letters) – this is to ensure that you read the current instructions.
            </label>

            <label>
                <b>Your bonus will depend on the values of the cards you choose. That is, the higher the values of the cards you choose, the higher the chances to receive a larger bonus.</b>
            </label>

            <label>
                <b>For example, -2 is higher than -4. Meaning, if you choose -2 you will lose 2 points of your initial points, if you choose -4 you will lose 4 points.</b>
            </label>

            <label>
                The bonus will be calculated based on the points you got in the beginning of the game, minus the average of the values you chose and converted at an exchange rate.
            </label>

            <label>
                The game proceeds as follows:
            </label>

            <label>
                In each round, a shuffled deck will be presented on the screen, with only the top card revealed.
            </label>

            <label>
                You will have to decide whether to choose the current card or discard it and move on to the next card to continue searching for a higher value card in that deck.
            </label>

            <label>
                Clicking the "Choose this card" button will save the value you chose and proceed to the next round with a new deck.
            </label>

            <label>
                Clicking the "flip another card" button will discard the current card and reveal the next card in the deck. <b>Important!</b> you cannot go back to previously discarded cards and only one card can be chosen out of each deck.
            </label>

        </>
    )

}

const GameWelcome = (insertTextInput) => {

    return (
        <div
            className=''
        >
            <label style={{fontSize: 'larger', fontWeight: 'bold', textDecoration: 'underline'}}>Welcome to the cards game!</label>

            {GameSettings.mode === 'Losses' ? <LossesModeTextS1 /> : GameSettings.mode === 'Gains-Practice' ? <PracticeGainsModeTextS1 /> : <GainsModeTextS1 />}
            {/*{GameSettings.mode === 'Gains-Practice' && (*/}
            {/*    <label>*/}
            {/*        In the following screen, you will have an opportunity to sample cards from two decks that resemble the decks that will appear in the game.<br/>*/}
            {/*        At this stage, you will be able to flip cards, but not to choose any card.*/}
            {/*    </label>*/}
            {/*)}*/}
            {
                GameSettings.mode !== 'Gains-Practice' && (
                  <div className='sp-m-com'>
                      <label><u>Comments:</u></label>
                      <textarea onChange={e => insertTextInput('TextInput', e.target.value)}/>
                  </div>
                )
            }
        </div>
    )
};

const GameWelcome2 = () => {
    return (
        <div
            className=''
        >
            <label>
                Each deck contains {GameSettings.Ncards} cards so you can only flip over a maximum of {GameSettings.Ncards} cards per deck.
                <br/>
                Accordingly, if you have reached the {GameSettings.Ncards-1}th card and decided not to choose it,
                the next card (the {GameSettings.Ncards}th card) will be chosen for you automatically, regardless of its value.
                <br/>
                You will receive an on-screen notification before you reach the last two cards in a deck.
                <br/>
                After you have finished the cards game, you will be required to fill out a form.
                <br/>
                Instructions for the form will appear following the game.
            </label>
        </div>
    )
};

const GamePractice4 = () => {
    return (
        <div
            className=''
        >
            <label>
                In the game, each deck contains {GameSettings.Ncards} cards so you can only flip over a maximum of {GameSettings.Ncards} cards per deck.<br/>
                Accordingly, if you have reached the {GameSettings.Ncards-1}th card and decided not to choose it (clicked the "flip another card" button), the next card (the {GameSettings.Ncards} card) will be chosen for you automatically, regardless of its value.<br/>
                You will receive an on-screen notification before you reach the last two cards in a deck.<br/>
                Your bonus will depend on the values of the cards you chose - that is, the higher the values of the cards you choose, the higher the chances to receive a larger bonus (conversion rate: {PaymentsSettings.exchange_ratio} point{PaymentsSettings.exchange_ratio !== 1 ? 's' : ''} to {PaymentsSettings.sign_of_reward}1).<br/>
                After you have finished the cards game, you will be required to fill out a form.<br/>
                Instructions for the form will appear following the game.<br/>
            </label>
        </div>
    )
};

const GamePracticeGainsWelcome2 = (insertTextInput) => {

    return (
      <div
        className=''
      >
          <label>
              The game is played for {GameSettings.Nrounds} rounds.<br/>
              In each round you will get a shuffled deck of cards and will be asked to choose one card out of that deck.<br/>
              Each card has a numerical value written on it representing how many points it is worth. In the space for comments below, please type in the word "next" (in all capital letters) – this is to ensure that you read the current instructions.<br/>
              The game proceeds as follows:<br/>
              In each round, a shuffled deck will be presented on the screen, with only the top card revealed.<br/>
              You will have to decide whether to choose the current card or discard it and move to the next card to continue searching for a higher card in that deck.<br/>
              Clicking the "choose this card" button will save the value you chose and proceed to the next round with a new deck.<br/>
              Clicking the "flip another card" button will discard the current card and reveal the next card in the deck.<br/>
              Important! you cannot go back to previously seen cards and only one card can be chosen out of each deck.

          </label>

          <div className='sp-m-com'>
              <label><u>Comments:</u></label>
              <textarea onChange={e => insertTextInput('TextInput', e.target.value)}/>
          </div>
      </div>
    )
};

const GameGainsWelcome2 = () => {
    return (
        <div
            className=''
        >
            <label>
                {GameSettings.mode === 'Gains-Practice' ? 'In the game, each ' : 'Each '}deck contains {GameSettings.Ncards} cards so you can only flip over a maximum of {GameSettings.Ncards} cards per deck.
                <br/>
                Accordingly, if you have reached the {GameSettings.Ncards-1}th card and decided not to choose it (clicked the "flip another card" button),
                the next card (the {GameSettings.Ncards}th card) will be chosen for you automatically, regardless of its value.
                <br/>
                You will receive an on-screen notification before you reach the last two cards in a deck.
                <br/>
                Your bonus will depend on the values of the cards you chose - that is, the higher the values of the cards you choose, the higher the chances to receive a larger bonus (conversion rate: {PaymentsSettings.exchange_ratio} point{PaymentsSettings.exchange_ratio !== 1 ? 's' : ''} to {PaymentsSettings.sign_of_reward}1).
                <br/>
                After you have finished the cards game, you will be required to fill out a form.
                <br/>
                Instructions for the form will appear following the game.
            </label>
        </div>
    )
};

const Gains2Screen2 = () => {
    return (
        <div
            className=''
        >
            <label>
                There are two types of decks from which the cards will be drawn – low-value cards decks, and high-value cards decks.
                <br/>
                Cards from both decks are drawn based on a normal distribution, a distribution that is symmetrical relative to its average.
                <br/>
                In the image below, you can see the two distributions of card values, where green distribution represents the decks with low-value cards (average of 500
                points) and the blue distribution represents the decks with high-value cards (average of 5000 points).
                <br/>
            </label>
            <img
                style={{
                    width: '100%'
                }}
                alt='graph'
                src={graph_img}
            />
            <label>
                Both deck types have the same standard deviation of 200.
                <br/>
                Both deck types are concatenated, such that both have a range of exactly 1000.                <br/>
                <br/>
                <br/>
                The low decks have a minimum value of 0 and a maximum of value of 1000.<br/>
                The high decks have a minimum value of 4500 and a maximum value of 5500.<br/>
                In normal distributions, most possible numbers cluster toward the average, while the rest taper off symmetrically toward either extreme.<br/>
                In other words, while playing the game, there is a higher probability of seeing a card that is close to the average (for low decks most values will be between 300 to 700; for high decks most values will be between 4800 to 5200), than seeing a card that is further from the average on both sides (for low decks: lower than 300 or higher than 700; for high decks: lower than 4800 or higher than 5200).
            </label>
        </div>
    )
};

const PracticeCards = ({nextMean, chooseCard, flip_card}) => {
    return (
        <div
            className='sp_practice-s2-cards'
        >
            <GameHeader
                Card={1}
                Ncards={10}
                Round={1}
                Nrounds={2}
                nextMean={nextMean}
            />
            <GameCards
                card_colors={GameSettings.MeansColors[nextMean]}
                currentCardValue={9999}
                instruction={true}
            />
            <GameButtons
                choose_card={chooseCard}
                flip_card={flip_card}
                chooseCard={() => {}}
                flipAnotherCard={() => {}}
                flipButtonText={<>Flip <b>another</b> card</>}
            />
        </div>
    )
}

const PracticeCardsMeanDis = ({nextMean}) => {
    return (
        <div
            className='sp_practice-s2-md'
        >
            <PracticeCards flip_card={true} nextMean={nextMean}/>
            <svg
                viewBox="0 0 256 256"
                height='100%'
                width='100px'
            >
                <rect width="256" height="256" fill="none"></rect>
                <path fill="green" d="M32,136l96,96,96-96H176V48a8,8,0,0,0-8-8H88a8,8,0,0,0-8,8v88Z" opacity="1"></path>
                <path fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M32,136l96,96,96-96H176V48a8,8,0,0,0-8-8H88a8,8,0,0,0-8,8v88Z"></path>
            </svg>
            <PracticeCards chooseCard={true} nextMean={nextMean}/>
        </div>
    )
}

const GainsPracticeScreen2 = () => {
    return (
        <div
            className='sp-practice-s2'
        >
            <PracticeCardsMeanDis nextMean='MeanDis1'/>
            <PracticeCardsMeanDis nextMean='MeanDis2'/>
        </div>
    )
};

const EndCardsGameMsg = () => {
    return (
        <div>
            <label><b>Congratulations!</b></label>
            <label>You have finished the cards game!</label>
            <label>
                You will now proceed to fill out a form.
            </label>
        </div>
    )
};

const QuestionsPage = ({Forward, insertTextInput}) => {
    const [answer, setAnswer] = useState(null);
    const [nextQuestion, setNextQuestion] = useState(0);

    const questions = useRef([
        {
            question: 'The cards in the game will be drawn from low-value decks and high-value decks.',
            correct: 'True',
            buttons: ['True', 'False'],
            TrueMsg: () => (
                <p>
                    The cards in the game can either be drawn from
                    a high-value deck or from a low-value deck.
                </p>
            ),
            FalseMsg: () => (
                <p>
                    Notice that the cards in the game can either be
                    drawn from a high-value deck or from a low-value deck.
                </p>
            ),
        },
        {
            question: 'Can the same value appear in both distributions?',
            correct: 'No',
            buttons: ['Yes', 'No'],
            TrueMsg: () => (
                <p>
                    The ranges of values in the decks do not overlap.<br/>
                    Range of low-value deck is 0 – 1000<br/>
                    Range of high-value deck is 4500 – 5500
                </p>
            ),
            FalseMsg: () => (
                <p>
                    Notice that the distributions are separated,
                    and the ranges of values in the decks do not
                    overlap.<br/>
                    Range of low-value deck is 0 – 1000<br/>
                    Range of high-value deck is 4500 – 5500
                </p>
            ),
        },
        {
            question: 'The bonus will depend on the values of the cards you choose in each deck.',
            correct: 'True',
            buttons: ['True', 'False'],
            TrueMsg: () => (
                <p>
                    Indeed, the higher the value on the cards you
                    choose – the higher your bonus payment will be.
                </p>
            ),
            FalseMsg: () => (
                <p>
                    Notice that the higher the value on the cards you
                    choose – the higher your bonus payment will be.
                </p>
            ),
        },
    ]);

    const continueCB = () => {
        if (nextQuestion === (questions.current.length-1)) {
            setAnswer(null);
            setNextQuestion(-1);
            return Forward();
        }
        setAnswer(null);
        setNextQuestion(nextQuestion+1);
    }
    const buttonsCB = (answer) => {
        setAnswer(answer);
        insertTextInput(`q${nextQuestion+1}`, ['Yes', 'True'].indexOf(answer)>-1? 1 : 0)
    }

    if (nextQuestion === -1)
        return <></>;

    const CurrentQuestion = questions.current[nextQuestion];

    const isCorrectAnswer = answer === CurrentQuestion.correct;

    return (
        <div className='sp_ques_step'>
            <div className='sp_ques_step_h'>
                <label>{CurrentQuestion.question}</label>
                <div className='sp_ques_step_h_b'>
                    {
                        CurrentQuestion.buttons.map(
                            (button_, button_i) => (
                                <button style={{color: 'white', backgroundColor: button_i?'rgb(255,0,0)':'rgb(19,180,19)', borderColor: button_i?'rgb(108,0,0)':'rgb(1,86,1)'}} key={button_} onClick={() => buttonsCB(button_)}>{button_}</button>
                            )
                        )
                    }
                </div>
            </div>

            <div className='sp_ques_step_a' style={{visibility: answer === null?'hidden':'visible'}}>
                {
                    answer !== null && (
                        <>
                            <label>{isCorrectAnswer? 'You’re right!' : 'Wrong!'}</label>

                            {isCorrectAnswer? CurrentQuestion.TrueMsg() : CurrentQuestion.FalseMsg()}
                        </>
                    )
                }
            </div>

            <div className='sp_ques_step_cb'>
                {
                    answer !== null && (
                        <button
                            onClick={continueCB}
                        >
                            Continue
                        </button>
                    )
                }
            </div>
        </div>
    )
}

const Attention = ({Forward, insertTextInput}) => {

    const buttons = ['A', 'B', 'C', 'D', 'E'];
    const points = {
        A: 1,
        B: -2,
        C: -12,
        D: 12,
        E: 5,
    };

    return (
        <div className='sp-att'>
            <div className='sp-att-h'>
                <label>Congratulations, the cards game is now over!</label>
                <label>You have an opportunity to win extra points:</label>
            </div>
            <div className='sp-att-h2'>
                <label>If you choose <b>A</b>, you will earn 1 point</label>
                <label>If you choose <b>B</b>, you will lose 2 point</label>
                <label>If you choose <b>C</b>, you will lose 12 point</label>
                <label>If you choose <b>D</b>, you will earn 12 point</label>
                <label>If you choose <b>E</b>, you will earn 5 point</label>
            </div>
            <label>Please choose:</label>
            <div className='sp-bg'>
                {
                    buttons.map(
                        btn => (
                            <button
                                key={btn}
                                onClick={() => {
                                    insertTextInput('Attention', btn);
                                    AttentionPoints = points[btn];
                                    Forward();
                                }}
                            >{btn}</button>
                        )
                    )
                }
            </div>

            {/*<button className='sp-bf' onClick={() => Forward}>Continue</button>*/}
        </div>
    )
}

//////////////////////  Messages  //////////////////////


const graph_img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB88AAAF5CAYAAAARXmsAAAAAAXNSR0IArs4c6QAAAHhlWElmTU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAACWAAAAAQAAAJYAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAB8+gAwAEAAAAAQAAAXkAAAAADv+WZQAAAAlwSFlzAAAXEgAAFxIBZ5/SUgAAQABJREFUeAHs3Wl0Fded9/u/5lkCIYTmARASCDHPM2YyxPGMHTuOMzxJblb6uX17PU+v22+eF/flfZF177rpdjpDZ+q2Y8ezDQYbjME2YCZjMxsDZrTBBsw8mUF3/7azyYkiBokjcXTOt9Yq1Tl1qnZVfY6oEvWrvbcZAwIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAgkukNTc3PxFghtw+AgggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCS6g8Lw5wQ04fAQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQACBBBdITvDj5/ARQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBAwwnN+CRBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEl6A8DzhfwUAQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBAgPOd3AAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAg4QUIzxP+VwAABBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAHCc34HEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQSXoDwPOF/BQBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEECA853cAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQCDhBQjPE/5XAAAEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAcJzfgcQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBJegPA84X8FAEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQIDzndwABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAIOEFCM8T/lcAAAQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABwnN+BxBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEl6A8DzhfwUAQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBAgPOd3AAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAg4QUIzxP+VwAABBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAHCc34HEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQSXoDwPOF/BQBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEECA853cAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQCDhBQjPE/5XAAAEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAcJzfgcQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBJegPA84X8FAEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQIDzndwABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAIOEFCM8T/lcAAAQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABwnN+BxBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEl6A8DzhfwUAQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBAgPOd3AAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAg4QUIzxP+VwAABBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAHCc34HEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQSXoDwPOF/BQBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEECA853cAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQCDhBQjPE/5XAAAEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAcJzfgcQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBJegPA84X8FAEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQSIUgcQSam5uvebBJSUnX/IwPEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAgXgXoOZ5vH/DHB8CCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAwA0FCM9vSMQCCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAALxLkB4Hu/fMMeHAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIHBDAcLzGxKxAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIBAvAsQnsf7N8zxIYAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAgjcUIDw/IZELIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAgggEO8ChOfx/g238fiam5tNo4YwbWMRLI4AAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAgh0OQHC8y73lUV/h0NgfuXKFbt8+bJdunTJB+eaMiCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAKJIEB4ngjf8g2OUaF5CMxDkK4p4fkN4PgYAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQTiRiA1bo6EA2m3gILys2fPWlpamq9xnpSUZArUL168aFlZWe0ulxURQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQACBriJAeN5VvqkO3E+F5SdOnPCjgvSMjAwrKioiOO9Ac4pGAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAIHYEiA8j63vo9P3JtQyP3TokO3YscPXPO/WrZuvhZ6Tk9Pp+8MGEUAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAgdshQHh+O9RjaJuqaX758mXbs2ePvfvuuz48r6ystJKSEtOUAQEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEgEAcLzRPiWb3CMly5duhqeq6/zAQMG2KhRo0y10hkQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQACBRBAgPE+Eb/kGx6jA/Pz583b06FFf8/zUqVN28eLFG6zFxwgggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggED8CBCex893ecMjaa0muZptT05OtpSUFD9VIXrd2rI33AALIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAl1UILmL7je7jQACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAQNQECM+jRklBCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAJdVYDwvKt+c+w3AggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggEDUBAjPo0ZJQQgggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACXVUgtavuOPvddoHm5uZWV2o5PykpyTQyIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAokiQM3zRPmmb3CcLQP0GyzOxwgggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggEBcCRCex9XXycEggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCLRHgPC8PWqsgwACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCAQVwKE53H1dXIwCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAALtESA8b48a6yCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIxJUA4XlcfZ0cDAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIBAewRS27NSvK7T3NzcIYeWlJTU5nJvZV/as7027yArIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAnEkQM3zOPoyORQEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAgfYJEJ63z421EEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQTiSIDwPI6+TA4FAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQKB9AoTn7XNjLQQQ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3GxfPV9seW+Pst7OzerRdRFoTASIcnHp0iVbvXq1LV261C5cuGAFvXtb2fCx1q7bwOh5aBN1Vz/zG9Nnrr7cA4FmUeSF5GzLGTTOSg4dtqP7d4clDubPnx/Ct/fq1Uvrn98DVhURAREQAREQAREQAREQAREQAREQgUQmwFj/wYMHg4fspk2brH379jZyZC+rKutseRmRY10id062i0A9EEhqbpbbvoVNGpsdOXv1iSJA7jSeLcRzNsK4K4mACNQugVp9d33++echBPKuXbts//79hoB+5coVw/Mc73JepO3atQt7hHNCuZSVlVlmZma4T9eri721i+OH2hGvaTdWQObcvelvFkre88fa7Nd8H9snvxabn/s+8eAHa34Qsj0vezbKsPn16nV42dvtvR4mC/ga7N5Pr/t2dei+CCQ6Ab6T+I5auHCh7d692/Lz861XeaXl9h0VPWPdou5Fv1juNKGx//VOMyufCCQagVRLyqmwPsPGWJt2bWzxnPdt8eLFVl5ebp06dQrv75u9IxOtp7JXBERABERABERABERABERABERABETg1gS++eYbO3HihH3yySc3HFImThxpE0fkW2mPdgrXfmt8uisCNRJgIeN2kQ/L4OJmNmF8uZ0+fSZoa8uXL7fi4uLgxEIUZyUREIHaIxA38RwR9ttvvw2WIsLiyUmoljlz5tj27duDaI4ozaC6C714oXsZRPQDBw4EMbiysjKske7e1rXX/Zprpl33PHdbsZ0+cY7wz97FZfaxwjO1+jUXov2at0h80nxbAABAAElEQVR5F+m5xjl1eH6vj3p8i62DayTPF07u4x/aVxKBpkiA55DvIkK1L1q0KDzflUOGWkHf0WZppRGSu/uaRGb/vimCVJ+bEIFOllU12lp1aW/H9u21T6OZr7zrc3NzQ+golmPRO6UJ/TmoqyIgAiIgAiIgAiIgAiIgAiIgAk2WANEbEc5Z63z9+vUhsuxTM4ZYVY+W1jFJ3iVN9g9DHb9vAoxI49L10OROduJkpa1duzVEgHz//feN6I99+/YNWtt9N6QKREAEaiRwd6pQjVX8eNEFXQTx06dP24cffmirVq0KGQYMGBDWRMUzjVkxiL54oZ87dy6I5ghXGzZsCGuhE8a9dxQyGUHd6/yxldo7ihWpEbG//vrrG2HksbdVq1Y31m7nPtcQ2pOTk0O+lJSU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/dWvfrVccMEFZeeddy777bdfWbJkSf3+uGrFaveo4jgHety3gt1h9Tun/Jlnnlne8IY3BHmeE4FEIBFIBBKBRCARSAQSgUQgEUgEEoFEIBFIBBKBRCARSAQSgUQgEUgEEoFEIBHYYBFI53mraa2yjm3L3bYinPP8wAMPrA7w73znO+Xzn/98daJbYW7L9dgy/fGPf3x50pOeVHbZZZeaolXbl1xySeEgt4L80EMPrWntscce5ad+6qeqA/ycc86pjm/fsebAtrLdtuyeP+UpTymc8Zzihx12WHnqU59avvjFL9b8OeSDxup2q9Of/OQn13h77713dZpblW4FeYTu/7gfZ/nGlvFW1FsF/+1vf3tqNXrEy3MikAgkAolAIpAIJAKJQCKQCCQCiUAikAgkAolAIpAIJAKJQCKQCCQCiUAikAgkAhsiAps0K4vfsCFWbEidOM45mSPE1u22b+esju3MxXPtvpXhhx9+eDnhhBPKox71qLptO3rfLb/lllvq1udHHHFEOfjgg+t27bZW33bbbae+oy6t2C6do37p0qXl5JNPrs56jnPbuXO+o4u4VpTL330r0o899th6HHDAAdXZrlzqESvKoz7oxgWTAGz/rtzyUUYr7n/pl36plnUcXfs+um6e7ed5vWEhsDrbe3WmtWGhnLVJBDYOBNaFDFgXeW4crblua9m3XfvGV7u1RbNukczchyIwKX9MGm+mcqyudGbKJ58nAolAIrAxITBOtrbvuxams4G0488Wv9WZ1mzLkvQzIzCOP8bdnznFR8YYwhNDaB6Zc95ZVwjM1H4zPV8T5V4Xea6JemSaiUAiMD0CM73rMz2fPvVVn67OtFZNOf9NisBs2mAILRphOr160rKvzni58ryDZruBXHNSL1iwoHBMC7ZQt6pc4Nj2DXMObFux+5a5exrbynSOcNee+W65rdmlt+eee9aV4lapc7Bb9S0eB7nt4K00X7Ro0ZTT2n3OdyvhrSy3Kty19JTNynjbtXN4c5wrdxy1oM1PMGD8756tXt9///2nHPJWoUvL0Sd873vfq99tV6cog3I9+tGPrhMN1D/D+oEAHvjud79bfvjDH1Z+Cx7C894D/NIOJoHceOON5bLLLqs7MsSkEHHQ+o/n8QK+7U7muPjii8vNN99cd2AIGu+D98f7hN8zzG0EtLMJONdff33lHbtztCck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'
