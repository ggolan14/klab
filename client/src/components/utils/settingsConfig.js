export const generalSettings = (game_settings, LAST_SETTING_NAME, versions_list, changeSettings) => ([
    {
        type: 'Input',
        label: 'Version:',
        show: true,
        class_name: 'admin-settings-input-big ' + 
            (game_settings.version === 'test' ? ' disabledElem ' : '') +
            ((game_settings.version !== LAST_SETTING_NAME && versions_list.indexOf(game_settings.version) > -1) ? 'highlight_error_input' : ''),
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
        label: 'Practice:',
        show: true,
        options: [
            {label: 'Yes', value: 'Yes'},
            {label: 'No', value: 'No'},
        ],
        value: game_settings.general.w_p,
        callback: value => changeSettings({
            settings_of: 'game_settings',
            key: 'general',
            key2: 'w_p',
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
]);

export const paymentSettings = (game_settings, changeSettings, convertPointsRatio) => ([
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
        label: 'Bonus endowment2:',
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
]);
