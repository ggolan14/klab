import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {DivContainer} from "../../screens/settings/elements_builder";
import {convertPointsRatio} from "../../screens/settings/settings";

const ProblemItem = ({index, className, problem, changeItem, ev_gap, inferior_mean, superior_mean, setDeleteIndex}) => {
    return (
        <tr
            className={className}
        >
            <td>{index+1}.</td>
            <td>
                <select
                    value={problem.level}
                    onChange={e => changeItem(index, 'level', e.target.value, null)}
                >
                    <option value={'Real'}>Real</option>
                    <option value={'Practice'}>Practice</option>
                    <option value={'Practice1'}>Practice1</option>
                    <option value={'Practice2'}>Practice2</option>
                    <option value={'Practice3'}>Practice3</option>
                    <option value={'Practice4'}>Practice4</option>
                </select>
            </td>


            <td>
                <select
                    value={problem.difficulty_level}
                    onChange={e => changeItem(index, 'difficulty_level', e.target.value, null)}
                >
                    <option value={'Lowest'}>Lowest</option>
                    <option value={'Low'}>Low</option>
                    <option value={'Med-Low'}>Med-Low</option>
                    <option value={'Medium'}>Medium</option>
                    <option value={'High'}>High</option>
                    <option value={'Med-High'}>Med-High</option>
                    <option value={'Highest'}>Highest</option>
                </select>
            </td>

            <td>
                <label>{ev_gap}</label>
            </td>

            <td
            >
                <div>
                    <div
                        className='value_option'
                    >
                        <div>
                            <label>low</label>
                            <input
                                value={problem.values_inferior_option.low}
                                onChange={e => changeItem(index, 'values_inferior_option', e.target.value, 'low')}
                            />
                        </div>

                        <div>
                            <label>high</label>
                            <input
                                value={problem.values_inferior_option.high}
                                onChange={e => changeItem(index,'values_inferior_option', e.target.value, 'high')}
                            />
                        </div>
                    </div>

                    <label className='mean'>(mean = {inferior_mean})</label>
                </div>
            </td>

            <td>
                <div>
                    <div
                        className='value_option'
                    >
                        <div>
                            <label>low</label>
                            <input
                                value={problem.values_superior_option.low}
                                onChange={e => changeItem(index,'values_superior_option', e.target.value, 'low')}
                            />
                        </div>

                        <div>
                            <label>high</label>
                            <input
                                value={problem.values_superior_option.high}
                                onChange={e => changeItem(index,'values_superior_option', e.target.value, 'high')}
                            />
                        </div>
                    </div>

                    <label className='mean'>(mean = {superior_mean})</label>
                </div>
            </td>

            <td>
                <button
                    onClick={() => setDeleteIndex(index)}
                    // onClick={() => onDelete()}
                >Delete</button>
            </td>

        </tr>
    )
}


