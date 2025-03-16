import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {DivContainer} from "../../screens/settings/elements_builder";
import {convertPointsRatio} from "../../screens/settings/settings";
import './pogStyles.css';
import ColorPicker from "../../layout/colorPicker/color_picker";

const Colors = ({settings, changeSettings, label, attr}) => {
    return (
        <div className='t-o-g-u_set_m-s_kv'>
            <label>{label}</label>
            <ColorPicker
                defaultValue={settings[attr]}
                setSetting={value => {
                    changeSettings( {
                        settings_of: 'game_settings',
                        key: 'game',
                        key2: attr,
                        value,
                    })
                }}
            />
        </div>
    )
};

const new_game = (count) => ({
    g: {
        l: 'game'+count, // game_name
        c: 'ne', // e -> enforce, ne => np no enforce
        e_p: 0, // enforce probability
        f: 10, // fine
    },
    pr: {
        p_s: 10, // profitable side
        nps: 0, // not profitable side
    }, // profitable
    t: {
        a_p: 1, // Amibgous profit side
        a_n_p: 1, // Amibgous not profit side
        c_p: 1, // Clear profit side
        c_n_p: 1, // Clear not profit side
        p_p:1, // practice profit
        p_n_p:1, // practice not profit
    }, // trials
    d: {
        a_p: 1, // Amibgous profit side
        a_n_p: 1, // Amibgous not profit side
        c_p: 1, // Clear profit side
        c_n_p: 1, // Clear not profit side
    }, // dots
});

// const getPropElements = (prop, prop_values, changePropAttr, prop_value_i) => {
//
//     if (prop === 'd'){
//         return [
//             {
//                 type: 'Input',
//                 label: 'Value 1:',
//                 show: true,
//                 class_name: '',
//                 value: prop_values.v1,
//                 input_type: 'number',
//                 label_after: '',
//                 pattern: '',
//                 callback: value => {
//                     changePropAttr(prop_value_i, 'v1', value)
//                 }
//             },
//             {
//                 type: 'Input',
//                 label: 'Value 2:',
//                 show: true,
//                 class_name: '',
//                 value: prop_values.v2,
//                 input_type: 'number',
//                 label_after: '',
//                 pattern: '',
//                 callback: value => {
//                     changePropAttr(prop_value_i, 'v2', value)
//                 }
//             },
//             {
//                 type: 'Input',
//                 label: 'Prob:',
//                 show: true,
//                 class_name: '',
//                 value: prop_values.p,
//                 input_type: 'number',
//                 min: 0,
//                 max: 1,
//                 step: 0.1,
//                 label_after: '',
//                 pattern: '',
//                 callback: value => {
//                     changePropAttr(prop_value_i, 'p', value)
//                 }
//             },
//         ];
//     }
//     else {
//         return [
//             {
//                 type: 'Input',
//                 label: 'Left:',
//                 show: true,
//                 class_name: '',
//                 value: prop_values.l,
//                 input_type: 'number',
//                 label_after: '',
//                 pattern: '',
//                 callback: value => {
//                     changePropAttr(prop_value_i, 'l', value)
//                 }
//             },
//             {
//                 type: 'Input',
//                 label: 'Right:',
//                 show: true,
//                 class_name: '',
//                 value: prop_values.r,
//                 input_type: 'number',
//                 label_after: '',
//                 pattern: '',
//                 callback: value => {
//                     changePropAttr(prop_value_i, 'r', value)
//                 }
//             },
//             {
//                 type: 'Input',
//                 label: 'Prob:',
//                 show: true,
//                 class_name: '',
//                 value: prop_values.p,
//                 input_type: 'number',
//                 min: 0,
//                 max: 1,
//                 step: 0.1,
//                 label_after: '',
//                 pattern: '',
//                 callback: value => {
//                     changePropAttr(prop_value_i, 'p', value)
//                 }
//             },
//         ];
//     }
// }

