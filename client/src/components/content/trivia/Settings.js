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
            label: 'Condition:',
            show: true,
            options: [
                {
                    value: 'o',
                    label: 'One Shot'
                },
                {
                    value: 'r',
                    label: 'Repeated'
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
        }
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
