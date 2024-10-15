import React from 'react';
import './gameStyles.css';
import { KeyTableID} from "../../screens/gameHandle/game_handle";
import {NewLogs} from "../../../actions/logger";
import {getTimeDate} from "../../../utils/app_utils";
import {QueenGardenContext} from "./context/qg_context";
import QueenGardenTutorial from "./tutorial";
import QueenGardenGame from "./game";
import {QueenGardenGameLoading} from "./game/game_loading";

const ThisExperiment = 'PreferancePerformance';
let firstTime = true;
class Start extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.props.SetLimitedTime(false);

        this.UserId = props.user_id;
        this.RunningName = props.running_name;
        this.DebugMode = props.dmr;

        this.TrialsForBonus = [];
        this.TotalBonus = [];

        this.PaymentsSettings = props.game_settings.payments;

        this.GameSet = {
            Labels: {
                CrownHighway: props.game_settings.game.ch_txt,
                KingdomLeft: props.game_settings.game.c_l_txt,
                KingdomRight: props.game_settings.game.c_r_txt,
                SignpostRoad1: props.game_settings.game.r1_txt,
                SignpostRoad2: props.game_settings.game.r2_txt,
                SignpostRoad3: props.game_settings.game.r3_txt,
                SignpostRoad4: props.game_settings.game.r4_txt,
                SignpostQueen: props.game_settings.game.qg_txt,
            },
            WithTutorial: props.game_settings.game.w_t,
            WithPractice: props.game_settings.game.w_p,
            GamesOrder: props.game_settings.game.g_o === 'r'? 'Random' : 'NoRandom', // n_r -> Ascending
            GamesBank: []
        };

        let RunCounter = KeyTableID();

        let game_condition = props.game_settings.game.cond;
        console.log("---> game_condition="+game_condition)
        if (game_condition === 'Ra'){
            const rnd = Math.floor(Math.random() * 2);
            this.GameSet.GameCondition = rnd? 'Risk' : 'Dishonest';
        }
        else if (game_condition === 'U'){
            this.GameSet.GameCondition = RunCounter%2? 'Risk' : 'Dishonest';
        }
        else if (game_condition === 'R'){
            this.GameSet.GameCondition = 'Risk';
        }
        else if(game_condition === 'D') {
            this.GameSet.GameCondition = 'Dishonest';
        }   
        console.log("---> this.GameSet.GameCondition="+this.GameSet.GameCondition)

        let GamesBank = props.game_settings.game.g_b.map(
          (g, i) => ({
              GameID: i + 1,
              GameOrder: null,
              Trials: g.t,
              P0: g.p0,
              Adaptability: g.a,
              RewardValue: g.r_v,
              TollCost: g.t_c,
              ClearingCost: g.c_c,
          })
        );
        if (this.GameSet.GamesOrder === 'NoRandom'){
            this.GameSet.GamesBank = GamesBank.map(
              (g, i) => ({
                  ...g,
                  GameOrder: i + 1
            }))
        }
        else {
            let games_indexes = Array.from({length: GamesBank.length}, (_,i) => i);
            let index_ = 1;
            while (games_indexes.length){
                const next_index = Math.floor(Math.random() * games_indexes.length);
                const real_index = games_indexes[next_index];
                const g_ = {
                    ...GamesBank[real_index],
                    GameOrder: index_
                };
                this.GameSet.GamesBank.push(g_);
                index_++;
                games_indexes = games_indexes.filter((_, i) => i !== next_index);
            }
        }

        const {t, p0, a, r_v, t_c,c_c} = props.game_settings.game.pt_g;
        const PracticeGame = {
            GameID: 0,
            GameOrder: 0,
            Trials: t,
            P0: p0,
            Adaptability: a,
            RewardValue: r_v,
            TollCost: t_c,
            ClearingCost: c_c,
        };

        this.GameSet.GamesBank = [PracticeGame, ...this.GameSet.GamesBank];

        this.Forward = this.Forward.bind(this);

        this.state = {
            tasks_index: 0,
            isa: props.isa,
            isLoading: true,
            game_settings: this.GameSet,
            current_game_index: this.GameSet.WithPractice === 'Yes'? 0 : 1,
            finalReward: 0,
            needToPayClearing: false,
            showWelcomeMessage: true

        };

        this.game_template = null;
        this.START_APP_MIL = null;

        this.initializeGame();
    }

    initializeGame() {

        let game_template = [];

        if (this.GameSet.WithTutorial === 'Yes'){
            game_template.push({
                Mode: 'Tutorial',
            });
        }

        const games_length = this.GameSet.WithPractice === 'Yes'? this.GameSet.GamesBank.length : (this.GameSet.GamesBank.length-1)
        for (let i=0; i<games_length; i++){
            game_template.push({
                Mode: 'Game',
            });
        }

        this.game_template = game_template;
    }

    componentDidMount(){
        NewLogs({
            user_id: this.UserId,
            exp: ThisExperiment,
            running_name: this.RunningName,
            action: 'G.L',
            type: 'LogGameType',
            more_params: {
                local_t: getTimeDate().time,
                local_d: getTimeDate().date,
            },
        }).then((res) => {
            this.START_APP_MIL = Date.now();
            this.props.SetLimitedTime(true);
            this.setState({isLoading: false});
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isa !== this.props.isa){
            let sc = this.state;
            sc.isa = this.props.isa;
            this.setState(sc);
        }
    }

    Forward(finish_game, game_data){
        
        if(finish_game===true){
            if(this.props.game_settings.game.w_p === "No"){
                 this.addGameBonus(game_data);
            }
            else{
                if(this.props.game_settings.game.w_p === "Yes" &&  firstTime=== true ){
                    firstTime = false;
                }else{
                    this.addGameBonus(game_data);
                }
            }
         }
        let sc = this.state;
        if (sc.tasks_index === (this.game_template.length-1)){
            this.props.SetLimitedTime(false);
            if (Array.isArray(game_data)) {
                const random_trial_index = Math.floor(Math.random() * game_data.length);
                this.TrialsForBonus.push(game_data[random_trial_index]);
                this.props.insertGameArray(game_data);
            }

            const trials_bonus = this.TrialsForBonus.reduce((total, t) => total + `${t.GameOrder}-${t.Trial}-${t.Pay}|`, '');
            const reward_sum = this.TrialsForBonus.reduce((total, t) => total + t.Pay, 0);
            let reward_avg = reward_sum / this.TrialsForBonus.length;
            reward_avg = Math.round(reward_avg * 1000) /1000;
            const bonus_payment = (reward_avg/(this.PaymentsSettings.exchange_ratio || 1));

            NewLogs({
                user_id: this.UserId,
                exp: ThisExperiment,
                running_name: this.RunningName,
                action: 'G.E',
                type: 'LogGameType',
                more_params: {},
            }).then((res) => {});

            const current_time = getTimeDate();

            this.props.insertTextInput('BonusTrials', trials_bonus);
            this.props.insertTextInput('RewardSum', trials_bonus);
            this.props.insertTextInput('RewardAvg', reward_avg);
            this.props.insertTextInput('FinalBonus', bonus_payment);
            var total_bonus=this.calculateBonus();
            this.PaymentsSettings.total_bonus = total_bonus;
            this.props.insertPayment({
                exchange_ratio: this.PaymentsSettings.exchange_ratio,
                bonus_endowment: this.PaymentsSettings.bonus_endowment,
                show_up_fee: this.PaymentsSettings.show_up_fee,
                sign_of_reward: this.PaymentsSettings.sign_of_reward,
                bonus_payment:this.PaymentsSettings.total_bonus,
                Time: current_time.time,
                Date: current_time.date
            });

            sc.isLoading = true;

            let debug_args = {
                TrialsForBonus: this.TrialsForBonus,
                reward_sum,
                reward_avg,
                bonus_payment
            }
            this.setState(sc, () => {
                this.props.sendGameDataToDB().then(
                  res => {
                      NewLogs({
                          user_id: this.UserId,
                          exp: ThisExperiment,
                          running_name: this.RunningName,
                          action: 'G.E.S',
                          type: 'LogGameType',
                          more_params: {
                              local_t: current_time.time,
                              local_d: current_time.date,
                          },
                      }).then((res) => {}); 

                      /*
                       var total_bonus=this.TotalBonus.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                       var exchange_ratio = this.PaymentsSettings.exchange_ratio;
                       total_bonus = total_bonus / exchange_ratio ;
                       total_bonus= (Math.round(total_bonus * 100) / 100).toFixed(2);
                       */
                       debug_args.reward_sum=total_bonus;
                       this.props.callbackFunction('FinishGame', {need_summary: true, args: debug_args});
                  }
                );
            });
        }
        else {
            sc.isLoading = true;
            if (finish_game && Array.isArray(game_data)) {
                if (game_data[0].GameID !== 0) {
                    const random_trial_index = Math.floor(Math.random() * game_data.length);
                    this.TrialsForBonus.push(game_data[random_trial_index]);
                }

                sc.current_game_index++;
                this.props.insertGameArray(game_data);
            }
            this.setState(sc, () => {
                if (finish_game && Array.isArray(game_data)){
                    this.props.sendGameDataToDB().then(
                      () => {
                          NewLogs({
                              user_id: this.UserId,
                              exp: ThisExperiment,
                              running_name: this.RunningName,
                              action: 'F.G',
                              type: 'LogGameType',
                              more_params: {
                                  game_index: game_data[game_data.length-1].GameOrder,
                                  total_p: game_data[game_data.length-1].TotalPoints,
                                  local_t: getTimeDate().time,
                                  local_d: getTimeDate().date,
                              },
                          }).then((res) => {});
                          sc.isLoading = false;
                          sc.tasks_index++;
                          this.setState(sc);
                      }
                    )
                }
                else {
                    NewLogs({
                        user_id: this.UserId,
                        exp: ThisExperiment,
                        running_name: this.RunningName,
                        action: 'F.TU',
                        type: 'LogGameType',
                        more_params: {
                            local_t: getTimeDate().time,
                            local_d: getTimeDate().date,
                        },
                    }).then((res) => {});
                    sc.isLoading = false;
                    sc.tasks_index++;
                    this.setState(sc);
                }

            });
        }

      
    }
    calculateBonus(){
        var total_bonus=this.TotalBonus.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        var exchange_ratio = this.PaymentsSettings.exchange_ratio;
        total_bonus = total_bonus / exchange_ratio ;
        total_bonus= (Math.round(total_bonus * 100) / 100).toFixed(2);
        console.log("---> in calculateBonus()  total_bonus="+total_bonus+"  exchange_ratio="+exchange_ratio)
        return total_bonus;
     }
    addGameBonus(game_data){
        console.log("-------------> in addGameBonus");
        var selectedTrial= Math.floor(Math.random() * game_data.length);
        var selectedTrailPoints=game_data[selectedTrial].TrialPoints;
        console.log("---> game_data.length="+game_data.length + "   selectedTrial="+(selectedTrial+1)+"   selectedTrailPoints="+selectedTrailPoints)
        this.TotalBonus.push(selectedTrailPoints);
        }
    handleOkButtonClick = () => {
            // Update state to hide the welcome message
            this.setState({ showWelcomeMessage: false });
          };
    render() {
            const { showWelcomeMessage } = this.state;
        
            // If the welcome message is still visible, render it 
            if (showWelcomeMessage) {
              return (
                <div className="center-container">
                  <h1>Welcome to the Queen’s Garden Study</h1>
                  <h2>
                  <p>
                    <label>Thank you for your continued participation in this experiment. You have elected to donate some of your extra time and so we ask that you continue playing the game for the time you have selected.</label><br></br>
                    <label>The game remains much the same, but some things may have changed. We ask that you continue to attempt to maximize your score for however many trials you will play. Once you have completed your allotted trials your participation will have concluded.</label><br></br>
                  </p>
                  </h2>
                  <button style={{ fontSize: '40px', marginTop: '10px' }} onClick={this.handleOkButtonClick}>Move to the Queen's Garden Game</button>
                </div>
              );
            }
        
            // If the welcome message is hidden, render the game board
            if (this.state.isLoading || !this.state.game_settings || !Array.isArray(this.game_template)) {
              return <QueenGardenGameLoading loading={true} />;
            }
        
            return (
              <QueenGardenContext.Provider
                value={{
                  game_settings: this.state.game_settings,
                  current_game_index: this.state.current_game_index,
                  finalReward: this.state.finalReward,
                  needToPayClearing: this.state.needToPayClearing,
                  DebugMode: this.DebugMode,
                }}
              >
                <div className='sp-start-panel'>
                  {this.game_template[this.state.tasks_index].Mode === 'Tutorial' && (
                    <QueenGardenTutorial Forward={this.Forward} />
                  )}
        
                  {this.game_template[this.state.tasks_index].Mode === 'Game' && (
                    <QueenGardenGame Forward={this.Forward} START_APP_MIL={this.START_APP_MIL} />
                  )}
                </div>
              </QueenGardenContext.Provider>
            );
          }
}

export default Start;
