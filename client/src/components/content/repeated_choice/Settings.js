import React from 'react';
import PropTypes from 'prop-types';
import {DivContainer} from "../../screens/settings/elements_builder";
import {convertPointsRatio} from "../../screens/settings/settings";

const PatternArray = ({pattern, changeSettings, key2}) => {

    return (
        <div className='settings_rc-pattern-template'>
            <label>Pattern:</label>
            {
                pattern.map(
                    (ceil_val, index) => {
                        return (
                            <select
                                key={ceil_val+index}
                                onChange={e => {
                                    let arr = [...pattern];
                                    arr[index] = e.target.value;
                                    changeSettings({
                                        settings_of: 'game_settings',
                                        key: 'game',
                                        key2,
                                        value: arr,
                                    })
                                }}
                                value={ceil_val}
                            >
                                <option key={ceil_val+index+'high_risky_value'} value={'H'}>H</option>
                                <option key={ceil_val+index+'low_risky_value'} value={'L'}>L</option>
                            </select>
                        )
                    }
                )
            }
        </div>
    )
};

const TASKS = ['PL', 'RD', 'RT', 'RX', 'DFE_Pattern', 'PL_Pattern', 'Pattern', 'Conspiracy'];
const OptionsTask = ({game_settings, changeSettings}) => {
    return (
        <div
            className='rc-settings-tasks'
        >
            <div
                className='rc-settings-tasks-check'
            >
                <label>Attention check:</label>
                <div>
                    {
                        ['PL', 'RD', 'RT'].map(
                            task => (
                                <label
                                    key={task + 'task_check_lbl'}
                                >
                                    <input
                                        key={task + 'task_check_input'}
                                        checked={game_settings.game[task.toLowerCase() + '_task_check']}
                                        type='checkbox'
                                        onChange={e => changeSettings({
                                            settings_of: 'game_settings',
                                            key: 'game',
                                            key2: task.toLowerCase() + '_task_check',
                                            value: e.target.checked,
                                        })}
                                    />{task}
                                </label>
                            )
                        )
                    }
                </div>
            </div>
            <button
                onClick={() => {

                    changeSettings({
                        settings_of: 'game_settings',
                        key: 'game',
                        key2: 'tasks',
                        value: [...game_settings.game.tasks, TASKS[0]],
                    })
                }}
            >
                Add task
            </button>
            <div className='rc-settings-tasks-list'>
                <label>Tasks</label>
                <div
                    className='rc-settings-tasks-list-items'
                >
                    {
                        game_settings.game.tasks.map(
                            (ceil_val, index) => {
                                return (
                                    <div
                                        className='rc-settings-tasks-list-item'
                                        key={'dp' + ceil_val+index}
                                    >
                                        <label key={'l' + ceil_val+index}>{index+1}</label>
                                        <div
                                            key={'d' + ceil_val+index}
                                        >
                                            <label
                                                key={'dl' + ceil_val+index}
                                                onClick={() => (
                                                    changeSettings({
                                                        settings_of: 'game_settings',
                                                        key: 'game',
                                                        key2: 'tasks',
                                                        value: game_settings.game.tasks.filter(
                                                            (t,t_i) => t_i !== index
                                                        ),
                                                    })
                                                )}
                                            >X</label>
                                            <select
                                                key={'select' + ceil_val+index}
                                                onChange={e => {
                                                    let arr = [...game_settings.game.tasks];
                                                    arr[index] = e.target.value;
                                                    changeSettings({
                                                        settings_of: 'game_settings',
                                                        key: 'game',
                                                        key2: 'tasks',
                                                        value: arr,
                                                    })
                                                }}
                                                value={ceil_val}
                                            >
                                                {
                                                    TASKS.map(
                                                        task_e => (
                                                            <option
                                                                key={'t_e'+task_e}
                                                                disabled={task_e === 'Conspiracy' && game_settings.game.tasks.includes('Conspiracy')}
                                                            >
                                                                {task_e}
                                                            </option>
                                                        )
                                                    )
                                                }
                                            </select>
                                        </div>
                                    </div>
                                )
                            }
                        )
                    }
                </div>
            </div>
        </div>
    )
}

