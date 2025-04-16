import React, {useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import {DivContainer} from "../../screens/settings/elements_builder";
import {convertPointsRatio} from "../../screens/settings/settings";

function getSizes(puzzles_models_mem, type_of){
    let sizes = new Set();

    if (type_of === 'Both'){
        for (let type in puzzles_models_mem.types){
            for (let model in puzzles_models_mem.types[type]){
                sizes.add(puzzles_models_mem.types[type][model].puzzle_size);
            }
        }
    }
    else {
        for (let type in puzzles_models_mem.types){
            for (let model in puzzles_models_mem.types[type]){
                if (puzzles_models_mem.types[type][model].puzzle_type === type_of)
                    sizes.add(puzzles_models_mem.types[type][model].puzzle_size);
            }
        }
    }

    sizes = Array.from(sizes);

    // sizes.push('All');

    return sizes;
}

function getLengths(puzzles_models_mem, type_of, active_size){
    let lengths = new Set();

    if (type_of === 'Both'){
        for (let model in puzzles_models_mem.sizes[active_size]){
            lengths.add(puzzles_models_mem.sizes[active_size][model].puzzle_length);
        }
    }
    else {
        for (let model in puzzles_models_mem.sizes[active_size]){
            if (puzzles_models_mem.sizes[active_size][model].puzzle_type === type_of){
                lengths.add(puzzles_models_mem.sizes[active_size][model].puzzle_length);
            }
        }
    }

    lengths = Array.from(lengths);

    // lengths.push('All');

    return lengths;
}

function wpChangePuzzleSettings({changeSettings, key2, value, game_settings, puzzles_models_mem}) {
    if (key2 === 'type_of') {
        // Both Grouped Scattered
        let new_size = game_settings.game.active_size;
        let sizes = getSizes(puzzles_models_mem, value);
        let type_of = value === 'Both' ? 'Scattered' : value;
        if (sizes.indexOf(new_size) < 0) {
            new_size = puzzles_models_mem.types[type_of][Object.keys(puzzles_models_mem.types[type_of])[0]].puzzle_size;
        }

        let new_length = game_settings.game.active_length;

        let lengths = getLengths(puzzles_models_mem, type_of, new_size);
        if (lengths.indexOf(new_length) < 0) {
            new_length = puzzles_models_mem.sizes[new_size][Object.keys(puzzles_models_mem.sizes[new_size])[0]].puzzle_length;
        }

        changeSettings([
            {
                settings_of: 'game_settings',
                key: 'game',
                key2: 'type_of',
                value,
            },
            {
                settings_of: 'game_settings',
                key: 'game',
                key2: 'active_size',
                value: new_size,
            },
            {
                settings_of: 'game_settings',
                key: 'game',
                key2: 'active_length',
                value: new_length,
            }
        ]);
    }
    else if (key2 === 'active_size') {
        let new_length = game_settings.game.active_length;
        let lengths = getLengths(puzzles_models_mem, game_settings.game.type_of, value);
        if (lengths.indexOf(new_length) < 0) {
            new_length = puzzles_models_mem.sizes[value][Object.keys(puzzles_models_mem.sizes[value])[0]].puzzle_length;
        }

        changeSettings([
            {
                settings_of: 'game_settings',
                key: 'game',
                key2: 'active_size',
                value,
            },
            {
                settings_of: 'game_settings',
                key: 'game',
                key2: 'active_length',
                value: new_length,
            }
        ]);

    }
}

const TableItem = ({model, puzzle, active, changeSettings, active_models}) => {
    return (
        <tr
            className={active ? 'active-tr' : 'non-active-tr'}
        >
            <td className='p-row text-left'>{model}</td>
            <td className='p-row text-center'>{puzzle[model].puzzle_size}</td>
            <td className='p-row text-center'>{puzzle[model].puzzle_length}</td>
            <td className='p-row text-center'><button className='p-row text-center'>Edit</button></td>
            <td className='p-row text-center'><button className='p-row text-center'>Delete</button></td>
            <td className='p-row text-center'>
                <select
                    className='text-center'
                    value={active ? 'Active' : 'Disactive'}
                    onChange={e => (
                        changeSettings({
                            settings_of: 'game_settings',
                            key: 'game',
                            key2: 'active_models',
                            value: function (){
                                let new_active_models = [...active_models];

                                if (e.target.value === 'Active'){
                                    if (new_active_models.indexOf(model) < 0)
                                        new_active_models.push(model);
                                }
                                else {
                                    if (new_active_models.indexOf(model) > -1)
                                        new_active_models = new_active_models.filter(
                                            model_ => model_ !== model
                                        );
                                }

                                return new_active_models;
                            }(),
                        })
                    )}
                >
                    <option>Active</option>
                    <option>Disactive</option>
                </select>
            </td>
        </tr>
    )
}

const FilteredTypes = ({type, filters, all_sizes, filtered_types, changeSettings, active_models}) => {

    return (
        <div
            className='PuzzleModelsList-types'
        >
            <label>{type}</label>
            <div
                className='PuzzleModelsList-filter'
            >
                <div>
                    <label>Sizes:</label>
                    <select
                        value={filters[type].value.Sizes}
                        onChange={e => {
                            filters[type].set({
                                ...filters[type].value,
                                Sizes: e.target.value
                            })
                        }}
                    >
                        <option>All</option>
                        {
                            all_sizes.Sizes[type].map(
                                size => (
                                    <option
                                        value={size}
                                        key={'Sizes-opt' + size}
                                    >
                                        {size}
                                    </option>
                                )
                            )
                        }
                    </select>
                </div>

                <div>
                    <label>Lengths:</label>
                    <select
                        value={filters[type].value.Lengths}
                        onChange={e => {
                            filters[type].set({
                                ...filters[type].value,
                                Lengths: e.target.value
                            })
                        }}
                    >
                        <option>All</option>
                        {
                            all_sizes.Lengths[type].map(
                                length => (
                                    <option
                                        value={length}
                                        key={'Lengths-opt' + length}
                                    >
                                        {length}
                                    </option>)
                            )
                        }
                    </select>
                </div>

                <div>
                    <label>Mode:</label>
                    <select
                        value={filters[type].value.Mode}
                        onChange={e => {
                            filters[type].set({
                                ...filters[type].value,
                                Mode: e.target.value
                            })
                        }}
                    >
                        <option>All</option>
                        <option>Active</option>
                        <option>Disactive</option>
                    </select>
                </div>

            </div>

            <table
                className='PuzzleModelsList-list'
            >
                <thead>
                <tr>
                    <th className='text-left heading'>Model</th>
                    <th className='text-center heading'>Puzzle size</th>
                    <th className='text-center heading'>Puzzle length</th>
                    <th className='text-center heading'></th>
                    <th className='text-center heading'></th>
                    <th className='text-center heading'>Mode</th>
                </tr>
                </thead>
                <tbody>
                {
                    Object.keys(filtered_types[type]).map(
                        model => (
                            <TableItem
                                key={'m-l-l-opt' + model}
                                changeSettings={changeSettings}
                                puzzle={filtered_types[type]}
                                model={model}
                                active_models={active_models}
                                active={active_models.indexOf(model) > -1}
                            />
                        )
                    )
                }
                </tbody>

            </table>
            <label>Number of puzzles: <span>{Object.keys(filtered_types[type]).length}</span></label>
        </div>
    )
}

const PuzzleModelsList = ({puzzles_models_mem, active_models, changeSettings}) => {

    const [groupedFilters, setGroupedFilters] = useState({
        Sizes: 'All',
        Lengths: 'All',
        Mode: 'All'
    });
    const [scatteredFilters, setScatteredFilters] = useState({
        Sizes: 'All',
        Lengths: 'All',
        Mode: 'All',
    });

    const all_sizes = useMemo(() => {
        const {types} = puzzles_models_mem;
        let lengths_sets = {
            Grouped: new Set(),
            Scattered: new Set(),
        }

        let sizes_sets = {
            Grouped: new Set(),
            Scattered: new Set(),
        }

        for (let models_type in types){
            for (let models in types[models_type]){
                lengths_sets[models_type].add(types[models_type][models].puzzle_length);
                sizes_sets[models_type].add(types[models_type][models].puzzle_size);
            }
        }

        lengths_sets.Grouped = Array.from(lengths_sets.Grouped);
        lengths_sets.Scattered = Array.from(lengths_sets.Scattered);

        sizes_sets.Grouped = Array.from(sizes_sets.Grouped);
        sizes_sets.Scattered = Array.from(sizes_sets.Scattered);

        return {
            Lengths: lengths_sets,
            Sizes: sizes_sets
        }
    }, [puzzles_models_mem]);

    const group_filter = useMemo(() => {
        const {Grouped} = puzzles_models_mem.types;
        if (groupedFilters.Sizes === 'All' && groupedFilters.Lengths === 'All' && groupedFilters.Mode === 'All')
            return Grouped;
        else {
            let filtered = {};

            for (let gr in Grouped){
                let add_model = true;

                if (groupedFilters.Sizes !== 'All') {
                    if (Grouped[gr].puzzle_size !== groupedFilters.Sizes)
                        add_model = false;
                }

                if (add_model) {
                    if (groupedFilters.Lengths !== 'All')
                        if (Grouped[gr].puzzle_length !== groupedFilters.Lengths)
                            add_model = false;
                }

                if (add_model) {
                    if (groupedFilters.Mode === 'Active' && active_models.indexOf(gr) < 0){
                        add_model = false;
                    }
                    else if (groupedFilters.Mode === 'Disactive' && active_models.indexOf(gr) > -1) {
                        add_model = false;
                    }
                }

                if (add_model)
                    filtered[gr] = Grouped[gr];
            }

            return filtered;
        }
    }, [active_models, puzzles_models_mem, groupedFilters]);

    const scattered_filter = useMemo(() => {
        const {Scattered} = puzzles_models_mem.types;
        if (scatteredFilters.Sizes === 'All' && scatteredFilters.Lengths === 'All' && groupedFilters.Mode === 'All')
            return Scattered;
        else {
            let filtered = {};

            for (let sc in Scattered){
                let add_model = true;
                if (scatteredFilters.Sizes !== 'All')
                    if (Scattered[sc].puzzle_size !== scatteredFilters.Sizes)
                        add_model = false;

                if (add_model)
                    if (scatteredFilters.Lengths !== 'All')
                        if (Scattered[sc].puzzle_length !== scatteredFilters.Lengths)
                            add_model = false;

                if (add_model) {
                    if (scatteredFilters.Mode === 'Active' && active_models.indexOf(sc) < 0){
                        add_model = false;
                    }
                    else if (groupedFilters.Mode === 'Disactive' && active_models.indexOf(sc) > -1) {
                        add_model = false;
                    }
                }

                if (add_model)
                    filtered[sc] = Scattered[sc];
            }
            return filtered;
        }
    }, [active_models, puzzles_models_mem, scatteredFilters, groupedFilters.Mode]);

    const filtered_types = {
        Grouped: group_filter,
        Scattered: scattered_filter
    };

    const filters = {
        Grouped: {
            value: groupedFilters,
            set: setGroupedFilters
        },
        Scattered: {
            value: scatteredFilters,
            set: setScatteredFilters
        }
    }

    return (
        <div
            className='PuzzleModelsList'

        >
            {
                Object.keys(filtered_types).map(
                    type => (
                        <FilteredTypes
                            key={'f-t-' + type}
                            type={type}
                            filters={filters}
                            all_sizes={all_sizes}
                            filtered_types={filtered_types}
                            changeSettings={changeSettings}
                            active_models={active_models}
                        />
                    )
                )
            }
        </div>
    )
};

// const checkPuzzleSettings = ({game_settings, puzzles_models_mem, setCheckMessages}) => {
//     const {number_of_puzzles, type_of, active_size, active_length, active_models} = game_settings.game;
//     let all_puzzles = type_of === 'Both' ? Object.assign({}, puzzles_models_mem.types.Grouped, puzzles_models_mem.types.Scattered) : Object.assign({}, puzzles_models_mem.types[type_of]);
//     let number_of_puzzle_final = {
//         Scattered: 0,
//         Grouped: 0
//     };
//
//     for (let puzzle in all_puzzles){
//         if (active_models.indexOf(puzzle) > -1 && all_puzzles[puzzle].puzzle_length ==  active_length && all_puzzles[puzzle].puzzle_size == active_size){
//             number_of_puzzle_final[all_puzzles[puzzle].puzzle_type]++;
//         }
//     }
//
//     let msg;
//     if (type_of === 'Both'){
//         // let num = type_of === 'Both' ? (number_of_puzzle_final.Scattered + number_of_puzzle_final.Grouped) : number_of_puzzle_final[type_of];
//
//         let check_res = false;
//         if (number_of_puzzle_final.Grouped > 0 && number_of_puzzle_final.Scattered > 0 && number_of_puzzle_final.Grouped >= number_of_puzzles && number_of_puzzle_final.Scattered >= number_of_puzzles )
//             check_res = true;
//
//         msg = [
//             {
//                 label: `Possible puzzles of Scattered=${number_of_puzzle_final.Scattered}`,
//                 className: (number_of_puzzle_final.Scattered > 0 && number_of_puzzle_final.Scattered >= number_of_puzzles) ? 'puzzle-check-msg' : 'puzzle-check-msg-Error',
//             },
//             {
//                 label: `Possible puzzles of Grouped=${number_of_puzzle_final.Grouped}`,
//                 className: (number_of_puzzle_final.Grouped > 0 && number_of_puzzle_final.Grouped >= number_of_puzzles) ? 'puzzle-check-msg' : 'puzzle-check-msg-Error',
//             },
//             {
//                 label: check_res ? 'Settings is OK!' : 'Error check settings',
//                 className: check_res ? 'puzzle-check-msg-settings-ok' : 'puzzle-check-msg-settings-Error',
//             }
//         ]
//     }
//     else {
//         let num = number_of_puzzle_final[type_of];
//         msg = [
//             {
//                 label: `Number of possible puzzles in this mode = ${num}`,
//                 className: 'puzzle-check-msg'
//             },
//             {
//                 label: (num >= number_of_puzzles && num > 0) ? 'Settings is OK!' : 'Error check settings',
//                 className: (num >= number_of_puzzles && num > 0) ? 'puzzle-check-msg-settings-ok' : 'puzzle-check-msg-settings-Error',
//             }
//         ]
//     }
//     setCheckMessages(msg);
// };

const Settings = ({game_settings, changeSettings, LAST_SETTING_NAME, versions_list, exp_more_settings}) => {
    const puzzles_models_mem = useMemo(() => {
        const {puzzles_models} = exp_more_settings;
        let sets = {
            lengths: {},
            sizes: {},
            types: {}
        };

        /*
puzzle_length: 40
puzzle_size: "30X30"
puzzle_type: "Scattered"
         */
        for (let i=0; i<puzzles_models.length; i++){
            if (!sets.lengths[puzzles_models[i].puzzle_length])
                sets.lengths[puzzles_models[i].puzzle_length] = {};

            if (!sets.lengths[puzzles_models[i].puzzle_length][puzzles_models[i].puzzle_id])
                sets.lengths[puzzles_models[i].puzzle_length][puzzles_models[i].puzzle_id] = puzzles_models[i];


            if (!sets.sizes[puzzles_models[i].puzzle_size])
                sets.sizes[puzzles_models[i].puzzle_size] = {};

            if (!sets.sizes[puzzles_models[i].puzzle_size][puzzles_models[i].puzzle_id])
                sets.sizes[puzzles_models[i].puzzle_size][puzzles_models[i].puzzle_id] = puzzles_models[i];


            if (!sets.types[puzzles_models[i].puzzle_type])
                sets.types[puzzles_models[i].puzzle_type] = {};

            if (!sets.types[puzzles_models[i].puzzle_type][puzzles_models[i].puzzle_id])
                sets.types[puzzles_models[i].puzzle_type][puzzles_models[i].puzzle_id] = puzzles_models[i];
        }

        return sets;
    }, [exp_more_settings]);
    const [checkMessages, setCheckMessages] = useState([]);

    useEffect(() => {
        setCheckMessages([]);
    }, [game_settings]);

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
            label: 'Puzzles time out:',
            show: true,
            class_name: '',
            value: game_settings.game.puzzles_time_out,
            input_type: 'number',
            step: 1,
            min: 1,
            label_after: '[mm:ss]',
            pattern: 'MM:SS',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'puzzles_time_out',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Words show time out:',
            show: true,
            class_name: '',
            value: game_settings.game.words_show_time_out,
            input_type: 'number',
            step: 1,
            min: 1,
            label_after: '[mm:ss]',
            pattern: 'MM:SS',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'words_show_time_out',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Record move time out:',
            show: true,
            class_name: '',
            value: game_settings.game.record_move_time_out,
            input_type: 'number',
            step: 1,
            min: 1,
            label_after: 'milliseconds',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'record_move_time_out',
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
        // {
        //     type: 'Select',
        //     label: 'Words list direction:',
        //     show: true,
        //     options: ['up', 'sides'],
        //     value: game_settings.game.words_list_direction,
        //     callback: value => changeSettings({
        //         settings_of: 'game_settings',
        //         key: 'game',
        //         key2: 'words_list_direction',
        //         value,
        //     })
        // },
    ];

    const magnifier_elements = [
        {
            type: 'Select',
            label: 'Magnifier shape:',
            show: true,
            options: ['Circle', 'Rect'],
            value: game_settings.game.magnifer_shape,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'magnifer_shape',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Demo magnifier radius:',
            show: game_settings.game.magnifer_shape === 'Circle',
            class_name: '',
            value: game_settings.game.demo_magnifer_radius,
            input_type: 'number',
            step: 1,
            min: 1,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'demo_magnifer_radius',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Game magnifier radius:',
            show: game_settings.game.magnifer_shape === 'Circle',
            class_name: '',
            value: game_settings.game.game_magnifer_radius,
            input_type: 'number',
            step: 1,
            min: 1,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'game_magnifer_radius',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Demo magnifier height:',
            show: game_settings.game.magnifer_shape === 'Rect',
            class_name: '',
            value: game_settings.game.demo_magnifer_height,
            input_type: 'number',
            step: 1,
            min: 1,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'demo_magnifer_height',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Demo magnifier width:',
            show: game_settings.game.magnifer_shape === 'Rect',
            class_name: '',
            value: game_settings.game.demo_magnifer_width,
            input_type: 'number',
            step: 1,
            min: 1,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'demo_magnifer_width',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Game magnifier height:',
            show: game_settings.game.magnifer_shape === 'Rect',
            class_name: '',
            value: game_settings.game.game_magnifer_height,
            input_type: 'number',
            step: 1,
            min: 1,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'game_magnifer_height',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Game magnifier width:',
            show: game_settings.game.magnifer_shape === 'Rect',
            class_name: '',
            value: game_settings.game.game_magnifer_width,
            input_type: 'number',
            step: 1,
            min: 1,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'game_magnifer_width',
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

    const puzzles_elements = [
        {
            type: 'Input',
            label: 'Number of puzzles:',
            show: true,
            class_name: '',
            value: game_settings.game.number_of_puzzles,
            input_type: 'number',
            step: 1,
            min: 1,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'number_of_puzzles',
                value,
            })
        },
        {
            type: 'Select',
            label: 'Active type:',
            show: true,
            options: ['Both', 'Grouped', 'Scattered'],
            value: game_settings.game.type_of,
            callback: value => wpChangePuzzleSettings({
                key2: 'type_of',
                value,
                changeSettings,
                game_settings,
                puzzles_models_mem
            }),
            // callback: value => changeSettings({
            //     settings_of: 'game_settings',
            //     key: 'game',
            //     key2: 'type_of',
            //     value,
            // })
        },
        // {
        //     type: 'Select',
        //     label: 'Active size:',
        //     show: true,
        //     options: getSizes(puzzles_models_mem, game_settings.game.type_of),
        //     value: game_settings.game.active_size,
        //     callback: value => wpChangePuzzleSettings({
        //         key2: 'active_size',
        //         value,
        //         changeSettings,
        //         game_settings,
        //         puzzles_models_mem
        //     })
        //     // callback: value => changeSettings({
        //     //     settings_of: 'game_settings',
        //     //     key: 'game',
        //     //     key2: 'active_size',
        //     //     value,
        //     // })
        // },
        // {
        //     type: 'Select',
        //     label: 'Active length:',
        //     show: true,
        //     options: getLengths(puzzles_models_mem, game_settings.game.type_of, game_settings.game.active_size),
        //     value: game_settings.game.active_length,
        //     callback: value => changeSettings({
        //         settings_of: 'game_settings',
        //         key: 'game',
        //         key2: 'active_length',
        //         value,
        //     })
        // },
        // {
        //     type: 'Button',
        //     class_name: '',
        //     label: 'Check settings',
        //     show: true,
        //     callback: () => checkPuzzleSettings({
        //         game_settings,
        //         puzzles_models_mem,
        //         setCheckMessages
        //     })
        // }
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
                        label: 'Magnifier:',
                        show: true
                    }]}
                />
                <DivContainer
                    className='admin-settings-section-raw admin-settings-section-b'
                    elements={magnifier_elements}
                />
            </DivContainer>

            <DivContainer
                className='admin-settings-section admin-settings-section-raw'
            >
                <div
                    className='puzzles-check'
                >
                    {
                        checkMessages.map(
                            message => (
                                <label
                                    key={message.className + message.label}
                                    className={message.className}
                                >
                                    {message.label}
                                </label>
                            )
                        )
                    }
                </div>
                <DivContainer
                    className='admin-settings-section-col admin-settings-section-h'
                    elements={[{
                        type: 'Label',
                        label: 'Puzzles:',
                        show: true
                    }]}
                />
                <DivContainer
                    className='admin-settings-section-raw admin-settings-section-b'
                    elements={puzzles_elements}
                />
            </DivContainer>

            <DivContainer
                className='admin-settings-section admin-settings-section-raw'
            >
                <DivContainer
                    className='admin-settings-section-col admin-settings-section-h'
                    elements={[{
                        type: 'Label',
                        label: 'Puzzles models:',
                        show: true
                    }]}
                />

                <PuzzleModelsList
                    changeSettings={changeSettings}
                    puzzles_models_mem={puzzles_models_mem}
                    active_models={game_settings.game.active_models}
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


