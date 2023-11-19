import React, {useEffect, useRef, useState} from 'react';
import './gameStyles.css';
import PropTypes from "prop-types";
import {NewLogs} from "../../../actions/logger";
import {adjustFont2, getTimeDate} from "../../../utils/app_utils";
import WaitForAction2 from "../../screens/waitForAction/wait_for_action2";

import {DebuggerModalView} from "../../screens/gameHandle/game_handle";

const ThisExperiment = 'NoCupsGame';

let UserId = 'empty';
let RunningName = '-';
let GAME_POINTS = 0;
let DebugMode = null;
let GameSet = {};
let PaymentsSettings = null;
let btnGameFontSize = null;
let btnWelcomePageFontSize = null;

function useOnScreen(ref) {

    const [isIntersecting, setIntersecting] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIntersecting(entry.isIntersecting)
        )

        observer.observe(ref.current)
        // Remove the observer as soon as the component is unmounted
        return () => { observer.disconnect() }
    }, [ref])

    return isIntersecting
}

const GameWelcome = ({Forward}) => {

    const ref = useRef()
    const isVisible = useOnScreen(ref);

    return (
        <div
            ref={ref}
            className='cg_welcome'
            style={{
                fontSize: 'larger'
            }}
        >
            <label>Welcome!</label>
            <p>
                Please read the following instructions:<br/>
                During the game, you will be presented with 11 buttons. Each button displays a certain probability of winning or losing points.
            <
            /p>

            {
                isVisible && (
                    <Buttons
                        onClick={undefined}
                        index_on={[5]}
                        show_reward={false}
                        last_clicked={5}
                        disableAll={true}
                        welcome_page={true}
                    />
                )
            }

            <p>
                The game includes 100 trials. At the beginning of each trial, two buttons (out of the 11 above) will turn blue, and you will be asked to choose only between these two options. One of the blue buttons will always be the button that you chose in the previous trial, and the other button will be randomly selected to be either one button to the right or one button to the left of the previously chosen button. After you selected one of two blue buttons, your payoff for this trial will be presented on the selected button. As noted, the next trial will include a choice between the same button you just selected and another button located next to it.
                <br/><br/>
                Your goal is to earn as many points as you can.
                Getting more points will increase your chance of getting an <b>extra bonus</b>.
            </p>

            <button onClick={Forward}>Next</button>
        </div>
    )
};

const ResetAll = () => {
    UserId = 'empty';
    RunningName = '-';
    DebugMode = null;
    GameSet = {};
    PaymentsSettings = null;
    GAME_POINTS = 0;
    btnGameFontSize = null;
    btnWelcomePageFontSize = null;
};

