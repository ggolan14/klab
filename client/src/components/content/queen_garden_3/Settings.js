import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {DivContainer} from "../../screens/settings/elements_builder";
import {convertPointsRatio} from "../../screens/settings/settings";
import './ctStyles.css';

const new_game_props = {
    active: 'Yes',
    t: 3, // Trials
    // r_v: 1, // Reward Value
    // m_t_c: 1, // Mileage/Travel/Toll Cost:
    p0: 0.05,  // first Probability
    a: 0.2, // Adaptability
    // pe: 1, // Penalty
    // e_c: 1, // Equipment Cost
    r_v: 1, // Reward Value
    t_c: 1, // Toll Cost:
    c_c: 1, // Toll Cost:
};

const GameElement = ({gameSelect, game_props, editGame}) => {
    const practice_game = gameSelect === 'practice_game';
    let g_settings = [];
    if (!practice_game)
        g_settings.push(
          {
              type: 'Select',
              label: 'Active:',
              show: true,
              options: [
                  {label: 'Yes', value: 'Yes'},
                  {label: 'No', value: 'No'},
              ],
              value: game_props.active,
              callback: value => editGame(gameSelect, 'active', value)
          },
        );

    g_settings = [
      ...g_settings,
        {
            type: 'Input',
            label: 'Trials:',
            show: true,
            class_name: '',
            value: game_props.t,
            input_type: 'number',
            step: 1,
            min: 1,
            label_after: '',
            pattern: '',
            callback: value => editGame(gameSelect, 't', value)
        },
        {
            type: 'Input',
            label: 'Reward value:',
            show: true,
            class_name: '',
            value: game_props.r_v,
            input_type: 'number',
            label_after: '',
            pattern: '',
            callback: value => editGame(gameSelect, 'r_v', value)
        },
        {
            type: 'Input',
            label: 'Toll cost:', // Mileage/Travel
            show: true,
            class_name: '',
            value: game_props.t_c,
            input_type: 'number',
            label_after: '',
            pattern: '',
            callback: value => editGame(gameSelect, 't_c', value)
        },
        {
            type: 'Input',
            label: 'Clearing cost:', // Mileage/Travel
            show: true,
            class_name: '',
            value: game_props.c_c,
            input_type: 'number',
            label_after: '',
            pattern: '',
            callback: value => editGame(gameSelect, 'c_c', value)
        },
        {
            type: 'Input',
            label: 'P0:',
            show: true,
            class_name: '',
            value: game_props.p0,
            input_type: 'number',
            label_after: '',
            pattern: '',
            callback: value => editGame(gameSelect, 'p0', value)
        },
        {
            type: 'Input',
            label: 'Adaptability:',
            show: true,
            class_name: '',
            value: game_props.a,
            input_type: 'number',
            label_after: '',
            pattern: '',
            callback: value => editGame(gameSelect, 'a', value)
        },
        // {
        //     type: 'Input',
        //     label: 'Penalty:',
        //     show: true,
        //     class_name: '',
        //     value: game_props.pe,
        //     input_type: 'number',
        //     label_after: '',
        //     pattern: '',
        //     callback: value => editGame(gameSelect, 'pe', value)
        // },
        // {
        //     type: 'Input',
        //     label: 'Equipment cost:',
        //     show: true,
        //     class_name: '',
        //     value: game_props.e_c,
        //     input_type: 'number',
        //     label_after: '',
        //     pattern: '',
        //     callback: value => editGame(gameSelect, 'e_c', value)
        // },
    ];

    return (
      <div
        className={'qg_set-ge_container ' + (!practice_game ? (game_props.active === 'Yes'? 'qg_set-ge_active' : 'qg_set-ge_not-active') : 'qg_set-ge_p-b')}
      >
          <DivContainer
            className='admin-settings-section-raw admin-settings-section-b'
            elements={g_settings}
          />
      </div>
    )
}