const ProblemsBank = ({problems_bank, changeSettings}) => {

    const [deleteIndex, setDeleteIndex] = useState(null);

    const addItem = () => {
        let new_item = {
            difficulty_level: 'Highest',
            EV_gap: 1,
            values_inferior_option: {
                low: 2,
                high: 2
            },
            values_superior_option: {
                low: 3,
                high: 3
            },
            level: 'Real',
            uniq: 'None'
        };

        let p_bank = [...problems_bank, new_item];
        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'problems_bank',
            value: p_bank,
        });
    }

    const removeItem = () => {
        let p_bank = problems_bank.filter(
            (p, index) => index !== deleteIndex
        );

        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'problems_bank',
            value: p_bank,
        });
        setDeleteIndex(null);
    }

    const changeItem = (index, attr, value, second_attr) => {
        let p_bank = [...problems_bank];

        if (second_attr !== null)
            p_bank[index][attr][second_attr] = value;
        else
            p_bank[index][attr] = value;

        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'problems_bank',
            value: p_bank,
        });
    }

    return (
        <>
            <div
                className='M_S-ProblemsBank'
            >
                <button onClick={addItem}>Add item</button>
                <table>
                    <thead>
                    <tr>
                        <th><u>Index</u></th>
                        <th><u>Level</u></th>
                        <th><u>Difficulty level</u></th>
                        <th><u>EV_gap</u></th>
                        <th><u>Values inferior option</u></th>
                        <th><u>Values superior option</u></th>
                        <th></th>
                    </tr>
                    </thead>

                    <tbody>
                    {/*EV_gap: 2*/}
                    {/*difficulty_level: "High"*/}
                    {/*level: "Practice"*/}
                    {/*values_inferior_option: low: 52, high: 58*/}
                    {/*values_superior_option: low: 54, high: 60*/}
                    {
                        problems_bank.map(
                            (problem, index) => {
                                const className = problem.level.includes('Practice') ? 'practice' : 'real';

                                let inferior_mean = (Number(problem.values_inferior_option.low) + Number(problem.values_inferior_option.high)) / 2;
                                let superior_mean = (Number(problem.values_superior_option.low) + Number(problem.values_superior_option.high)) / 2;
                                let ev_gap = Math.abs(inferior_mean - superior_mean);

                                return (
                                    <ProblemItem
                                        key={problem.level + index}
                                        changeItem={changeItem}
                                        problem={problem}
                                        index={index}
                                        className={className}
                                        setDeleteIndex={setDeleteIndex}
                                        inferior_mean={inferior_mean}
                                        superior_mean={superior_mean}
                                        ev_gap={ev_gap}
                                    />
                                )
                            })
                    }
                    </tbody>
                </table>
            </div>

            {
                deleteIndex !== null && (
                    <div
                        className='M_S-ProblemsBank_DeleteIndex'
                    >
                        <div>
                            <label>Are you sure to delete <span>{deleteIndex+1}</span>?</label>
                            <div>
                                <button onClick={() => setDeleteIndex(null)}>Cancel</button>
                                <button onClick={removeItem}>Yes</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

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

    const game_elements = [
        {
            type: 'Input',
            label: 'Real trials:',
            show: true,
            class_name: '',
            value: game_settings.game.real_trials,
            input_type: 'number',
            step: 1,
            min: 1,
            label_after: '',
            pattern: '',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'real_trials',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Sampling delay:',
            show: true,
            class_name: '',
            value: game_settings.game.sampling_delay,
            input_type: 'number',
            step: 1,
            min: 1,
            label_after: 'Seconds',
            pattern: '',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'sampling_delay',
                value,
            })
        },
        {
            type: 'Select',
            label: 'Random order (Real):',
            show: true,
            options: ['Yes', 'No'],
            value: game_settings.game.random_o,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'random_o',
                value,
            })
        },
        {
            type: 'Select',
            label: 'Condition:',
            show: true,
            options: [
                {
                    value: 'g',
                    label: 'With Gap'
                },
                {
                    value: 'ng',
                    label: 'Without Gap'
                },
                {
                    value: 'r',
                    label: 'Random'
                },
                {
                    value: 'a',
                    label: 'Alternate'
                },
            ],
            value: game_settings.game.con,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'con',
                value,
            })
        },
        // {
        //     type: 'Input',
        //     label: 'Practice trials:',
        //     show: true,
        //     class_name: '',
        //     value: game_settings.game.practice_trials,
        //     input_type: 'number',
        //     step: 1,
        //     min: 1,
        //     label_after: '',
        //     pattern: '',
        //     callback: value => changeSettings({
        //         settings_of: 'game_settings',
        //         key: 'game',
        //         key2: 'practice_trials',
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
                    elements={game_elements}
                />
            </DivContainer>

            <DivContainer
                className='admin-settings-section admin-settings-section-raw'
            >
                <DivContainer
                    className='admin-settings-section-col admin-settings-section-h'
                    elements={[{
                        type: 'Label',
                        label: 'Problems bank:',
                        show: true
                    }]}
                />

                <div>
                    <label style={{color: 'red', fontWeight: 'bold'}}>Notice:</label>
                    <label>Difficulty level - if you dont choose specific practice for round X its choose random practice</label>
                </div>

                <ProblemsBank
                    changeSettings={changeSettings}
                    problems_bank={game_settings.game.problems_bank}
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
