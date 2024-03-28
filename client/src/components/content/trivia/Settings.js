import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {DivContainer} from "../../screens/settings/elements_builder";
import {convertPointsRatio} from "../../screens/settings/settings";
import ColorPicker from "../../layout/colorPicker/color_picker";
import './triviaStyles.css';

const Colors = ({settings, changeSettings, label, attr}) => {
    return (
        <div className='t-o-g-u_set_m-s_kv'>
            <label>{label}</label>
            <ColorPicker
                defaultValue={settings[attr]}
                setSetting={value => {
                    changeSettings( {
                        settings_of: 'game_settings',
                        key: 'game',
                        key2: attr,
                        value,
                    })
                }}
            />
        </div>
    )
};

const MatrixItem = ({value, mat_attr, on_change}) => {

    return (
        <>
            <label>{mat_attr}</label>
            <input
                type='number'
                value={value}
                onChange={e => on_change(mat_attr, e.target.value)}
                min={(['PH', 'PMH'].indexOf(mat_attr)> -1 ? 0 : '') }
                max={(['PH', 'PMH'].indexOf(mat_attr)> -1 ? 1 : '') }
                step={(['PH', 'PMH'].indexOf(mat_attr)> -1 ? 0.01 : '') }
            />
        </>
    )
};

const game_tooltip = {
    game1: (
        <label>Basic game</label>
    ),
    game2: (
        <>
            <label>Punishing "give-up" selections:</label>
            <label>Every time a "give-up" key is selected,</label>
            <label>F points are subtracted from the final trial's payoff.</label>
        </>
    ),
    game3: (
        <>
            <label>Punishing exploitation of L results:</label>
            <label>Every time an "L" key is selected,</label>
            <label>F points are subtracted from the final trial's payoff.</label>
        </>
    ),
    game4: (
        <>
            <label>Punishing "give-up" selections & exploitation of L results:</label>
            <label>This game is combination of g=2 and g=3.</label>
        </>
    ),
    game5: (
        <>
            <label>Rewarding exploration of new “try” keys:</label>
            <label>Every time a new "try" key is selected,</label>
            <label>F points are added to the final trial's payoff.</label>
        </>
    ),
    game6: (
        <>
            <label>Rewarding every “try” selection:</label>
            <label>Every time a "try" key is selected,</label>
            <label>F points are added to the final trial's payoff.</label>
        </>
    ),

};

const GameElement = ({game_number, type, callback, game_index, chosen, disabled}) => {

    const [showInfo, setShowInfo] = useState(false);

    return (
        <div
            className='t-o-g-u_game_btn'
            style={chosen? {backgroundColor: 'blue', color: 'white'} : {}}
        >
            {
                ['Info', 'Remove'].indexOf(type) > -1 && (
                    <label
                        className={'t-o-g-u_game_btn_options ' + (type === 'Info' ? 'info ' : 'remove ') + (type === 'Remove' && game_index === 0 ? 'disabledElem' : '')}
                        onClick={() => (type === 'Info'? setShowInfo(true) : callback(game_index))}
                    >
                        {type === 'Info' ?'i' : 'x'}
                    </label>
                )
            }

            <label
                className='t-o-g-u_game_btn_g'
                onClick={disabled? undefined : ['Info', 'AddRandom', 'RemoveRandom'].indexOf(type) > -1 ? () => callback(game_number) : undefined}
            >
                {game_number === 'random' ? game_number : `Game ${game_number}`}</label>
            {
                showInfo && (
                    <div
                        className='t-o-g-u_game_btn_info'
                    >
                        {game_tooltip['game'+game_number]}
                        <button onClick={() => setShowInfo(false)}>Close</button>
                    </div>
                )
            }

        </div>
    )
}

const GamesPlay = ({changeSettings, settings}) => {

    const addGame = (game) => {
        let g_p = settings.g_p || [];
        g_p.push(game);

        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'g_p',
            value: g_p,
        });
    };

    const removeGame = (game_index) => {
        let g_p = settings.g_p || [];
        g_p = g_p.filter((g, g_i) => g_i !== game_index);
        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'g_p',
            value: g_p,
        });
    };

    return (
        <>
        <label>Test Setting</label> 
        </>
    )
}