// const PropItem = ({prop, prop_value, prop_value_i, changePropAttr, removeProps}) => {
//
//     return (
//         <div className='BlockDotsPays_item'>
//             <DivContainer
//                 className='BlockDotsPays_item-prop'
//                 elements={getPropElements(prop, prop_value, changePropAttr, prop_value_i)}
//             />
//             <button className='btn-delete' onClick={() => removeProps(prop_value_i)}>Remove</button>
//         </div>
//     )
// }

// const BlockDotsPays = ({prop, prop_values, update_attr}) => {
//
//     const addPropValue = () => {
//         let new_prop;
//         if (prop === 'p')
//             new_prop = {
//                 l: 1, // left
//                 r: 10, // right
//                 p: 0.3 // prob
//             }
//         else
//             new_prop = {
//                 v1: 0, // value
//                 v2: 0, // value
//                 p: 0 // prob
//             }
//
//         prop_values.push(new_prop);
//         update_attr(prop, prop_values);
//     };
//
//     const removeProps = prop_index => {
//         prop_values = prop_values.filter((p, p_i) => p_i !== prop_index);
//         update_attr(prop, prop_values);
//     };
//
//     const changePropAttr = (prop_index, attr, value) => {
//         prop_values[prop_index][attr] = value;
//         update_attr(prop, prop_values);
//     };
//
//     return (
//         <div className='BlockDotsPays'>
//             <button className='btn-add' onClick={addPropValue}>Add new {prop === 'p' ? 'pays' : 'dots'}: </button>
//             <div className='BlockDotsPays-c'>
//                 {
//                     prop_values.map(
//                         (prop_value, prop_value_i) => (
//                             <PropItem
//                                 prop={prop}
//                                 prop_value={prop_value}
//                                 prop_value_i={prop_value_i}
//                                 key={prop_value_i}
//                                 removeProps={removeProps}
//                                 changePropAttr={changePropAttr}
//                             />
//                         )
//                     )
//                 }
//             </div>
//         </div>
//     )
// }

// const Block = ({block, block_i, updateBlock, removeBlock}) => {
//
//     const [open, setOpen] = useState(true);
//
//     const update_attr = (attr, value) => {
//         block[attr] = value;
//         updateBlock(block, block_i);
//     };
//
//     const block_elements = [
//         {
//             type: 'Select',
//             label: 'Condition:',
//             show: true,
//             options: [
//                 {
//                     value: 'ne',
//                     label: 'No enforce'
//                 },
//                 {
//                     value: 'e',
//                     label: 'Enforce'
//                 },
//             ],
//             value: block.c,
//             callback: value => {
//                 update_attr('c', value)
//             }
//         },
//         {
//             type: 'Input',
//             label: 'Rounds:',
//             show: true,
//             class_name: '',
//             value: block.r,
//             input_type: 'number',
//             min: 1,
//             step: 1,
//             label_after: '',
//             pattern: '',
//             callback: value => {
//                 update_attr('r', value)
//             }
//         },
//         {
//             type: 'Input',
//             label: 'Inspection prob:',
//             show: true,
//             class_name: '',
//             value: block.p_i,
//             input_type: 'number',
//             min: 0,
//             max: 1,
//             step: 0.1,
//             label_after: '0-1',
//             pattern: '',
//             callback: value => {
//                 update_attr('p_i', value)
//             }
//         },
//     ];
//
//     return (
//         <div
//             className='pg_settings-block_c'
//         >
//             <div
//                 className='pg_settings-block_t'
//                 onClick={() => setOpen(!open)}
//             >
//                 <label className={open ? 'minus' : 'plus'}>{open ? '-' : '+'}</label>
//                 <label className='block-title'>Block #{block_i+1}</label>
//
//                 <button className='btn-delete' onClick={() => removeBlock(block_i)}>Remove</button>
//             </div>
//
//             {
//                 open && (
//                     <div
//                         className='pg_settings-block_body'
//                     >
//                         <DivContainer
//                             className='admin-settings-section-raw admin-settings-section-b pg_settings-block_elements'
//                             elements={block_elements}
//                         />
//
//                         <BlockDotsPays
//                             prop={'d'}
//                             prop_values={block.d}
//                             update_attr={update_attr}
//                         />
//
//                         <BlockDotsPays
//                             prop={'p'}
//                             prop_values={block.p}
//                             update_attr={update_attr}
//                         />
//                     </div>
//                 )
//             }
//         </div>
//     )
// }