const ListElement = ({game_index, game_active, gameSelect, setGameSelect, removeGame}) => {
    const is_practice_game = game_index === 'practice_game';
    return (
      <div
        className={is_practice_game? 'qg_set-ge_p' : (game_active === 'Yes'? 'qg_set-ge_active' : 'qg_set-ge_not-active')}
        style={gameSelect === game_index? {backgroundColor: 'blue', color: 'white'} : {}}
      >
          <label
            onClick={() => setGameSelect(game_index)}
          >{!is_practice_game?`Game ${game_index+1}`:'Practice Game'}</label>

          {
              !is_practice_game && (
                <button
                  className='btn-delete'
                  onClick={() => removeGame(game_index)}
                >Delete</button>
              )
          }
      </div>
    )
}

const GamesBank = ({changeSettings, game_bank, practice_game}) => {
    const [gameSelect, setGameSelect] = useState(null);

    const addNewGame = () => {
        const gb = JSON.parse(JSON.stringify(game_bank));
        gb.push(JSON.parse(JSON.stringify(new_game_props)));
        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'g_b',
            value: gb,
        })
    }

    const removeGame = game_index => {
        let gb = JSON.parse(JSON.stringify(game_bank));
        gb = gb.filter((g_, g_i) => g_i !== game_index);
        setGameSelect(null);
        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'g_b',
            value: gb,
        });
    }

    const editGame = (game_index, attr, value) => {
        if (game_index === 'practice_game'){
            const pt_g = JSON.parse(JSON.stringify(practice_game));
            pt_g[attr] = value;
            changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'pt_g',
                value: pt_g,
            })
        }
        else {
            const gb = JSON.parse(JSON.stringify(game_bank));
            gb[game_index][attr] = value;
            changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'g_b',
                value: gb,
            })
        }
    }

    return (
      <div
        className='qg_set-gb_container'
      >
          <div className='qg_set-gb_head'>
              <label>Games Bank:</label>
              <button
                className='btn-add'
                onClick={addNewGame}
              >Add new game</button>
          </div>

          <div
            className='qg_set-gb_body'
          >
              <div
                className='qg_set-gb_list unselectable'
              >
                  <ListElement
                    game_index={'practice_game'}
                    gameSelect={gameSelect}
                    setGameSelect={setGameSelect}
                  />
                  {
                      game_bank.map(
                        (game_, game_index) => (
                          <ListElement
                            key={game_index}
                            game_index={game_index}
                            game_active={game_.active}
                            removeGame={removeGame}
                            gameSelect={gameSelect}
                            setGameSelect={setGameSelect}
                          />
                        )
                      )
                  }
              </div>

              {gameSelect !== null && (
                <GameElement
                  gameSelect={gameSelect}
                  game_props={gameSelect === 'practice_game' ? practice_game : game_bank[gameSelect]}
                  editGame={editGame}
                />
              )}
          </div>
      </div>
    )
}