const RandomFrom = ({changeSettings, settings}) => {

    const addGame = game => {
        const arr = settings.r_f? [...settings.r_f] : []
        const rnd_set = new Set([...arr, game.toString()]);

        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'r_f',
            value: Array.from(rnd_set).sort(),
        });
    };

    const removeGame = (game) => {
        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'r_f',
            value: settings.r_f.filter((g, g_i) => g !== game),
        });
    };

    const random_indexes = settings.r_f || [];

    return (
        <div
            style={{width: '90%', marginTop: 20, display: 'block'}}
            className='t-o-g-u_set_m-s_kv unselectable'
        >
            <div>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr',
                        gridColumnGap: '19px',
                        alignItems: 'center',
                        rowGap: '12px'
                    }}
                >

                    <label><b>Random from:</b></label>
                    <div className='t-o-g-u_set_items'>
                        {
                            ['1', '2', '3', '4', '5', '6'].map(
                                (game, game_i) => (
                                    <GameElement
                                        key={game_i}
                                        callback={random_indexes.indexOf(game) === -1 ? addGame : removeGame}
                                        game_number={game}
                                        game_index={random_indexes.indexOf(game_i)}
                                        chosen={random_indexes.indexOf(game) > -1}
                                        type={random_indexes.indexOf(game) > -1? 'RemoveRandom' : 'AddRandom'}
                                    />
                                )
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

const MatricesSettings = ({settings, changeSettings}) => {
    const try_mat = ['H', 'PH', 'L'];
    const give_up_mat = ['MH', 'PMH', 'ML'];

    const on_change = (attr, value) => {
        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: attr,
            value,
        });
    }

    return (
        <div className='t-o-g-u_set_m-s'>
            <Colors
                changeSettings={changeSettings}
                settings={settings}
                label='Matrix #1 color'
                attr='m1c'
            />
            <Colors
                changeSettings={changeSettings}
                settings={settings}
                label='Matrix #2 color'
                attr='m2c'
            />

            <div className='t-o-g-u_set_m-s_kv'>
                <label>Matrices cols:</label>
                <input
                    value={settings.mc}
                    onChange={e => on_change('mc', e.target.value)}
                    type='number'
                    step={1}
                    min={1}
                />
            </div>

            <div className='t-o-g-u_set_m-s_kv'>
                <label>Matrices rows:</label>
                <input
                    value={settings.mr}
                    onChange={e => on_change('mr', e.target.value)}
                    type='number'
                    step={1}
                    min={1}
                />
            </div>

            <div className='t-o-g-u_set_m-s_m'>
                <div className='t-o-g-u_set_m-s_mb'>
                    <label>Try Matrix:</label>
                    <div>
                        {
                            try_mat.map(
                                tm => (
                                    <MatrixItem
                                        on_change={on_change}
                                        key={tm}
                                        mat_attr={tm}
                                        value={settings[tm]}
                                    />
                                )
                            )
                        }
                    </div>
                </div>

                <div className='t-o-g-u_set_m-s_mb'>
                    <label>GiveUp Matrix:</label>
                    <div>
                        {
                            give_up_mat.map(
                                g_u_m => (
                                    <MatrixItem
                                        on_change={on_change}
                                        key={g_u_m}
                                        mat_attr={g_u_m}
                                        value={settings[g_u_m]}
                                    />
                                )
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
        );
};

const Settings = ({game_settings, changeSettings, LAST_SETTING_NAME, versions_list, exp_more_settings}) => {

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
            // label_after: `${game_settings.payments.sign_of_reward}1=${game_settings.payments.exchange_ratio} ${game_settings.payments.exchange_ratio !== 1 ? 'points' : 'point'}         1 point=${game_settings.payments.sign_of_reward}${game_settings.payments.exchange_ratio === 0 ? 0 : 1/game_settings.payments.exchange_ratio}`,
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

    const game_elements = [

        {
            type: 'Input',
            label: 'Rounds:',
            show: true,
            class_name: '',
            value: game_settings.game.r,
            input_type: 'number',
            step: 1,
            min: 1,
            label_after: '',
            pattern: '',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'r',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Trial:',
            show: true,
            class_name: '',
            value: game_settings.game.t,
            input_type: 'number',
            step: 1,
            min: 1,
            label_after: '',
            pattern: '',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 't',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Exploration cost:',
            show: true,
            class_name: '',
            value: game_settings.game.e_c,
            input_type: 'number',
            min: 0,
            pattern: '',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'e_c',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Punishment\\Reward:',
            show: true,
            class_name: '',
            value: game_settings.game.f,
            input_type: 'number',
            label_after: ' (F)',
            pattern: '',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'f',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Display pay for:',
            show: true,
            class_name: '',
            value: game_settings.general.d_p,
            input_type: 'number',
            step: 0.1,
            min: 0,
            label_after: 'second',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'general',
                key2: 'd_p',
                value,
            })
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

