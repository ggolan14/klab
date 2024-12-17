import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DivContainer } from "../../screens/settings/elements_builder";
import { convertPointsRatio } from "../../screens/settings/settings";
import { generalSettings, paymentSettings } from "../../utils/settingsConfig";
import './ctStyles.css';

const new_game_props = {
    active: 'Yes',
    t: 3, // Trials
    p0: 0.05, // First Probability
    a: 0.2, // Adaptability
    r_v: 1, // Reward Value
    t_c: 1, // Toll Cost
    c_c: 1, // Clearing Cost
};

const GameElement = ({ gameSelect, game_props, editGame }) => {
    const practice_game = gameSelect === 'practice_game';
    let g_settings = [];

    if (!practice_game)
        g_settings.push({
            type: 'Select',
            label: 'Active:',
            show: true,
            options: [
                { label: 'Yes', value: 'Yes' },
                { label: 'No', value: 'No' },
            ],
            value: game_props.active,
            callback: value => editGame(gameSelect, 'active', value)
        });

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
            callback: value => editGame(gameSelect, 't', value)
        },
        {
            type: 'Input',
            label: 'Reward value:',
            show: true,
            class_name: '',
            value: game_props.r_v,
            input_type: 'number',
            callback: value => editGame(gameSelect, 'r_v', value)
        },
        {
            type: 'Input',
            label: 'Toll cost:',
            show: true,
            class_name: '',
            value: game_props.t_c,
            input_type: 'number',
            callback: value => editGame(gameSelect, 't_c', value)
        },
        {
            type: 'Input',
            label: 'Clearing cost:',
            show: true,
            class_name: '',
            value: game_props.c_c,
            input_type: 'number',
            callback: value => editGame(gameSelect, 'c_c', value)
        },
        {
            type: 'Input',
            label: 'P0:',
            show: true,
            class_name: '',
            value: game_props.p0,
            input_type: 'number',
            callback: value => editGame(gameSelect, 'p0', value)
        },
        {
            type: 'Input',
            label: 'Adaptability:',
            show: true,
            class_name: '',
            value: game_props.a,
            input_type: 'number',
            callback: value => editGame(gameSelect, 'a', value)
        },
    ];

    return (
        <div className={`qg_set-ge_container ${!practice_game ? (game_props.active === 'Yes' ? 'qg_set-ge_active' : 'qg_set-ge_not-active') : 'qg_set-ge_p-b'}`}>
            <DivContainer className='admin-settings-section-raw admin-settings-section-b' elements={g_settings} />
        </div>
    );
};

const ListElement = ({ game_index, game_active, gameSelect, setGameSelect, removeGame }) => {
    const is_practice_game = game_index === 'practice_game';
    return (
        <div
            className={is_practice_game ? 'qg_set-ge_p' : (game_active === 'Yes' ? 'qg_set-ge_active' : 'qg_set-ge_not-active')}
            style={gameSelect === game_index ? { backgroundColor: 'blue', color: 'white' } : {}}
        >
            <label onClick={() => setGameSelect(game_index)}>
                {!is_practice_game ? `Game ${game_index + 1}` : 'Practice Game'}
            </label>

            {!is_practice_game && (
                <button className='btn-delete' onClick={() => removeGame(game_index)}>
                    Delete
                </button>
            )}
        </div>
    );
};

const GamesBank = ({ changeSettings, game_bank, practice_game }) => {
    const [gameSelect, setGameSelect] = useState(null);

    const addNewGame = () => {
        const gb = JSON.parse(JSON.stringify(game_bank));
        gb.push(JSON.parse(JSON.stringify(new_game_props)));
        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'g_b',
            value: gb,
        });
    };

    const removeGame = game_index => {
        let gb = JSON.parse(JSON.stringify(game_bank));
        gb = gb.filter((_, g_i) => g_i !== game_index);
        setGameSelect(null);
        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'g_b',
            value: gb,
        });
    };

    const editGame = (game_index, attr, value) => {
        if (game_index === 'practice_game') {
            const pt_g = { ...practice_game, [attr]: value };
            changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'pt_g',
                value: pt_g,
            });
        } else {
            const gb = [...game_bank];
            gb[game_index][attr] = value;
            changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'g_b',
                value: gb,
            });
        }
    };

    return (
        <div className='qg_set-gb_container'>
            <div className='qg_set-gb_head'>
                <label>Games Bank:</label>
                <button className='btn-add' onClick={addNewGame}>
                    Add new game
                </button>
            </div>

            <div className='qg_set-gb_body'>
                <div className='qg_set-gb_list unselectable'>
                    <ListElement game_index={'practice_game'} gameSelect={gameSelect} setGameSelect={setGameSelect} />
                    {game_bank.map((game_, game_index) => (
                        <ListElement
                            key={game_index}
                            game_index={game_index}
                            game_active={game_.active}
                            removeGame={removeGame}
                            gameSelect={gameSelect}
                            setGameSelect={setGameSelect}
                        />
                    ))}
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
    );
};

const Settings = ({ game_settings, changeSettings, LAST_SETTING_NAME, versions_list }) => {
    const general = generalSettings(game_settings, LAST_SETTING_NAME, versions_list, changeSettings);
    const payments = paymentSettings(game_settings, changeSettings, convertPointsRatio);

    const modified_info = [
        {
            type: 'Label',
            label: 'Last modified:',
            show: true,
            class_name_b: 'settings-modified-lbl',
            second_label: game_settings.last_modified,
        },
        {
            type: 'Label',
            label: 'Date modified:',
            show: true,
            class_name_b: 'settings-modified-lbl',
            second_label: game_settings.date_modified,
        },
    ];

    return (
        <>
            <DivContainer className='admin-settings-section admin-settings-section-raw'>
                <DivContainer className='admin-settings-section-col admin-settings-section-h' elements={[{ type: 'Label', label: 'General:', show: true }]} />
                <DivContainer className='admin-settings-section-raw admin-settings-section-b' elements={general} />
                <DivContainer className='admin-settings-section-raw admin-settings-section-modified_info admin-settings-section-b' elements={modified_info} />
            </DivContainer>

            <DivContainer className='admin-settings-section admin-settings-section-raw'>
                <DivContainer className='admin-settings-section-col admin-settings-section-h' elements={[{ type: 'Label', label: 'Payment:', show: true }]} />
                <DivContainer className='admin-settings-section-raw admin-settings-section-b' elements={payments} />
            </DivContainer>

            <DivContainer className='admin-settings-section admin-settings-section-raw'>
                <GamesBank changeSettings={changeSettings} game_bank={game_settings.game.g_b} practice_game={game_settings.game.pt_g} />
            </DivContainer>
        </>
    );
};

Settings.propTypes = {
    game_settings: PropTypes.object.isRequired,
    changeSettings: PropTypes.func.isRequired,
    LAST_SETTING_NAME: PropTypes.string,
    versions_list: PropTypes.array.isRequired,
};

export default Settings;