// const GameBlocks = ({game_settings, changeSettings}) => {
//
//     const addNewBlock = () => {
//         let blocks_bank = game_settings.b;
//         blocks_bank.push({
//             r: 1,
//             d: [],
//             p: [],
//             c: 'ne',
//             p_i: 0
//         });
//
//         changeSettings({
//             settings_of: 'game_settings',
//             key: 'game',
//             key2: 'b',
//             value: blocks_bank,
//         });
//     };
//
//     const removeBlock = block_index => {
//         let blocks_bank = game_settings.b;
//         blocks_bank = blocks_bank.filter((b, b_i) => b_i !== block_index);
//
//         changeSettings({
//             settings_of: 'game_settings',
//             key: 'game',
//             key2: 'b',
//             value: blocks_bank,
//         });
//     };
//
//     const updateBlock = (updated_block, block_index) => {
//         let blocks_bank = game_settings.b;
//         blocks_bank[block_index] = updated_block;
//
//         changeSettings({
//             settings_of: 'game_settings',
//             key: 'game',
//             key2: 'b',
//             value: blocks_bank,
//         });
//     };
//
//     return (
//         <div
//             className='pg_settings-block_g-b'
//         >
//             <button
//                 className='btn-add'
//                 onClick={addNewBlock}
//             >Add new block</button>
//
//             {
//                 game_settings.b.map(
//                     (block, block_i) => (
//                         <Block
//                             block={block}
//                             block_i={block_i}
//                             key={block_i}
//                             updateBlock={updateBlock}
//                             removeBlock={removeBlock}
//                         />
//                     )
//                 )
//             }
//         </div>
//     )
// }

