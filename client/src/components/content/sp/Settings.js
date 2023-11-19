import React from 'react';
import PropTypes from 'prop-types';
import {DivContainer} from "../../screens/settings/elements_builder";
import {convertPointsRatio} from "../../screens/settings/settings";
import './spStyles.css';
import ColorPicker from "../../layout/colorPicker/color_picker";

const ElementColor = ({changeSettings, mean, label, label_after, attr, color}) => {
    return (
        <div
          className='t-o-g-u_set_m-s_kv'
          style={{
              gridTemplateColumns: label_after? 'max-content 1fr max-content' : 'max-content 1fr'
          }}
        >
            <label>{label}</label>
            <ColorPicker
                defaultValue={color}
                setSetting={value => {
                    changeSettings(mean, attr, value)
                }}
            />
            {label_after && <label style={{color: 'blueviolet'}}>{label_after}</label>}
        </div>
    )
};

const ElementColors = ({changeSettings, mean_label, colors}) => {
    const colors_ = [
        {
            label: 'Cards background',
            attr: 'cb',
            color: colors.cb
        },
        {
            label: 'Cards border',
            attr: 'cbo',
            color: colors.cbo
        },
        {
            label: 'Strong card text',
            attr: 's_txt',
            color: colors.s_txt
        },
        {
            label: 'Cards text',
            attr: 'c_txt',
            color: colors.c_txt
        },
        {
            label: 'Deck average',
            attr: 'd_a',
            color: colors.d_a,
            label_after: 'For Gains-full description'
        },
        {
            label: 'Deck standard deviation',
            attr: 'd_s_d',
            color: colors.d_s_d,
            label_after: 'For Gains-full description'
        },
    ];

    return (
        <div style={{display: "grid", rowGap: 10}}>
            <label style={{fontSize: 'larger', fontWeight: "bold"}}>{mean_label}</label>
            {
                colors_.map(
                    color_ => (
                        <ElementColor
                            mean={mean_label}
                            key={color_.label}
                            {...color_}
                            changeSettings={changeSettings}
                        />
                    )
                )
            }
        </div>
    )
};

const MeansColors = ({game_settings, changeSettings}) => {
    let means_colors;
    try {
        const {colors} = game_settings;
        const {MeanDis1, MeanDis2} = colors;
        const c_ = ['cb', 'cbo', 'c_txt', 's_txt', 'd_a', 'd_s_d'];
        for (let i=0; i<c_.length; i++)
            if (!(MeanDis1.hasOwnProperty(c_[i]) && MeanDis2.hasOwnProperty(c_[i])))
                throw Error('kkkk');
        means_colors = {
            MeanDis1, MeanDis2
        };
        // const {cb, cbo, c_txt, s_txt} = ;
    }
    catch (e) {
        // console.log(e.name + '-' + e.message);
        means_colors = {
            MeanDis1: {
                cb: {
                    r: 95,
                        g: 139,
                        b: 229,
                        a: 1
                },
                cbo: {
                    r: 95,
                        g: 139,
                        b: 229,
                        a: 1
                },
                c_txt: {
                    r: 95,
                        g: 139,
                        b: 229,
                        a: 1
                },
                s_txt: {
                    r: 95,
                        g: 139,
                        b: 229,
                        a: 1
                },
                d_a: {
                    r: 95,
                    g: 139,
                    b: 229,
                    a: 1
                },
                d_s_d: {
                    r: 95,
                    g: 139,
                    b: 229,
                    a: 1
                },
            },
            MeanDis2: {
                cb: {
                    r: 95,
                        g: 139,
                        b: 229,
                        a: 1
                },
                cbo: {
                    r: 95,
                        g: 139,
                        b: 229,
                        a: 1
                },
                c_txt: {
                    r: 95,
                        g: 139,
                        b: 229,
                        a: 1
                },
                s_txt: {
                    r: 95,
                        g: 139,
                        b: 229,
                        a: 1
                },
                d_a: {
                    r: 95,
                    g: 139,
                    b: 229,
                    a: 1
                },
                d_s_d: {
                    r: 95,
                    g: 139,
                    b: 229,
                    a: 1
                },
            },
        }
    }

    const changeAttrColor = (mean, attr, value) => {
        const m_ = JSON.parse(JSON.stringify(means_colors));

        m_[mean][attr] = value;
        changeSettings( {
            settings_of: 'game_settings',
            key: 'game',
            key2: 'colors',
            value: m_,
        })
    }

    return (
        <div style={{display: "grid", rowGap: 40, marginLeft: 5}}>
            {
                Object.keys(means_colors).map(
                    mean => (
                        <ElementColors
                            key={mean}
                            mean_label={mean}
                            colors={means_colors[mean]}
                            changeSettings={changeAttrColor}
                        />
                    )
                )
            }
        </div>
    )
};

