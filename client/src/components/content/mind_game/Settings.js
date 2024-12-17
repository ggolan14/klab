import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DivContainer } from "../../screens/settings/elements_builder";
import { convertPointsRatio } from "../../screens/settings/settings";
import { generalSettings,paymentSettings } from '../../utils/settingsConfig';
import ColorPicker from "../../layout/colorPicker/color_picker";
//import './togStyles.css';

const Settings = ({ game_settings, changeSettings, LAST_SETTING_NAME, versions_list, exp_more_settings }) => {
    const general = generalSettings(game_settings, LAST_SETTING_NAME, versions_list, changeSettings);
    const payments = paymentSettings(game_settings, changeSettings, convertPointsRatio);

    useEffect(() => {
        if (game_settings.game.cond === 'o') {
            changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'num_of_real_rounds',
                value: 1,
            });
        }
    }, [game_settings.game.cond, changeSettings]);



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
        },
        {
            type: 'Input',
            label: 'Num of Real Rounds:',
            show: true,
            class_name: '',
            value: game_settings.game.num_of_real_rounds,
            input_type: 'number',
            step: 1,
            min: 1,
            max: 40,
            disabled: game_settings.game.cond === 'o',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'num_of_real_rounds',
                value,
            })
        }
    ];

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
    exp: PropTypes.string.isRequired,
    game_settings: PropTypes.object.isRequired,
    changeSettings: PropTypes.func.isRequired,
    LAST_SETTING_NAME: PropTypes.string,
    versions_list: PropTypes.array.isRequired,
    exp_: PropTypes.string.isRequired,
};

export default Settings;