const Game = ({game, game_i, updateGame, removeGame}) => {
    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);

    const update_attr = (attr, value, attr2) => {
        let game_ = {...game};
        if (attr2)
            game_[attr][attr2] = value;
        else
            game_[attr] = value;

        updateGame(game_, game_i);

        if (attr2 === 'c'){
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 1);
        }
    };

    const enforce_class = game.g.c === 'ne' ? 'disabledElem ' : '';

    if (loading)
        return <></>;

    const block_elements = [
        {
            type: 'Input',
            label: 'Game label:',
            show: true,
            class_name: 'pg_settings-game_label ' + (game_i === 0 ? ' disabledElem ' : ''),
            value: game.g.l,
            input_type: 'text',
            callback: game_i === 0 ? () => {} : value => update_attr('g', value, 'l')
        },
        {
            type: 'Select',
            label: 'Condition:',
            show: true,
            options: [
                {
                    value: 'ne',
                    label: 'No enforce'
                },
                {
                    value: 'e',
                    label: 'Enforce'
                },
            ],
            value: game.g.c,
            callback: value => update_attr('g', value, 'c')
        },
        {
            type: 'Input',
            label: 'Enforce probability:',
            show: true,
            class_name: enforce_class,
            value: game.g.e_p,
            min: 0,
            max: 1,
            step: 0.01,
            input_type: 'number',
            label_after: '0-1',
            pattern: '',
            callback: value => update_attr('g', value, 'e_p')
        },
        {
            type: 'Input',
            label: 'Fine:',
            show: true,
            class_name: enforce_class,
            value: game.g.f,
            input_type: 'number',
            label_after: '',
            pattern: '',
            callback: value => update_attr('g', value, 'f')
        },
    ];

    const profitable_elements = [
        {
            type: 'Input',
            label: 'Profitable side:',
            show: true,
            class_name: '',
            value: game.pr.p_s,
            input_type: 'number',
            callback: value => update_attr('pr', value, 'p_s')
        },
        {
            type: 'Input',
            label: 'Not profitable side:',
            show: true,
            class_name: '',
            value: game.pr.nps,
            input_type: 'number',
            callback: value => update_attr('pr', value, 'nps')
        },
    ];

    const trials_elements = [
        {
            type: 'Input',
            label: 'Amibgous profit side:',
            show: true,
            class_name: '',
            value: game.t.a_p,
            input_type: 'number',
            min: 1,
            step: 1,
            label_after: '',
            pattern: '',
            callback: value => {
                update_attr('t', value, 'a_p')
            }
        },
        {
            type: 'Input',
            label: 'Amibgous not profit side:',
            show: true,
            class_name: '',
            value: game.t.a_n_p,
            input_type: 'number',
            min: 1,
            step: 1,
            label_after: '',
            pattern: '',
            callback: value => {
                update_attr('t', value, 'a_n_p')
            }
        },
        {
            type: 'Input',
            label: 'Clear profit side:',
            show: true,
            class_name: '',
            value: game.t.c_p,
            input_type: 'number',
            min: 1,
            step: 1,
            label_after: '',
            pattern: '',
            callback: value => {
                update_attr('t', value, 'c_p')
            }
        },
        {
            type: 'Input',
            label: 'Clear not profit side:',
            show: true,
            class_name: '',
            value: game.t.c_n_p,
            input_type: 'number',
            min: 1,
            step: 1,
            label_after: '',
            pattern: '',
            callback: value => {
                update_attr('t', value, 'c_n_p')
            }
        },
        {
            type: 'Input',
            label: 'Practice profit:',
            show: true,
            class_name: '',
            value: game.t.p_p,
            input_type: 'number',
            min: 1,
            step: 1,
            label_after: '',
            pattern: '',
            callback: value => {
                update_attr('t', value, 'p_p')
            }
        },
        {
            type: 'Input',
            label: 'Practice not profit:',
            show: true,
            class_name: '',
            value: game.t.p_n_p,
            input_type: 'number',
            min: 1,
            step: 1,
            label_after: '',
            pattern: '',
            callback: value => {
                update_attr('t', value, 'p_n_p')
            }
        },
        

    ];

    const dots_elements_practice = [
        {
            type: 'Input',
            label: 'More:',
            show: true,
            class_name: '',
            value: game.d.p_m,
            input_type: 'number',
            min: 1,
            step: 1,
            label_after: '',
            pattern: '',
            callback: value => {
                update_attr('d', value, 'p_m')
            }
        },
        {
            type: 'Input',
            label: 'Less:',
            show: true,
            class_name: '',
            value: game.d.p_l,
            input_type: 'number',
            min: 1,
            step: 1,
            label_after: '',
            pattern: '',
            callback: value => {
                update_attr('d', value, 'p_l')
            }
        },
    ];

    const dots_elements_clear = [
        {
            type: 'Input',
            label: 'More:',
            show: true,
            class_name: '',
            value: game.d.c_m,
            input_type: 'number',
            min: 1,
            step: 1,
            label_after: '',
            pattern: '',
            callback: value => {
                update_attr('d', value, 'c_m')
            }
        },
        {
            type: 'Input',
            label: 'Less:',
            show: true,
            class_name: '',
            value: game.d.c_l,
            input_type: 'number',
            min: 1,
            step: 1,
            label_after: '',
            pattern: '',
            callback: value => {
                update_attr('d', value, 'c_l')
            }
        },
    ];

    return (
        <div
            className='pg_settings-block_c'
        >
            <div
                className='pg_settings-block_t'
                onClick={() => setOpen(!open)}
            >
                <label className={open ? 'minus' : 'plus'}>{open ? '-' : '+'}</label>
                <label className='block-title'>{game.g.l}</label>

                <button className={'btn-delete ' + (game_i === 0 ? 'disabledElem' : '')} onClick={game_i !== 0 ? () => removeGame(game_i) : undefined}>Remove</button>
            </div>

            {
                open && (
                    <div
                        className='pg_settings-block_body'
                    >
                        <DivContainer
                            className='admin-settings-section-raw admin-settings-section-b pg_settings-block_elements'
                            elements={block_elements}
                        />

                        <DivContainer
                            className='admin-settings-section admin-settings-section-raw'
                        >
                            <DivContainer
                                className='pg_settings-game_bank-h admin-settings-section-col'
                                elements={[{
                                    type: 'Label',
                                    label: 'Profitable:',
                                    show: true
                                }]}
                            />
                            <DivContainer
                                className='admin-settings-section-raw admin-settings-section-b'
                                elements={profitable_elements}
                            />
                        </DivContainer>

                        <DivContainer
                            className='admin-settings-section admin-settings-section-raw'
                        >
                            <DivContainer
                                className='pg_settings-game_bank-h admin-settings-section-col'
                                elements={[{
                                    type: 'Label',
                                    label: 'Trials:',
                                    show: true
                                }]}
                            />
                            <DivContainer
                                className='admin-settings-section-raw admin-settings-section-b'
                                elements={trials_elements}
                            />
                        </DivContainer>

                        <DivContainer
                            className='admin-settings-section admin-settings-section-raw'
                        >
                            <DivContainer
                                className='pg_settings-game_bank-h admin-settings-section-col'
                                elements={[{
                                    type: 'Label',
                                    label: 'Dots:',
                                    show: true
                                }]}
                            />
                            <DivContainer
                                className='admin-settings-section admin-settings-section-raw'
                            >
                                <DivContainer
                                    className='pg_settings-game_bank-h admin-settings-section-col'
                                    elements={[{
                                        type: 'Label',
                                        label: 'Practice:',
                                        show: true
                                    }]}
                                />
                                <DivContainer
                                    className='admin-settings-section-raw admin-settings-section-b'
                                    elements={dots_elements_practice}
                                />
                            </DivContainer>

                            <DivContainer
                                className='admin-settings-section admin-settings-section-raw'
                            >
                                <DivContainer
                                    className='pg_settings-game_bank-h admin-settings-section-col'
                                    elements={[{
                                        type: 'Label',
                                        label: 'Clear:',
                                        show: true
                                    }]}
                                />
                                <DivContainer
                                    className='admin-settings-section-raw admin-settings-section-b'
                                    elements={dots_elements_clear}
                                />
                            </DivContainer>
                        </DivContainer>
                    </div>
                )
            }
        </div>
    )
}

