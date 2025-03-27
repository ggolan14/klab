import React from 'react';
import PropTypes from 'prop-types';
import { DivContainer } from "../../screens/settings/elements_builder";
import { convertPointsRatio } from "../../screens/settings/settings";
import { generalSettings,paymentSettings } from '../../utils/settingsConfig';

const Settings = ({ game_settings, changeSettings, LAST_SETTING_NAME, versions_list }) => {
    const general = generalSettings(game_settings, LAST_SETTING_NAME, versions_list, changeSettings);
    const payments = paymentSettings(game_settings, changeSettings, convertPointsRatio);

    const game_elements = [
        {
            type: 'Select',
            label: 'Mode:',
            show: true,
            options: [
                {
                    value: 'c',
                    label: 'Clustered'
                },
                {
                    value: 'd',
                    label: 'Diffuse'
                },
                {
                    value: 'u_d',
                    label: 'Uniform distribution'
                },
                {
                    value: 'rand',
                    label: 'Random'
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
            label: 'Show path:',
            show: true,
            options: ['true', 'false'],
            value: game_settings.game.show_path,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'show_path',
                value,
            })
        },
        {
            type: 'Select',
            label: 'Show resources:',
            show: true,
            options: ['true', 'false'],
            value: game_settings.game.show_resources,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'show_resources',
                value,
            })
        },
        /*
        {
            type: 'Input',
            label: 'Trial duratioin (milisec):',
            show: true,
            class_name: '',
            value: game_settings.game.trial_duration,
            input_type: 'number',
            label_after: '',
            pattern: '',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'trial_duration',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Num of resources:',
            show: true,
            class_name: '',
            value: game_settings.game.num_of_resources,
            input_type: 'number',
            label_after: '',
            pattern: '',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'num_of_resources',
                value,
            })
        },
        */
    ]

    return (
        <>
            <DivContainer className='admin-settings-section admin-settings-section-raw'>
                <DivContainer
                    className='admin-settings-section-col admin-settings-section-h'
                    elements={[{ type: 'Label', label: 'General:', show: true }]}
                />
                <DivContainer
                    className='admin-settings-section-raw admin-settings-section-b'
                    elements={general}
                />
            </DivContainer>

            <DivContainer className='admin-settings-section admin-settings-section-raw'>
                <DivContainer
                    className='admin-settings-section-col admin-settings-section-h'
                    elements={[{ type: 'Label', label: 'Payment:', show: true }]}
                />
                <DivContainer
                    className='admin-settings-section-raw admin-settings-section-b'
                    elements={payments}
                />
            </DivContainer>
            <DivContainer className='admin-settings-section admin-settings-section-raw' >
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