const BtnItem = ({welcome_page, btnSize, show_reward, show_all_rewards, button_props, button_index, onClick, me_last, me_on, disableAll}) => {
    const [fontSize, setFontSize] = useState(20);

    let textRef = useRef(null);

    useEffect(() => {
        if (!textRef) return;

        const handleResize = () => {
            const f_s = adjustFont2(textRef, 10);
            let current_font_size = Number(f_s.replace('px', ''));
            setFontSize(current_font_size-3);
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [textRef, btnSize, welcome_page]);

    const {p, w, l} = button_props;

    let btn_text;
    if (p === 0){
        if (button_index === 0)
            btn_text = (
                <>
                    0% to win 100; <br/>
                    100% to lose 0
                </>
            );
        else
            btn_text = (
                <>
                    100% to win 0; <br/>
                    0% to lose 100
                </>
            );
    }
    else
        btn_text = (
            <>
                {p}% to win {w};<br/>
                {100-p}% to lose {Math.abs(l)}
            </>
        )

    let reward_is_showing = false;
    if (show_all_rewards && Array.isArray(show_all_rewards)){
        btn_text = show_all_rewards[button_index];
        reward_is_showing = true;
    }
    else if (show_reward && show_reward.index === button_index) {
        btn_text = show_reward.text;
        reward_is_showing = true;
    }

    return (
        <button
            className={me_on? 'index_on' : ''}
            onClick={() => onClick(button_index)}
            style={{
                width: btnSize,
                height: btnSize,
                // fontSize: '1.2vmin',
                fontSize: reward_is_showing? (btnSize/3) : fontSize,
                borderWidth: me_last? 3 : 1,
                pointerEvents: (me_on&&!disableAll)? 'all' : 'none',
                position: 'relative'
                // backgroundColor: me_on? 'blue' : 'gray'
            }}
            ref={textRef}
        >
            {DebugMode && (
                <label style={{fontSize: 'large',color: 'blueviolet',position: 'absolute', top:'2%',left:'50%'}}>{button_index+1}</label>
            )}
            {btn_text}
        </button>
    )
}

const Buttons = ({onClick, show_reward, show_all_rewards, last_clicked, index_on, disableAll, welcome_page}) => {
    const [btnSize, setBtnSize] = useState(welcome_page? btnWelcomePageFontSize : btnGameFontSize);
    const divRef = useRef();

    useEffect(() => {
        // const clientWidth = divRef.current.clientWidth - 11*4 + (welcome_page? -80 : 0);
        // setBtnSize(Math.floor(clientWidth/11));
        const updateSize = () => {
            const clientWidth = divRef.current.clientWidth - 11*4 + (welcome_page? -80 : 0);
            setBtnSize(Math.floor(clientWidth/11));
        }

        window.addEventListener('resize', updateSize);
        updateSize();


        return () => window.removeEventListener('resize', updateSize);
    }, [ welcome_page]);

    return (
        <div
            className='ncg-game_board_buttons'
            ref={divRef}
            style={{
                visibility: btnSize? 'visible' : 'hidden'
            }}
        >
            {
                GameSet.buttons.map(
                    (btn, btn_index) => (
                       <BtnItem
                           welcome_page={welcome_page}
                           button_props={btn}
                           key={btn_index}
                           button_index={btn_index}
                           show_reward={show_reward}
                           show_all_rewards={show_all_rewards}
                           onClick={onClick}
                           btnSize={btnSize}
                           disableAll={disableAll}
                           me_last={last_clicked === btn_index}
                           me_on={index_on.indexOf(btn_index) > -1}
                       />
                    )
                )
            }
        </div>
    )
}

class Game extends React.Component{

    constructor(props){
        super(props);

        this.props = props;

        this.START_INDEX = 5;

        this.state = {
            trial: 0,
            step: 0,
            loading: true,
            show_reward: null,
            show_all_rewards: null,
            index_on: [this.START_INDEX],
            last_clicked: this.START_INDEX,
            debug_row: null,
        };

        this.current_trial = null;

        this.StartTrialTime = null;

        this.onButtonClick = this.onButtonClick.bind(this);
        this.onNextButton = this.onNextButton.bind(this);
        this.getRewardPoints = this.getRewardPoints.bind(this);
    }

    componentDidMount() {
        this.setState({loading: false}, () => {});
    }

    getRewardPoints(){
        const btn_index = this.state.last_clicked;
        const btn_props = GameSet.buttons[btn_index];
        const {p, w, l} = btn_props;
        const random_points_number = GameSet.expose_all?(Math.floor(Math.random() * 11)+1) : Math.floor(Math.random() * 101);
        const random_side_number = Math.floor(Math.random() * 101);
        let reward_points, win, next_index, side;

        if (GameSet.expose_all){
            if (btn_index >= random_points_number){
                reward_points = Number(w);
                win = 'TRUE';
            }
            else {
                reward_points = Number(l);
                win = 'FALSE';
            }
        }
        else {
            if (Number(p) >= random_points_number){
                reward_points = Number(w);
                win = 'TRUE';
            }
            else {
                reward_points = Number(l);
                win = 'FALSE';
            }
        }

        // next button
        if (random_side_number <= 50){
            if (btn_index === 0) {
                next_index = btn_index + 1;
                side = 'RIGHT';
            }
            else {
                next_index = btn_index - 1;
                side = 'LEFT';
            }
        }
        else {
            if (btn_index === (GameSet.buttons.length - 1)) {
                next_index = btn_index - 1;
                side = 'LEFT';
            }
            else {
                next_index = btn_index + 1;
                side = 'RIGHT';
            }
        }

        GAME_POINTS += reward_points;

        return {
            random_points_number,
            random_side_number,
            win,
            side,
            reward_points,
            last_clicked: btn_index,
            next_index
        }
    }

    onNextButton(){
        let sc = this.state;

        if (sc.trial === Number(GameSet.trials))
            return this.props.Forward();

        if (sc.trial === 0) {
            this.current_trial = this.getRewardPoints();
        }

        sc.index_on = [sc.last_clicked, this.current_trial.next_index];
        sc.step++;
        sc.trial++;
        sc.show_reward = null;
        sc.show_all_rewards = null;
        this.setState(sc);
    }

    onButtonClick(button_index){
        let sc = this.state;
        // const btn_props = GameSet.buttons[button_index];
        sc.last_clicked = button_index;
        sc.step = 0;
        this.current_trial = this.getRewardPoints();

        sc.show_reward = {
            index: button_index,
            text: `${this.current_trial.reward_points>0?'+' : ''}${this.current_trial.reward_points}`
        };

        if (GameSet.expose_all){
            sc.show_all_rewards = [];
            for (let i=0; i<11; i++) {
                const {w, l} = GameSet.buttons[i];
                let reward_points;
                if (i === 0 || i === 10)
                    reward_points = 0;
                else
                    reward_points = i >= this.current_trial.random_points_number ? Number(w) : Number(l);

                sc.show_all_rewards.push(`${reward_points > 0 ? '+' : ''}${reward_points}`);
            }
        }

        let db_raw = {
            trial: sc.trial,
            points: this.current_trial.reward_points,
            random_points_number: this.current_trial.random_points_number,
            random_side_number: this.current_trial.random_side_number,
            next_side: this.current_trial.side,
            win: this.current_trial.win,
            current_loc: this.current_trial.last_clicked + 1,
            new_loc: this.current_trial.next_index + 1,
            total_points: GAME_POINTS
        }

        this.props.insertGameLine({...db_raw});

        if (DebugMode)
            sc.debug_row = db_raw;
        this.setState(sc);
    }

    render() {
        if (this.state.loading)
            return <></>;


        let label_visible = 'visible';
        if (this.state.step === 0){
            label_visible = 'hidden';
        }

        let btn_next_visible = 'hidden';
        if (this.state.step === 0){
            btn_next_visible = 'visible';
        }

        return (
            <div
                className='ncg-game_board'
            >
                <label
                    className='ncg-game_board_t'
                >
                    {this.state.trial}/{GameSet.trials}
                </label>

                <label
                    className='ncg-game_board_l'
                    style={{visibility: label_visible}}
                >Please choose one of the blue buttons</label>

                <Buttons
                    onClick={this.onButtonClick}
                    index_on={this.state.index_on}
                    show_reward={this.state.show_reward}
                    show_all_rewards={this.state.show_all_rewards}
                    last_clicked={this.state.last_clicked}
                    disableAll={this.state.step === 0}
                />

                <button
                    className='ncg-game_board_b'
                    onClick={btn_next_visible === 'visible' ? this.onNextButton : undefined}
                    style={{visibility: btn_next_visible}}
                >
                    {this.state.trial === 0?'Press Here To Start':'Next'}
                </button>


                {DebugMode && this.state.debug_row && (
                    <DebuggerModalView>
                        <div className='rm_debug cg_debug'>
                            <div>
                                <label>GAME POINTS:<span>{GAME_POINTS}</span></label>
                                <label>points:<span>{this.state.debug_row.points}</span></label>
                                <label>random_points_number:<span>{this.state.debug_row.random_points_number}</span></label>
                                <label>random_side_number:<span>{this.state.debug_row.random_side_number}</span></label>
                                <label>next_side:<span>{this.state.debug_row.next_side}</span></label>
                                <label>win:<span>{this.state.debug_row.win}</span></label>
                                <label>current_loc:<span>{this.state.debug_row.current_loc}</span></label>
                                <label>new_loc:<span>{this.state.debug_row.new_loc}</span></label>
                            </div>
                        </div>
                    </DebuggerModalView>
                )}
            </div>
        )
    }
}

class Start extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        ResetAll();

        UserId = props.user_id;
        RunningName = props.running_name;
        DebugMode = props.dmr;

        // let RunCounter = KeyTableID();

        PaymentsSettings = props.game_settings.payments;

        GameSet.trials = Number(props.game_settings.game.trials);
        GameSet.buttons = props.game_settings.game.btn;
        GameSet.expose_all = props.game_settings.game.e_a;

        this.state = {
            tasks_index: 0,
            isa: props.isa,
            isLoading: true,
        };

        this.props.SetLimitedTime(false);

        this.Forward = this.Forward.bind(this);
        this.initializeGame = this.initializeGame.bind(this);

        this.game_template = null;

        this.initializeGame();

    }

    initializeGame() {

        let game_template = [];

        game_template.push({
            Component: GameWelcome
        });

        game_template.push({
            Component: Game
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

            const current_time = getTimeDate();
            NewLogs({
                user_id: UserId,
                exp: ThisExperiment,
                running_name: RunningName,
                action: 'G.E',
                type: 'LogGameType',
                more_params: {
                    game_points: GAME_POINTS,
                    local_t: current_time.time,
                    local_d: current_time.date,
                },
            }).then((res) => {});

            this.props.insertTextInput('ExposeAll', GameSet.expose_all.toString());

            this.props.insertPayment({
                game_points: GAME_POINTS,
                exchange_ratio: PaymentsSettings.exchange_ratio,
                bonus_endowment: PaymentsSettings.bonus_endowment,
                show_up_fee: PaymentsSettings.show_up_fee,
                sign_of_reward: PaymentsSettings.sign_of_reward,
                Time: current_time.time,
                Date: current_time.date
            });

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
                                game_points: GAME_POINTS,
                                local_t: current_time.time,
                                local_d: current_time.date,
                            },
                        }).then((res) => {});
                        this.props.callbackFunction('FinishGame', {need_summary: true, args: {}});
                    }
                );
            });
        }
        else {
            if (sc.tasks_index === 0)
                this.props.SetLimitedTime(true);

            sc.tasks_index++;
        }
        this.setState(sc);
    }

    render() {
        if (!this.state || this.state.isLoading) {
            return <WaitForAction2/>;
        }

        const Component = this.game_template[this.state.tasks_index].Component;
        return (
            <div
                className='ncg_main unselectable'
            >
                <Component insertGameLine={this.props.insertGameLine} Forward={this.Forward}/>
            </div>
        );
    }
}

Start.propTypes = {
    game_settings: PropTypes.object,
};


export default Start;

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