const RandomDescribes = for_what => {
    let label1 = for_what === 'rx' ? 'rt/rd' : 'dfe_p/pl_p';
    return {
        first_once: `Random the first ${label1} and keep it for ${for_what} > 2`,
        first_always: `Random the first ${label1} for each ${for_what} couple`,
        full: `Always random ${label1}`,
    }
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

    const tasks_settings = [
        {
            type: 'Select',
            label: 'Language:',
            show: true,
            options: ['English', 'German'],
            value: game_settings.game.language,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'language',
                value,
            })
        },
        {
            type: 'Select',
            label: 'Random task order:',
            show: true,
            options: ['true', 'false'],
            value: game_settings.game.random_task_order,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'random_task_order',
                value,
            })
        },
        {
            type: 'Select',
            label: 'RX random:',
            show: true,
            options: ['first_once', 'first_always', 'full'],
            value: game_settings.game.rx,
            label_after: <span style={{color: 'blueviolet'}}>{RandomDescribes('rx')[game_settings.game.rx]}</span>,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'rx',
                value,
            })
        },
        {
            type: 'Select',
            label: 'Pattern random:',
            show: true,
            options: ['first_once', 'first_always', 'full'],
            value: game_settings.game.pattern,
            label_after: <span style={{color: 'blueviolet'}}>{RandomDescribes('pattern')[game_settings.game.pattern]}</span>,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'pattern',
                value,
            })
        },
    ];

    const pl_settings = [
        {
            type: 'Input',
            label: 'Number of trials:',
            show: true,
            class_name: '',
            value: game_settings.game.pl_number_of_trials,
            input_type: 'number',
            step: 1,
            min: 1,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'pl_number_of_trials',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Prob common button:',
            show: true,
            class_name: '',
            value: game_settings.game.pl_prob_common_button,
            input_type: 'number',
            step: 0.1,
            min: 0,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'pl_prob_common_button',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Feedback sec:',
            show: true,
            class_name: '',
            value: game_settings.game.pl_feedback_sec,
            input_type: 'number',
            step: 0.1,
            min: 0,
            label_after: 'seconds',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'pl_feedback_sec',
                value,
            })
        },
    ];

    const rt_settings = [
        {
            type: 'Input',
            label: 'Number of trials:',
            show: true,
            class_name: '',
            value: game_settings.game.rt_number_of_trials,
            input_type: 'number',
            step: 1,
            min: 1,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'rt_number_of_trials',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Feedback sec:',
            show: true,
            class_name: '',
            value: game_settings.game.rt_feedback_sec,
            input_type: 'number',
            step: 0.1,
            min: 0,
            label_after: 'seconds',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'rt_feedback_sec',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Risk rare value:',
            show: true,
            class_name: '',
            value: game_settings.game.rt_risk_rare_value,
            input_type: 'number',
            step: 1,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'rt_risk_rare_value',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Risk common value:',
            show: true,
            class_name: '',
            value: game_settings.game.rt_risk_common_value,
            input_type: 'number',
            step: 1,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'rt_risk_common_value',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Rare prob:',
            show: true,
            class_name: '',
            value: game_settings.game.rt_rare_prob,
            input_type: 'number',
            step: 0.1,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'rt_rare_prob',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Safe value:',
            show: true,
            class_name: '',
            value: game_settings.game.rt_safe_value,
            input_type: 'number',
            step: 1,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'rt_safe_value',
                value,
            })
        },
    ];

    const rd_settings = [
        {
            type: 'Input',
            label: 'Number of trials:',
            show: true,
            class_name: '',
            value: game_settings.game.rd_number_of_trials,
            input_type: 'number',
            step: 1,
            min: 1,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'rd_number_of_trials',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Feedback sec:',
            show: true,
            class_name: '',
            value: game_settings.game.rd_feedback_sec,
            input_type: 'number',
            step: 0.1,
            min: 0,
            label_after: 'seconds',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'rd_feedback_sec',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Risk rare value:',
            show: true,
            class_name: '',
            value: game_settings.game.rd_risk_rare_value,
            input_type: 'number',
            step: 1,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'rd_risk_rare_value',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Risk common value:',
            show: true,
            class_name: '',
            value: game_settings.game.rd_risk_common_value,
            input_type: 'number',
            step: 1,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'rd_risk_common_value',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Rare prob:',
            show: true,
            class_name: '',
            value: game_settings.game.rd_rare_prob,
            input_type: 'number',
            step: 0.1,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'rd_rare_prob',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Safe value:',
            show: true,
            class_name: '',
            value: game_settings.game.rd_safe_value,
            input_type: 'number',
            step: 1,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'rd_safe_value',
                value,
            })
        },
    ];

    const pattern_settings = [
        {
            type: 'Input',
            label: 'Number of trials:',
            show: true,
            class_name: '',
            value: game_settings.game.pattern_number_of_trials,
            input_type: 'number',
            step: 1,
            min: 1,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'pattern_number_of_trials',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Feedback sec:',
            show: true,
            class_name: '',
            value: game_settings.game.pattern_spacebar_time,
            input_type: 'number',
            step: 0.1,
            min: 0,
            label_after: 'seconds',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'pattern_spacebar_time',
                value,
            })
        },
    ];

    const pl_pattern_settings = [
        {
            type: 'Input',
            label: 'Pattern size:',
            show: true,
            class_name: '',
            value: game_settings.game.pl_pattern_template.length,
            input_type: 'number',
            step: 1,
            min: 1,
            callback: value => {
                let arr = [...game_settings.game.pl_pattern_template];
                value = Number(value);
                if (arr.length < value )
                    arr.push('H');
                else
                    arr = arr.slice(0, value);
                changeSettings({
                    settings_of: 'game_settings',
                    key: 'game',
                    key2: 'pl_pattern_template',
                    value: arr,
                })
            }
        },
    ];

    const dfe_pattern_settings = [
        {
            type: 'Input',
            label: 'Safe outcome:',
            show: true,
            class_name: '',
            value: game_settings.game.dfe_pattern_safe_outcome,
            input_type: 'number',
            step: 1,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'dfe_pattern_safe_outcome',
                value,
            })
        },
        {
            type: 'Input',
            label: 'High risky value:',
            show: true,
            class_name: '',
            value: game_settings.game.dfe_pattern_high_risky_value,
            input_type: 'number',
            step: 1,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'dfe_pattern_high_risky_value',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Low risky value:',
            show: true,
            class_name: '',
            value: game_settings.game.dfe_pattern_low_risky_value,
            input_type: 'number',
            step: 1,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'dfe_pattern_low_risky_value',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Pattern size:',
            show: true,
            class_name: '',
            value: game_settings.game.dfe_pattern_template.length,
            input_type: 'number',
            step: 1,
            min: 1,
            callback: value => {
                let arr = [...game_settings.game.dfe_pattern_template];
                value = Number(value);
                if (arr.length < value )
                    arr.push('H');
                else
                    arr = arr.slice(0, value);
                changeSettings({
                    settings_of: 'game_settings',
                    key: 'game',
                    key2: 'dfe_pattern_template',
                    value: arr,
                })
            }
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
            label: 'Exchange ratio PL:',
            show: true,
            class_name: '',
            value: game_settings.payments.exchange_ratio_pl,
            input_type: 'number',
            step: 0.1,
            min: 0,
            // label_after: `${game_settings.payments.sign_of_reward}1=${game_settings.payments.exchange_ratio} ${game_settings.payments.exchange_ratio !== 1 ? 'points' : 'point'}         1 point=${game_settings.payments.sign_of_reward}${game_settings.payments.exchange_ratio === 0 ? 0 : 1/game_settings.payments.exchange_ratio}`,
            label_after: convertPointsRatio(game_settings.payments.sign_of_reward, game_settings.payments.exchange_ratio_pl),
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'payments',
                key2: 'exchange_ratio_pl',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Exchange ratio RT:',
            show: true,
            class_name: '',
            value: game_settings.payments.exchange_ratio_rt,
            input_type: 'number',
            step: 0.1,
            min: 0,
            // label_after: `${game_settings.payments.sign_of_reward}1=${game_settings.payments.exchange_ratio} ${game_settings.payments.exchange_ratio !== 1 ? 'points' : 'point'}         1 point=${game_settings.payments.sign_of_reward}${game_settings.payments.exchange_ratio === 0 ? 0 : 1/game_settings.payments.exchange_ratio}`,
            label_after: convertPointsRatio(game_settings.payments.sign_of_reward, game_settings.payments.exchange_ratio_rt),
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'payments',
                key2: 'exchange_ratio_rt',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Exchange ratio RD:',
            show: true,
            class_name: '',
            value: game_settings.payments.exchange_ratio_rd,
            input_type: 'number',
            step: 0.1,
            min: 0,
            // label_after: `${game_settings.payments.sign_of_reward}1=${game_settings.payments.exchange_ratio} ${game_settings.payments.exchange_ratio !== 1 ? 'points' : 'point'}         1 point=${game_settings.payments.sign_of_reward}${game_settings.payments.exchange_ratio === 0 ? 0 : 1/game_settings.payments.exchange_ratio}`,
            label_after: convertPointsRatio(game_settings.payments.sign_of_reward, game_settings.payments.exchange_ratio_rd),
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'payments',
                key2: 'exchange_ratio_rd',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Exchange ratio PL Pattern:',
            show: true,
            class_name: '',
            value: game_settings.payments.exchange_ratio_pl_pattern,
            input_type: 'number',
            step: 0.1,
            min: 0,
            // label_after: `${game_settings.payments.sign_of_reward}1=${game_settings.payments.exchange_ratio} ${game_settings.payments.exchange_ratio !== 1 ? 'points' : 'point'}         1 point=${game_settings.payments.sign_of_reward}${game_settings.payments.exchange_ratio === 0 ? 0 : 1/game_settings.payments.exchange_ratio}`,
            label_after: convertPointsRatio(game_settings.payments.sign_of_reward, game_settings.payments.exchange_ratio_pl_pattern),
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'payments',
                key2: 'exchange_ratio_pl_pattern',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Exchange ratio DFE Pattern:',
            show: true,
            class_name: '',
            value: game_settings.payments.exchange_ratio_dfe_pattern,
            input_type: 'number',
            step: 0.1,
            min: 0,
            // label_after: `${game_settings.payments.sign_of_reward}1=${game_settings.payments.exchange_ratio} ${game_settings.payments.exchange_ratio !== 1 ? 'points' : 'point'}         1 point=${game_settings.payments.sign_of_reward}${game_settings.payments.exchange_ratio === 0 ? 0 : 1/game_settings.payments.exchange_ratio}`,
            label_after: convertPointsRatio(game_settings.payments.sign_of_reward, game_settings.payments.exchange_ratio_dfe_pattern),
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'payments',
                key2: 'exchange_ratio_dfe_pattern',
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
                        label: 'Task select:',
                        show: true
                    }]}
                />

                <DivContainer
                    className='admin-settings-section-raw admin-settings-section-b'
                    elements={tasks_settings}
                />

                <OptionsTask
                    game_settings={game_settings}
                    changeSettings={changeSettings}
                />
            </DivContainer>



            <DivContainer
                className='admin-settings-section admin-settings-section-raw'
            >
                <DivContainer
                    className='admin-settings-section-col admin-settings-section-h'
                    elements={[{
                        type: 'Label',
                        label: 'PL settings:',
                        show: true
                    }]}
                />
                <DivContainer
                    className='admin-settings-section-raw admin-settings-section-b'
                    elements={pl_settings}
                />
            </DivContainer>

            <DivContainer
                className='admin-settings-section admin-settings-section-raw'
            >
                <DivContainer
                    className='admin-settings-section-col admin-settings-section-h'
                    elements={[{
                        type: 'Label',
                        label: 'RT settings:',
                        show: true
                    }]}
                />
                <DivContainer
                    className='admin-settings-section-raw admin-settings-section-b'
                    elements={rt_settings}
                />
            </DivContainer>

            <DivContainer
                className='admin-settings-section admin-settings-section-raw'
            >
                <DivContainer
                    className='admin-settings-section-col admin-settings-section-h'
                    elements={[{
                        type: 'Label',
                        label: 'RD settings:',
                        show: true
                    }]}
                />
                <DivContainer
                    className='admin-settings-section-raw admin-settings-section-b'
                    elements={rd_settings}
                />
            </DivContainer>

            <DivContainer
                className='admin-settings-section admin-settings-section-raw'
            >
                <DivContainer
                    className='admin-settings-section-col admin-settings-section-h'
                    elements={[{
                        type: 'Label',
                        label: 'Pattern settings:',
                        show: true
                    }]}
                />
                <DivContainer
                    className='admin-settings-section-raw admin-settings-section-b'
                    elements={pattern_settings}
                />
            </DivContainer>

            <DivContainer
                className='admin-settings-section admin-settings-section-raw'
            >
                <DivContainer
                    className='admin-settings-section-col admin-settings-section-h'
                    elements={[{
                        type: 'Label',
                        label: 'PL pattern settings:',
                        show: true
                    }]}
                />
                <DivContainer
                    className='admin-settings-section-raw admin-settings-section-b'
                    elements={pl_pattern_settings}
                />
                <PatternArray
                    key2='pl_pattern_template'
                    pattern={game_settings.game.pl_pattern_template}
                    changeSettings={changeSettings}
                />
            </DivContainer>

            <DivContainer
                className='admin-settings-section admin-settings-section-raw'
            >
                <DivContainer
                    className='admin-settings-section-col admin-settings-section-h'
                    elements={[{
                        type: 'Label',
                        label: 'DFE pattern settings:',
                        show: true
                    }]}
                />
                <DivContainer
                    className='admin-settings-section-raw admin-settings-section-b'
                    elements={dfe_pattern_settings}
                />
                <PatternArray
                    key2='dfe_pattern_template'
                    pattern={game_settings.game.dfe_pattern_template}
                    changeSettings={changeSettings}
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
