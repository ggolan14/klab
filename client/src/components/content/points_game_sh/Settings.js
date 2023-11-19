import React from 'react';
import PropTypes from 'prop-types';
import {DivContainer} from "../../screens/settings/elements_builder";

const Settings = () => {
// const Settings = ({game_settings, changeSettings, LAST_SETTING_NAME, versions_list, exp_more_settings}) => {
    return (
        <>
            <DivContainer
                className='admin-settings-section admin-settings-section-raw'
            >
                <DivContainer
                    className='admin-settings-section-col admin-settings-section-h'
                    elements={[{
                        type: 'Label',
                        label: 'Settings not ready yet',
                        show: true
                    }]}
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