const GamesBank = ({game_settings, changeSettings}) => {

    const addNewGame = () => {

        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'g_b',
            value: [...game_settings.g_b, new_game(game_settings.g_b.length)],
        });
    };

    const removeGame = game_index => {
        if (game_index === 0) return;
        let changes = [
            {
                settings_of: 'game_settings',
                key: 'game',
                key2: 'g_b',
                value: game_settings.g_b.filter((b, b_i) => b_i !== game_index),
            }
        ];

        let keys = ['g_p', 'r'];
        game_index = game_index.toString();

        for (let key in keys){
            const key_ = keys[key];
            let key_value = [...game_settings[key_]];
            key_value = key_value.filter((g) => g !== game_index)
            for (let i=0; i<key_value.length; i++)
                if (Number(key_value[i]) > Number(game_index))
                    key_value[i] = (Number(key_value[i]) - 1).toString();

            changes.push({
                settings_of: 'game_settings',
                key: 'game',
                key2: key_,
                value: key_value,
            });

        }

        changeSettings(changes);
    };

    const updateGame = (updated_game, game_index) => {
        let games_bank = [...game_settings.g_b];
        games_bank[game_index] = Object.assign({}, updated_game);

        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'g_b',
            value: games_bank,
        });
    };

    return (
        <div
            className='pg_settings-block_g-b'
        >
            <button
                className='btn-add'
                onClick={addNewGame}
            >Add new game</button>

            {
                game_settings.g_b.map(
                    (game, game_i) => (
                        <Game
                            game={game}
                            game_i={game_i}
                            key={game_i}
                            updateGame={updateGame}
                            removeGame={removeGame}
                        />
                    )
                )
            }
        </div>
    )
}

