import React from 'react';
import PropTypes from 'prop-types';
import {DivContainer} from "../../screens/settings/elements_builder";
import './cgStyles.css';
import {convertPointsRatio} from "../../screens/settings/settings";

const BtnItem = ({button_props, button_index, onChange}) => {
    const {p, w, l} = button_props;

    let btn_content;
    if (p === 0)
        btn_content = (
            <label>0 for certain</label>
        )
    else
        btn_content = (
            <>
                <div>
                    <label><b>{p}%</b> to win</label>
                    <input
                        type='number'
                        value={w}
                        onChange={e => onChange(button_index, 'w', e.target.value)}
                    />
                </div>

                <div>
                    <label><b>{100-p}%</b> to lose</label>
                    <input
                        type='number'
                        value={l}
                        onChange={e => onChange(button_index, 'l', e.target.value)}
                    />
                </div>
            </>
        )

    return (
        <div className='ncg-settings-btn_item'>
            {btn_content}
        </div>
    )
}
const Buttons = ({buttons, changeSettings}) => {
    const changeItem = (index, attr, value) => {
        let btn = [...buttons];
        btn[index][attr] = value;
        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'btn',
            value: btn,
        });
    }

    return (
        <div
            className='ncg-settings-btns'
        >
            {
                buttons.map(
                    (button, button_index) => (
                        <BtnItem
                            key={button_index}
                            button_props={button}
                            button_index={button_index}
                            onChange={changeItem}
                        />
                    )
                )
            }
        </div>
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
            type: 'Input',
            label: 'Trials:',
            show: true,
            class_name: '',
            value: game_settings.game.trials,
            input_type: 'number',
            step: 1,
            min: 1,
            label_after: '',
            pattern: '',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'trials',
                value,
            })
        },
        {
            type: 'Select',
            label: 'Expose all:',
            show: true,
            options: [
                {
                    value: true,
                    label: 'Yes'
                },
                {
                    value: false,
                    label: 'No'
                },
            ],
            value: game_settings.game.e_a,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'e_a',
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
                        label: 'Buttons:',
                        show: true
                    }]}
                />
                <Buttons
                    buttons={game_settings.game.btn}
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