const Mean = ({mean, game_settings, changeSettings}) => {

    let rDis = game_settings.game['rDis' + mean];

    const onChange = (index, value) => {

        let rDis_ = [...rDis];

        rDis_[index] = value;

        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'rDis' + mean,
            value: rDis_,
        })
    }

    return (
        <div className='setting_sp'>
            <label>
                Min:
                <input
                    onChange={e => onChange(0, e.target.value)}
                    value={rDis[0]}
                    type='number'
                />
            </label>
            <label>
                Max:
                <input
                    onChange={e => onChange(1, e.target.value)}
                    value={rDis[1]}
                    type='number'
                />
            </label>
        </div>
    )
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

    const game_elements = [
        {
            type: 'Select',
            label: 'Condition:',
            show: true,
            disabled: game_settings.game.ud === 'Yes',
            options: ['Mixed', 'Blocked'],
            // options: ['Mixed', 'MeanDis1_MeanDis2', 'MeanDis2_MeanDis1'],
            value: game_settings.game.condition,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'condition',
                value,
            })
        },
        {
            type: 'Select',
            label: 'Mode:',
            show: true,
            options: [
                {
                    value: 'g',
                    label: 'Gains'
                },
                {
                    value: 'l',
                    label: 'Losses'
                },
                {
                    value: 'g2',
                    label: 'Gains - full description'
                },
                {
                    value: 'gp',
                    label: 'Gains - Practice'
                },
            ],
            value: game_settings.game.mode,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'mode',
                value,
            })
        },
        {
            type: 'Select',
            label: 'Condition Uniform distribution:',
            show: true,
            options: ['Yes', 'No'],
            value: game_settings.game.ud,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'ud',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Start points:',
            show: true,
            value: game_settings.game.s_p,
            input_type: 'number',
            min: 0,
            label_after: 'Only for Losses mode',
            pattern: '',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 's_p',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Nrounds:',
            show: true,
            class_name: '',
            value: game_settings.game.Nrounds,
            input_type: 'number',
            step: 1,
            min: 1,
            label_after: '',
            pattern: '',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'Nrounds',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Ncards:',
            show: true,
            class_name: '',
            value: game_settings.game.Ncards,
            input_type: 'number',
            step: 1,
            min: 1,
            label_after: '',
            pattern: '',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'Ncards',
                value,
            })
        },
        // {
        //     type: 'Input',
        //     label: 'NumberOfPointsY:',
        //     show: false,
        //     class_name: '',
        //     value: game_settings.game.NumberOfPointsY,
        //     input_type: 'number',
        //     step: 1,
        //     min: 1,
        //     label_after: '',
        //     pattern: '',
        //     callback: value => changeSettings({
        //         settings_of: 'game_settings',
        //         key: 'game',
        //         key2: 'NumberOfPointsY',
        //         value,
        //     })
        // },
        {
            type: 'Input',
            label: 'cards_beforeX:',
            show: true,
            class_name: '',
            value: game_settings.game.cards_beforeX,
            input_type: 'number',
            step: 1,
            min: 1,
            label_after: '',
            pattern: '',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'cards_beforeX',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Cards animation time:',
            show: true,
            class_name: '',
            value: game_settings.game.c_a_t,
            input_type: 'number',
            min: 0,
            label_after: 'mili seconds',
            pattern: '',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'c_a_t',
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

    const mean1 = [
        {
            type: 'Input',
            label: 'MeanDis1:',
            show: true,
            class_name: '',
            value: game_settings.game.MeanDis1,
            input_type: 'number',
            step: 1,
            min: 0,
            label_after: '',
            pattern: '',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'MeanDis1',
                value,
            })
        },
        {
            type: 'Input',
            label: 'StdDis1:',
            show: true,
            class_name: '',
            value: game_settings.game.StdDis1,
            input_type: 'number',
            step: 1,
            min: 0,
            label_after: '',
            pattern: '',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'StdDis1',
                value,
            })
        },
    ];

    const mean2 = [
        {
            type: 'Input',
            label: 'MeanDis2:',
            show: true,
            class_name: '',
            value: game_settings.game.MeanDis2,
            input_type: 'number',
            step: 1,
            min: 0,
            label_after: '',
            pattern: '',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'MeanDis2',
                value,
            })
        },
        {
            type: 'Input',
            label: 'StdDis2:',
            show: true,
            class_name: '',
            value: game_settings.game.StdDis2,
            input_type: 'number',
            step: 1,
            min: 0,
            label_after: '',
            pattern: '',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'StdDis2',
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
                        label: 'Mean1:',
                        show: true
                    }]}
                />
                <DivContainer
                    className='admin-settings-section-raw admin-settings-section-b'
                    elements={mean1}
                />

                <Mean
                    game_settings={game_settings}
                    changeSettings={changeSettings}
                    mean={1}
                />
            </DivContainer>

            <DivContainer
                className='admin-settings-section admin-settings-section-raw'
            >
                <DivContainer
                    className='admin-settings-section-col admin-settings-section-h'
                    elements={[{
                        type: 'Label',
                        label: 'Mean2:',
                        show: true
                    }]}
                />
                <DivContainer
                    className='admin-settings-section-raw admin-settings-section-b'
                    elements={mean2}
                />

                <Mean
                    game_settings={game_settings}
                    changeSettings={changeSettings}
                    mean={2}
                />
            </DivContainer>


            <DivContainer
                className='admin-settings-section admin-settings-section-raw'
            >
                <DivContainer
                    className='admin-settings-section-col admin-settings-section-h'
                    elements={[{
                        type: 'Label',
                        label: 'Gains - Practice Colors:',
                        show: true
                    }]}
                />

                <MeansColors
                    changeSettings={changeSettings}
                    game_settings={game_settings.game}
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