const GameElement = ({game, disabled, callback, game_index, options, part}) => {
    let divStyle = {}, divClass = '';
    if (part.includes('RANDOM_FROM_BANK'))
        divStyle = {pointerEvents: 'none'};
    else if (part.includes('RANDOM_FROM_TOP'))
        divClass = ' pg_set-ge-rft ';
    return (
        <div
            className={'t-o-g-u_game_btn ' + divClass + (disabled? 'disabledElem' : '')}
            style={divStyle}
        >
            {
                part !== 'RANDOM_FROM_TOP' && (
                    <label
                        className={'t-o-g-u_game_btn_options remove'}
                        style={{pointerEvents: 'all'}}
                        onClick={() => callback.removeGame(game_index)}
                    >
                        x
                    </label>
                )
            }

            {
                part === 'GAMES_PLAY' && (
                    <select
                        value={game}
                        onChange={e => callback.changeGame(game_index, e.target.value)}
                    >
                        {
                            options.map(
                                (option, option_i) => (
                                    <option value={option.game_index} key={option_i}>{option.label}</option>
                                )
                            )
                        }
                    </select>
                )
            }

            {
                part.includes('RANDOM_FROM_BANK') && (
                    <label>{game}</label>
                )
            }

            {
                part.includes('RANDOM_FROM_TOP') && (
                    <label
                        onClick={disabled?undefined:() => callback.addGame(game_index)}
                    >{game}</label>
                )
            }

        </div>
    )
}

const GamesPlay = ({changeSettings, settings}) => {

    const addGame = () => {
        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'g_p',
            value: [...settings.g_p, '0'],
        });
    };

    const removeGame = (game_index) => {
        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'g_p',
            value: settings.g_p.filter((g, g_i) => g_i !== game_index),
        });
    };

    const changeGame = (game_index, value) => {
        let g_p = [...settings.g_p];
        g_p[game_index] = value;
        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'g_p',
            value: g_p
        });
    };

    let options = settings.g_b.map((g_, g_i) => ({label: g_.g.l, game_index: g_i}));
    options = [{label: 'Random', game_index: 'null'}, ...options];


    return (
        <div style={{width: '90%'}} className='t-o-g-u_set_m-s_kv unselectable'>
            <div style={{display:'grid'}}>
                <label><b>Games play:</b></label>
                <button
                    onClick={addGame}
                    // className={}
                >Add game</button>
            </div>
            <div>
                <div className='t-o-g-u_set_items'>
                    {
                        (settings.g_p).map(
                            (game, game_i) => (
                                <GameElement
                                    key={game_i}
                                    callback={{removeGame, changeGame}}
                                    game={game}
                                    game_index={game_i}
                                    options={options}
                                    part='GAMES_PLAY'
                                />
                            )
                        )
                    }
                </div>
            </div>
        </div>
    )
}

const RandomFrom = ({changeSettings, settings}) => {

    const addGame = game => {
        const rnd_set = new Set([...settings.r, game.toString()]);

        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'r',
            value: Array.from(rnd_set),
        });
    };

    const removeGame = (game_index) => {
        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'r',
            value: settings.r.filter((g, g_i) => g_i !== game_index),
        });
    };

    return (
        <div
            style={{width: '90%', marginTop: 20, display: 'block'}}
            className='t-o-g-u_set_m-s_kv unselectable'
        >
            <div>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr',
                        gridColumnGap: '19px',
                        alignItems: 'center',
                        rowGap: '12px'
                    }}
                >

                    <label><b>All games:</b></label>
                    <div className='t-o-g-u_set_items'>
                        {
                            (settings.g_b).map(
                                (game, game_i) => (
                                    <GameElement
                                        disabled={settings.r.indexOf(game_i.toString()) > -1}
                                        key={game_i}
                                        callback={{addGame}}
                                        game={game.g.l}
                                        game_index={game_i}
                                        part='RANDOM_FROM_TOP'
                                    />
                                )
                            )
                        }
                    </div>

                    <label><b>Random from: </b></label>
                    <div className='t-o-g-u_set_items'>
                        {
                            (settings.r).map(
                                (game, game_i) => (
                                    <GameElement
                                        key={game_i}
                                        callback={{removeGame}}
                                        game={settings.g_b[game].g.l}
                                        game_index={game_i}
                                        part='RANDOM_FROM_BANK'
                                    />
                                )
                            )
                        }
                    </div>

                </div>
            </div>
        </div>
    )
}