const Settings = (props) => {

    let {game_settings, changeSettings, LAST_SETTING_NAME, versions_list} = props;
    const general = [
        {
            type: 'Input',
            label: 'Version:',
            show: true,
            class_name: 'admin-settings-input-big ' + (game_settings.version === 'test' ? ' disabledElem ' : '') + ((game_settings.version !== LAST_SETTING_NAME && versions_list.indexOf(game_settings.version) > -1) ? 'highlight_error_input' : ''),
            value: game_settings.version,
            input_type: 'text',
            callback: game_settings.version === 'test' ? () => {} : value => changeSettings({
                settings_of: 'game_settings',
                key: 'version',
                key2: null,
                value,
            })
        },
        {
            type: 'Select',
            label: 'Consent form:',
            show: true,
            options: ['Yes', 'No'],
            value: game_settings.general.consent_form,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'general',
                key2: 'consent_form',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Redirect to:  ',
            show: true,
            class_name: 'admin-settings-input-big ',
            value: game_settings.general.redirect_to,
            input_type: 'text',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'general',
                key2: 'redirect_to',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Action time:',
            show: true,
            class_name: '',
            value: game_settings.general.action_time,
            input_type: 'number',
            step: 0.1,
            min: 0,
            label_after: '[mm:ss]',
            pattern: 'MM:SS',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'general',
                key2: 'action_time',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Second warning:',
            show: true,
            class_name: '',
            value: game_settings.general.second_warning,
            input_type: 'number',
            step: 0.1,
            min: 0,
            label_after: 'second',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'general',
                key2: 'second_warning',
                value,
            })
        },
    ];

    const g_settings = [
        {
            type: 'Select',
            label: 'Force full screen:',
            show: true,
            options: ['true', 'false'],
            value: game_settings.game.force_full_screen,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'force_full_screen',
                value,
            })
        },
        {
            type: 'Select',
            label: 'Condition:',
            show: true,
            options: [
                {
                    value: 'R',
                    label: 'Risk'
                },
                {
                    value: 'D',
                    label: 'Dishonest'
                },
                {
                    value: 'Ra',
                    label: 'Random'
                },
                {
                    value: 'U',
                    label: 'Uniform distribution'
                },
            ],
            value: game_settings.game.cond,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'cond',
                value,
            })
        },
        {
            type: 'Select',
            label: 'Tutorial:',
            show: true,
            options: [
                {label: 'Yes', value: 'Yes'},
                {label: 'No', value: 'No'},
            ],
            value: game_settings.game.w_t,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'w_t',
                value,
            })
        },
        {
            type: 'Select',
            label: 'Practice:',
            show: true,
            options: [
                {label: 'Yes', value: 'Yes'},
                {label: 'No', value: 'No'},
            ],
            value: game_settings.game.w_p,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'w_p',
                value,
            })
        },
        {
            type: 'Select',
            label: 'Games order:',
            show: true,
            options: [
                {label: 'Random', value: 'r'},
                {label: 'Ascending', value: 'n_r'},
            ],
            value: game_settings.game.g_o,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'g_o',
                value,
            })
        },
        // {
        //     type: 'Select',
        //     label: 'Road on hover',
        //     show: true,
        //     options: [
        //         {label: 'None', value: 'n'},
        //         {label: 'Signpost', value: 's'},
        //         {label: 'Road and signpost', value: 'a'},
        //     ],
        //     value: game_settings.game.r_h,
        //     callback: value => changeSettings({
        //         settings_of: 'game_settings',
        //         key: 'game',
        //         key2: 'r_h',
        //         value,
        //     })
        // },
        {
            type: 'Input',
            label: 'Crown highway:',
            show: true,
            class_name: 'admin-settings-input-big ',
            value: game_settings.game.ch_txt,
            input_type: 'text',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'ch_txt',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Kingdom Left:',
            show: true,
            class_name: 'admin-settings-input-big ',
            value: game_settings.game.c_l_txt,
            input_type: 'text',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'c_l_txt',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Kingdom Right:',
            show: true,
            class_name: 'admin-settings-input-big ',
            value: game_settings.game.c_r_txt,
            input_type: 'text',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'c_r_txt',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Queen signpost:',
            show: true,
            class_name: 'admin-settings-input-big ',
            value: game_settings.game.qg_txt,
            input_type: 'text',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'qg_txt',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Road #1:',
            show: true,
            class_name: 'admin-settings-input-big ',
            value: game_settings.game.r1_txt,
            input_type: 'text',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'r1_txt',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Road #2:',
            show: true,
            class_name: 'admin-settings-input-big ',
            value: game_settings.game.r2_txt,
            input_type: 'text',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'r2_txt',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Road #3:',
            show: true,
            class_name: 'admin-settings-input-big ',
            value: game_settings.game.r3_txt,
            input_type: 'text',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'r3_txt',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Road #4:',
            show: true,
            class_name: 'admin-settings-input-big ',
            value: game_settings.game.r4_txt,
            input_type: 'text',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'r4_txt',
                value,
            })
        },
        // {
        //     type: 'Select',
        //     label: 'Tutorial (Forest Path) road index:',
        //     show: true,
        //     options: [1, 2, 3, 4],
        //     value: game_settings.game.tutorial_f_p,
        //     callback: value => changeSettings({
        //         settings_of: 'game_settings',
        //         key: 'game',
        //         key2: 'tutorial_f_p',
        //         value,
        //     })
        // },
        // {
        //     type: 'Select',
        //     label: 'Tutorial (Repeat Travel) road index:',
        //     show: true,
        //     options: [1, 2, 3, 4],
        //     value: game_settings.game.tutorial_r_t,
        //     callback: value => changeSettings({
        //         settings_of: 'game_settings',
        //         key: 'game',
        //         key2: 'tutorial_r_t',
        //         value,
        //     })
        // },
        // {
        //     type: 'Input',
        //     label: 'Reward value:',
        //     show: true,
        //     class_name: '',
        //     value: game_settings.game.r_v,
        //     input_type: 'number',
        //     label_after: '',
        //     pattern: '',
        //     callback: value => changeSettings({
        //         settings_of: 'game_settings',
        //         key: 'game',
        //         key2: 'r_v',
        //         value,
        //     })
        // },
        // {
        //     type: 'Input',
        //     label: 'Toll cost:',
        //     show: true,
        //     class_name: '',
        //     value: game_settings.game.t_c,
        //     input_type: 'number',
        //     label_after: '',
        //     pattern: '',
        //     callback: value => changeSettings({
        //         settings_of: 'game_settings',
        //         key: 'game',
        //         key2: 't_c',
        //         value,
        //     })
        // },
        // {
        //     type: 'Input',
        //     label: 'P0:',
        //     show: true,
        //     class_name: '',
        //     value: game_settings.game.p0,
        //     input_type: 'number',
        //     label_after: '',
        //     pattern: '',
        //     callback: value => changeSettings({
        //         settings_of: 'game_settings',
        //         key: 'game',
        //         key2: 'p0',
        //         value,
        //     })
        // },
        // {
        //     type: 'Input',
        //     label: 'Adaptability:',
        //     show: true,
        //     class_name: '',
        //     value: game_settings.game.a,
        //     input_type: 'number',
        //     label_after: '',
        //     pattern: '',
        //     callback: value => changeSettings({
        //         settings_of: 'game_settings',
        //         key: 'game',
        //         key2: 'a',
        //         value,
        //     })
        // },

        // {
        //     type: 'Input',
        //     label: 'Trials:',
        //     show: true,
        //     class_name: '',
        //     value: game_settings.game.t,
        //     input_type: 'number',
        //     step: 1,
        //     min: 1,
        //     label_after: '',
        //     pattern: '',
        //     callback: value => changeSettings({
        //         settings_of: 'game_settings',
        //         key: 'game',
        //         key2: 't',
        //         value,
        //     })
        // },
        // {
        //     type: 'Input',
        //     label: 'Reward Value:',
        //     show: true,
        //     class_name: '',
        //     value: game_settings.game.r_v,
        //     input_type: 'number',
        //     label_after: '',
        //     pattern: '',
        //     callback: value => changeSettings({
        //         settings_of: 'game_settings',
        //         key: 'game',
        //         key2: 'r_v',
        //         value,
        //     })
        // },
        // {
        //     type: 'Input',
        //     label: 'Mileage/Travel Cost:',
        //     show: true,
        //     class_name: '',
        //     value: game_settings.game.m_t_c,
        //     input_type: 'number',
        //     label_after: '',
        //     pattern: '',
        //     callback: value => changeSettings({
        //         settings_of: 'game_settings',
        //         key: 'game',
        //         key2: 'm_t_c',
        //         value,
        //     })
        // },
        // {
        //     type: 'Input',
        //     label: 'Penalty:',
        //     show: true,
        //     class_name: '',
        //     value: game_settings.game.p_e,
        //     input_type: 'number',
        //     label_after: '',
        //     pattern: '',
        //     callback: value => changeSettings({
        //         settings_of: 'game_settings',
        //         key: 'game',
        //         key2: 'p_e',
        //         value,
        //     })
        // },
        // {
        //     type: 'Input',
        //     label: 'Equipment Cost:',
        //     show: true,
        //     class_name: '',
        //     value: game_settings.game.e_c,
        //     input_type: 'number',
        //     label_after: '',
        //     pattern: '',
        //     callback: value => changeSettings({
        //         settings_of: 'game_settings',
        //         key: 'game',
        //         key2: 'e_c',
        //         value,
        //     })
        // },

    ];

    const payments = [
        {
            type: 'Select',
            label: 'Sign of reward:',
            show: true,
            options: ['₪', '£', '$', '€'],
            value: game_settings.payments.sign_of_reward,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'payments',
                key2: 'sign_of_reward',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Show up fee:',
            show: true,
            class_name: '',
            value: game_settings.payments.show_up_fee,
            input_type: 'number',
            step: 0.1,
            min: 0,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'payments',
                key2: 'show_up_fee',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Exchange ratio:',
            show: true,
            class_name: '',
            value: game_settings.payments.exchange_ratio,
            input_type: 'number',
            step: 0.1,
            min: 0,
            label_after: convertPointsRatio(game_settings.payments.sign_of_reward, game_settings.payments.exchange_ratio),
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'payments',
                key2: 'exchange_ratio',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Bonus endowment:',
            show: true,
            class_name: '',
            value: game_settings.payments.bonus_endowment,
            input_type: 'number',
            step: 0.1,
            min: 0,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'payments',
                key2: 'bonus_endowment',
                value,
            })
        },
    ];

    const modified_info = [
        {
            type: 'Label',
            label: 'Last modified:',
            show: true,
            class_name_b: 'settings-modified-lbl',
            second_label: game_settings.last_modified
        },
        {
            type: 'Label',
            label: 'Date modified:',
            show: true,
            class_name_b: 'settings-modified-lbl',
            second_label: game_settings.date_modified
        },
    ];

    return (
        <>
            <DivContainer
                className='admin-settings-section admin-settings-section-raw'
            >
                <DivContainer
                    className='admin-settings-section-col admin-settings-section-h'
                    elements={[{
                        type: 'Label',
                        label: 'General:',
                        show: true
                    }]}
                />
                <DivContainer
                    className='admin-settings-section-raw admin-settings-section-b'
                    elements={general}
                />

                <DivContainer
                    className='admin-settings-section-raw admin-settings-section-modified_info admin-settings-section-b'
                    elements={modified_info}
                />
            </DivContainer>

            <DivContainer
                className='admin-settings-section admin-settings-section-raw'
            >
                <DivContainer
                    className='admin-settings-section-col admin-settings-section-h'
                    elements={[{
                        type: 'Label',
                        label: 'Payment:',
                        show: true
                    }]}
                />
                <DivContainer
                    className='admin-settings-section-raw admin-settings-section-b'
                    elements={payments}
                />
            </DivContainer>

            <DivContainer
              className='admin-settings-section admin-settings-section-raw'
            >
                <DivContainer
                  className='admin-settings-section-col admin-settings-section-h'
                  elements={[{
                      type: 'Label',
                      label: 'Game settings:',
                      show: true
                  }]}
                />
                <DivContainer
                  className='admin-settings-section-raw admin-settings-section-b'
                  elements={g_settings}
                />
            </DivContainer>

            <DivContainer
              className='admin-settings-section admin-settings-section-raw'
            >
                <GamesBank
                  changeSettings={changeSettings}
                  game_bank={game_settings.game.g_b}
                  practice_game={game_settings.game.pt_g}
                />

            </DivContainer>

        </>
    )
};

Settings.propTypes = {
    exp: PropTypes.string.isRequired,
    game_settings: PropTypes.object.isRequired,
    changeSettings: PropTypes.func.isRequired,
    LAST_SETTING_NAME: PropTypes.string,
    versions_list: PropTypes.array.isRequired,
    exp_: PropTypes.string.isRequired,
};

export default Settings;