const Settings = ({game_settings, changeSettings, LAST_SETTING_NAME, versions_list}) => {

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
            label: 'Plus time:',
            show: true,
            class_name: '',
            value: game_settings.game.p_t,
            input_type: 'number',
            min: 0,
            label_after: 'mili seconds',
            pattern: '',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'p_t',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Dots time:',
            show: true,
            class_name: '',
            value: game_settings.game.d_t,
            input_type: 'number',
            min: 0,
            label_after: 'mili seconds',
            pattern: '',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'd_t',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Pay time:',
            show: true,
            class_name: '',
            value: game_settings.game.pa_t,
            input_type: 'number',
            min: 0,
            label_after: 'mili seconds',
            pattern: '',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'pa_t',
                value,
            })
        },
        {
            type: 'Select',
            label: 'Random game order:',
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
            value: game_settings.game.r_o,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'r_o',
                value,
            })
        },
        {
            type: 'Select',
            label: 'Practice:',
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
            value: game_settings.game.practice,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'practice',
                value,
            })
        },
    ];

    const colors_elements = [
        {
            label: 'Points color',
            attr: 'p_c'
        },
        {
            label: 'Enforcement background',
            attr: 'e_c'
        },
        {
            label: 'Enforcement no busted background',
            attr: 'enb_c'
        }
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

                {
                    colors_elements.map(
                        ce => (
                            <Colors
                                changeSettings={changeSettings}
                                settings={game_settings.game}
                                key={ce.label}
                                label={ce.label}
                                attr={ce.attr}
                            />
                        )
                    )
                }

                <DivContainer
                    className='admin-settings-section-raw admin-settings-section-b'
                    elements={game_elements}
                />

                <GamesPlay
                    changeSettings={changeSettings}
                    settings={game_settings.game}
                />

                <RandomFrom
                    changeSettings={changeSettings}
                    settings={game_settings.game}
                />
            </DivContainer>

            <DivContainer
                className='admin-settings-section admin-settings-section-raw'
            >
                <DivContainer
                    className='admin-settings-section-col admin-settings-section-h'
                    elements={[{
                        type: 'Label',
                        label: 'Games bank:',
                        show: true
                    }]}
                />

                <GamesBank
                    game_settings={game_settings.game}
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

// let game_def_set = {
//     Number_of_blocks: 0,
//     Show_points_for: 0,
//     Show_plus_page_for: 0,
//     Payoff_time: 0,
//     Clear_profit_side_trials: 0,
//     Clear_not_profit_side_trials: 0,
//     Clear_profit_side_points: 0,
//     Clear_not_profit_side_points: 0,
//     Ambigous_right_trials: 0,
//     Ambigous_right_points_left: 0,
//     Ambigous_right_points_right: 0,
//     Ambigous_left_trials: 0,
//     Ambigous_left_points_left: 0,
//     Ambigous_left_points_right: 0,
//
//     Probability_condition_1: 0,
//     Probability_condition_2: 0,
//     Probability_condition_3: 0,
//     Probability_condition_4: 0,
//     Profitable_cond_123_profi: 0,
//     Profitable_cond_123_not_profi: 0,
//     Profitable_cond_4_profi: 0,
//     Profitable_cond_4_not_profi: 0,
//     Fine_cond_2: 0,
//     Fine_cond_3: 0,
//     // Background_color: '#fff',
//     Points_color: '#fff',
//     Enforcement_background_color: '#fff',
//     Enforcement_no_busted_background_color: '#fff',
//     SelectedButton_background_color: '#fff',
//     Points_canvas_width: 10,
//     Points_canvas_height: 10
// };
