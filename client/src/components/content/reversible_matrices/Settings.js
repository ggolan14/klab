import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import {DivContainer} from "../../screens/settings/elements_builder";
import './reverseStyles.css';
import {convertPointsRatio} from "../../screens/settings/settings";
import ColorPicker from "../../layout/colorPicker/color_picker";

// click are obligatory

const DistItem = ({dist, changeDist, distIndex, deleteDist, index, length}) => {
    return (
        <div
            className='dist_item'
        >
            <label>
                Value:
                <input
                    type='number'
                    onKeyDown={e => {
                        if ((e.keyCode < 48 || e.keyCode > 57) && e.keyCode !== 8)
                            e.preventDefault();
                    }}
                    value={dist.value}
                    onChange={e => {
                        changeDist(index, distIndex, 'value', e.target.value)
                    }}
                />
            </label>
            <label>
                Prob:
                <input
                    type='number'
                    step={0.01}
                    onKeyDown={e => {
                        if ((e.keyCode < 48 || e.keyCode > 57) && e.keyCode !== 8 && e.keyCode !== 190)
                            e.preventDefault();
                    }}
                    value={dist.prob}
                    onChange={e => {
                        if (e.target.value.match(/./g) > 1){
                            e.preventDefault();
                            return;
                        }

                        changeDist(index, distIndex, 'prob', e.target.value)
                    }}
                />
            </label>
            <button onClick={() => deleteDist(index, distIndex)}>Delete</button>
        </div>
    )
};

const MatItem = ({index, className, matrixSize, changeItem, matrix, addDist, changeDist, deleteDist, setDeleteIndex, dist_error}) => {

    return (
        <tr
            className={className}
        >
            <td>{index+1}.</td>

            <td>
                <div>
                    <input
                        value={matrixSize[0]}
                        onKeyDown={e => {
                            if ((e.keyCode < 48 || e.keyCode > 57) && e.keyCode !== 8)
                                e.preventDefault();
                        }}
                        onChange={e => changeItem(index, 'size', `${e.target.value}X${matrixSize[1]}`, null)}
                    />
                    <label>X</label>
                    <input
                        onKeyDown={e => {
                            if ((e.keyCode < 48 || e.keyCode > 57) && e.keyCode !== 8)
                                e.preventDefault();
                        }}
                        onChange={e => changeItem(index, 'size', `${matrixSize[0]}X${e.target.value}`, null)}
                        value={matrixSize[1]}
                    />
                </div>
            </td>

            <td>
                <input
                    style={{minWidth: '7rem', width: 'max-content'}}
                    value={matrix.group || ''}
                    onChange={e => changeItem(index, 'group', e.target.value, null)}
                />
            </td>

            <td>
                <select
                    value={matrix.active}
                    onChange={e => changeItem(index, 'active', e.target.value, null)}
                >
                    <option value={'True'}>True</option>
                    <option value={'False'}>False</option>
                </select>
            </td>

            <td>
                <div
                    className='dists'
                >
                    <button className='add_dist' onClick={() => addDist(index)}>Add value</button>
                    {
                        matrix.dist.map(
                            (dist, distIndex) => (
                                <DistItem
                                    key={'dist'+distIndex}
                                    dist={dist}
                                    changeDist={changeDist}
                                    distIndex={distIndex}
                                    deleteDist={deleteDist}
                                    index={index}
                                    length={matrix.dist.length}
                                />
                            )
                        )
                    }
                </div>
            </td>

            <td>
                <button
                    onClick={() => setDeleteIndex(index)}
                    // onClick={() => onDelete()}
                >Delete</button>
            </td>

            <td>
                <div style={{display: 'grid'}}>
                    {dist_error.map((err, index__) => (
                        <label
                            key={'err'+index__}
                            className={err.error ? 'dist_error' : 'dist_ok'}
                        >{err.msg} {err.error ? <span className='err'>&#10008;</span> : <span className='ok'>&#10004;</span>}</label>
                    ))}
                </div>
            </td>

        </tr>
    )
}

const MatricesBank = ({matrices_bank, changeSettings}) => {

    const [deleteIndex, setDeleteIndex] = useState(null);
    const [sizeSelect, setSizeSelect] = useState('All');
    const [activeSelect, setActiveSelect] = useState('All');

    const addItem = () => {
        let new_item = {
            active: 'True',
            size: sizeSelect === 'All' ? "12X12" : sizeSelect,
            group: '',
            dist: [
                {
                    value: 1,
                    prob: 1,
                },
            ]
        };

        let p_bank = [...matrices_bank, new_item];
        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'matrices_bank',
            value: p_bank,
        });
    }

    const removeItem = () => {
        let p_bank = matrices_bank.filter(
            (p, index) => index !== deleteIndex
        );
        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'matrices_bank',
            value: [...p_bank],
        });
        setDeleteIndex(null);
    }

    const changeItem = (index, attr, value, second_attr) => {
        let p_bank = [...matrices_bank];

        if (second_attr !== null)
            p_bank[index][attr][second_attr] = value;
        else
            p_bank[index][attr] = value;

        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'matrices_bank',
            value: p_bank,
        });

        if (attr === 'size' && (sizeSelect !== 'All' && p_bank[index].size !== sizeSelect))
            setSizeSelect(p_bank[index].size);
    }

    const addDist = (index) => {
        let p_bank = [...matrices_bank];

        p_bank[index].dist.push({
            value: 1,
            prob: 1,
        });

        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'matrices_bank',
            value: p_bank,
        });
    }

    const deleteDist = (matIndex, distIndex) => {
        let p_bank = [...matrices_bank];

        p_bank[matIndex].dist = p_bank[matIndex].dist.filter(
            (dist_, distIndex_) => distIndex_ !== distIndex
        );

        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'matrices_bank',
            value: p_bank,
        });
    };

    const changeDist = (matIndex, distIndex, attr, value) => {
        let p_bank = [...matrices_bank];

        p_bank[matIndex].dist[distIndex][attr] = value;

        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'matrices_bank',
            value: p_bank,
        });
    };

    const allSize = Array.from(new Set(matrices_bank.map(matrix => matrix.size)));

    return (
        <>
            <div
                className='M_S-ProblemsBank R_M-MatricesBank'
                // className='R_M-MatricesBank'
            >
                <button onClick={addItem}>Add item</button>
                <div className='mb_filters'>
                    <div>
                        <label>Active</label>
                        <select
                            value={activeSelect}
                            onChange={e => setActiveSelect(e.target.value)}
                        >
                            <option value='All'>All</option>
                            <option value='True'>True</option>
                            <option value='False'>False</option>
                        </select>
                    </div>

                    <div>
                        <label>Size</label>
                        <select
                            value={sizeSelect}
                            onChange={e => setSizeSelect(e.target.value)}
                        >
                            <option value='All'>All</option>
                            {
                                allSize.map(
                                    (size, index__) => <option value={size} key={'size'+index__}>{size}</option>
                                )
                            }
                        </select>
                    </div>
                </div>
                <table>
                    <thead>
                    <tr>
                        <th><u>Index</u></th>
                        <th><u>size</u></th>
                        <th><u>group</u></th>
                        <th><u>active</u></th>
                        <th><u>Distributions</u></th>
                        <th></th>
                        <th></th>
                    </tr>
                    </thead>

                    <tbody>
                    {
                        matrices_bank.map(
                            (matrix, index) => {
                                if (!matrix || (activeSelect !== 'All' && matrix.active !== activeSelect) || (sizeSelect !== 'All' && matrix.size !== sizeSelect))
                                    return <Fragment key={'empty_mat'+index}></Fragment>;

                                const className = matrix.active === 'True' ? 'active' : 'no_active';

                                const matrixSize = matrix.size.split('X');

                                let dist_error = [];
                                if (matrix.dist.length === 0)
                                    dist_error.push({
                                        msg: 'Distribution is missing',
                                        error: true
                                    });
                                else {
                                    let sum = matrix.dist.reduce((prev, curr) => (prev*100 + Number(curr.prob)*100)/100, 0);

                                    dist_error.push({
                                        msg: `Sum=${sum}`,
                                        error: sum !== 1
                                    });
                                }

                                return (
                                    <MatItem
                                        key={'MatItem'+index}
                                        index={index}
                                        className={className}
                                        matrixSize={matrixSize}
                                        changeItem={changeItem}
                                        matrix={matrix}
                                        addDist={addDist}
                                        changeDist={changeDist}
                                        deleteDist={deleteDist}
                                        setDeleteIndex={setDeleteIndex}
                                        dist_error={dist_error}
                                    />
                                )
                            })
                    }
                    </tbody>
                </table>
            </div>

            {
                deleteIndex !== null && (
                    <div
                        className='M_S-ProblemsBank_DeleteIndex'
                    >
                        <div>
                            <label>Are you sure to delete <span>{deleteIndex+1}</span>?</label>
                            <div>
                                <button onClick={() => setDeleteIndex(null)}>Cancel</button>
                                <button onClick={removeItem}>Yes</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
};

const GameElement = ({element}) => {

    return (
        <div
            style={{
                display: 'grid',
                gridAutoFlow: 'column',
                gridTemplateColumns: 'repeat(3, max-content)',
                gridColumnGap: '0.5rem'
            }}
        >
            <label>{element[0].label}</label>
            <select
                value={element[0].value}
                onChange={e => element[0].callback(e.target.value)}
            >
                {
                    element[0].options.map(
                        (option, index__) => (
                            <option key={'option'+index__}>{option}</option>
                        )
                    )
                }
            </select>
            <input
                onKeyDown={e => {
                    if ((e.keyCode < 48 || e.keyCode > 57) && e.keyCode !== 8)
                        e.preventDefault();
                }}
                className={element[1].className}
                value={element[1].value}
                onChange={e => {
                    if (isNaN(e.target.value))
                        return;
                    element[1].callback(e.target.value);
                }}
            />
        </div>
    )
}

const ItemValue = ({mem_index, value_index, value_item, removeItemFromMem, changeMemItem}) => {

    return (
        <div className='R_M-mtb-i_v'>
            <label onClick={() => removeItemFromMem(mem_index, value_index)}>X</label>
            <input
                value={value_item}
                maxLength={2}
                onChange={e => changeMemItem(mem_index, value_index, e.target.value)}
            />
        </div>
    )
}

const MemoryItem = ({mem, mem_index, removeMem, addItemToMem, removeItemFromMem, changeMemItem}) => {

    return (
        <div className='R_M-mtb-m_i'>
            <label>{mem_index+1}</label>
            <button className='btn-delete' onClick={() => removeMem(mem_index)}>Remove</button>
            <button className='btn-add' onClick={() => addItemToMem(mem_index)}>Add item</button>
            <div className='R_M-mtb-i_v_list'>
                {
                    mem.map(
                        (value_item, value_index) => (
                           <ItemValue
                               key={value_index}
                               mem_index={mem_index}
                               value_index={value_index}
                               value_item={value_item}
                               removeItemFromMem={removeItemFromMem}
                               changeMemItem={changeMemItem}
                           />
                        )
                    )
                }
            </div>
        </div>
    )
}

const MemoryTask = ({game_settings, changeSettings}) => {

    const [expand, setExpand] = useState(true);

    const addNewMem = () => {

        let mem_task = game_settings.mem_task || [];
        mem_task.push([]);

        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'mem_task',
            value: mem_task,
        });
    }

    const removeMem = mem_index => {
        let mem_task = game_settings.mem_task || [];
        mem_task = mem_task.filter((mt, mt_i) => mt_i !== mem_index);

        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'mem_task',
            value: mem_task,
        });
    }

    const addItemToMem = mem_index => {
        let mem_task = game_settings.mem_task;
        mem_task[mem_index].push('');

        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'mem_task',
            value: mem_task,
        });
    }

    const removeItemFromMem = (mem_index, item_index) => {
        let mem_task = game_settings.mem_task;
        mem_task[mem_index] = mem_task[mem_index].filter((it, it_i) => it_i !== item_index);

        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'mem_task',
            value: mem_task,
        });
    }

    const changeMemItem = (mem_index, item_index, new_value) => {
        let mem_task = game_settings.mem_task;
        mem_task[mem_index][item_index] = new_value;

        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'mem_task',
            value: mem_task,
        });
    }

    const changeLetterShow = (new_value) => {
        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'l_s',
            value: new_value,
        });
    }

    let {mem_task, l_s} = game_settings;

    if (!mem_task) mem_task = [];
    if (!l_s) l_s = 1;
    return (
        <div className='R_M-MemoryTaskBank'>
            <div className='R_M-mtb-sc'>
                <label>Show characters:</label>
                <input
                    onKeyDown={e => {
                        if ((e.keyCode < 48 || e.keyCode > 57) && e.keyCode !== 8 && e.keyCode !== 190 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 38 && e.keyCode !== 40)
                            e.preventDefault();
                    }}
                    type='number'
                    step={0.1}
                    min={0.1}
                    value={l_s}
                    onChange={e => changeLetterShow(e.target.value)}
                />
                <label>Seconds</label>
            </div>
            <div className='R_M-mtb-h'>
                <label
                    onClick={() => setExpand(!expand)}
                >{expand ? '-' : '+'}</label>
                <button onClick={addNewMem}>Insert new</button>
            </div>

            {
                expand && (
                    <div className='R_M-mtb-list'>
                        {
                            mem_task.map(
                                (mt, mt_i) => (
                                    <MemoryItem
                                        key={mt_i}
                                        mem={mt}
                                        mem_index={mt_i}
                                        removeMem={removeMem}
                                        addItemToMem={addItemToMem}
                                        removeItemFromMem={removeItemFromMem}
                                        changeMemItem={changeMemItem}
                                    />
                                )
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}

const GameSettings = ({game_settings, changeSettings}) => {
    //
    const game_elements = [
        [
            {
                label: 'Number of matrices:',
                options: ['NoLimit', 'Limit'],
                value: game_settings.num_of_mat_rule,
                callback: value => changeSettings({
                    settings_of: 'game_settings',
                    key: 'game',
                    key2: 'num_of_mat_rule',
                    value,
                })
            },
            {
                value: game_settings.num_of_mat,
                className: game_settings.num_of_mat_rule === 'NoLimit' ? 'disabledElem' : '',
                callback: value => changeSettings({
                    settings_of: 'game_settings',
                    key: 'game',
                    key2: 'num_of_mat',
                    value,
                })
            },
        ],
        [
            {
                label: 'Stage1 clicks:',
                options: ['NoLimit', 'Limit'],
                value: game_settings.stage1_clicks_rule,
                callback: value => changeSettings({
                    settings_of: 'game_settings',
                    key: 'game',
                    key2: 'stage1_clicks_rule',
                    value,
                })
            },
            {
                value: game_settings.stage1_clicks,
                className: game_settings.stage1_clicks_rule === 'NoLimit' ? 'disabledElem' : '',
                callback: value => changeSettings({
                    settings_of: 'game_settings',
                    key: 'game',
                    key2: 'stage1_clicks',
                    value,
                })
            },
        ],
        [
            {
                label: 'Stage2 clicks:',
                options: ['NoLimit', 'Limit'],
                value: game_settings.stage2_clicks_rule,
                callback: value => changeSettings({
                    settings_of: 'game_settings',
                    key: 'game',
                    key2: 'stage2_clicks_rule',
                    value,
                })
            },
            {
                value: game_settings.stage2_clicks,
                className: game_settings.stage2_clicks_rule === 'NoLimit' ? 'disabledElem' : '',
                callback: value => changeSettings({
                    settings_of: 'game_settings',
                    key: 'game',
                    key2: 'stage2_clicks',
                    value,
                })
            },
        ]
    ];

    return (
        <div
            className='admin-settings-section-raw admin-settings-section-b'
        >
            {
                game_elements.map(
                    element => (
                        <GameElement element={element} key={element[0].label} />
                    )
                )
            }
        </div>
    )
};

const default_practice_mat = [
    {
        dist: [3, 2, 1],
        MatColor: 'rgb(217,134,134)'
    },
    {
        dist: [12, 11],
        dist2: [12, 23, 4],
        MatColor: 'rgb(61,122,38)',
    },
    {
        dist: [77, 55],
        MatColor: 'rgb(152,175,255)',
    },
    {
        dist: [13, 17],
        MatColor: 'rgb(203,144,234)',
    },
]

const P_MAT_DIST = ({dist, dist_index, dist_item, removeDist, changeDist}) => {
    return (
        <div className='SET_PM-dist_item'>
            <label onClick={() => removeDist(dist_index)}>X</label>
            <input
                value={dist}
                onChange={e => changeDist(dist_item, dist_index, Number(e.target.value))}
            />
        </div>
    )
}

const P_MAT = ({label, matrix, changeMat, index, last_index}) => {

    const changeDist = (dist_item, dist_index, dist_value) => {
        let new_dists = matrix[dist_item];
        new_dists[dist_index] = dist_value;
        changeMat(dist_item, new_dists, index)
    }

    const addDist = () => {
        let new_dists = matrix.dist;
        new_dists.push('');
        changeMat('dist', new_dists, index)
    }

    const removeDist = (dist_index) => {
        let new_dists = matrix.dist;
        new_dists = new_dists.filter((d, d_i) => d_i !== dist_index);
        changeMat('dist', new_dists, index)
    }

    let color = 'black';
    if (index === 1)
        color = 'rgb(33,115,0)';
    else if (last_index)
        color = 'rgb(204,68,68)';

    return (
        <>
            <label style={{color}}>{label}{index === 1 ? ' (green)' : ''}{last_index ? ' (empty)' : ''}</label>
            <ColorPicker
                defaultValue={matrix.MatColor}
                setSetting={value => changeMat('MatColor', value, index)}
            />
            <div className='SET_PM-dist'>
                <label>Values:</label>
                <button onClick={addDist}>Add</button>
                {
                    matrix.dist.map(
                        (dist, dist_index) => (
                            <P_MAT_DIST
                                dist_item='dist'
                                key={'dist' + dist_index}
                                dist={dist}
                                dist_index={dist_index}
                                changeDist={changeDist}
                                removeDist={removeDist}
                            />
                        )
                    )
                }

                {
                    index === 1 && (
                        // matrix.dist2 && Array.isArray(matrix.dist2) && (
                        <div className='SET_PM-dist2'>
                            <label>Values2:</label>
                            <button onClick={addDist}>Add</button>
                            {
                                (matrix.dist2 || []).map(
                                    (dist, dist_index) => (
                                        <P_MAT_DIST
                                            dist_item='dist2'
                                            key={'dist2' + dist_index}
                                            dist={dist}
                                            dist_index={dist_index}
                                            changeDist={changeDist}
                                            removeDist={removeDist}
                                        />
                                    )
                                )
                            }
                        </div>
                    )
                }
            </div>
        </>
    )
}

const PracticeMatrices = ({game_settings, changeSettings}) => {
    let practice_mat = game_settings.pm_bank || default_practice_mat;

    const changeMat = (prop, value, index) => {
        practice_mat[index][prop] = value;
        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'pm_bank',
            value: practice_mat,
        });
    }

    return (
        <div
            className='SET_PM admin-settings-section-raw admin-settings-section-b'
        >
            <label><u><b>Practice matrices:</b></u></label>
            <div
                className='SET_PM_list admin-settings-section-raw admin-settings-section-b'
            >
                {
                    practice_mat.map(
                        (element, element_index) => (
                            <P_MAT
                                index={element_index}
                                label={'Matrix #' + (element_index+1)}
                                key={'Matrix #' + (element_index+1)}
                                matrix={element}
                                changeMat={changeMat}
                                last_index={element_index === (practice_mat.length-1)}
                            />
                        )
                    )
                }
            </div>
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
            type: 'Input',
            label: 'Sampling delay:',
            show: true,
            class_name: '',
            value: game_settings.game.sampling_delay,
            input_type: 'number',
            step: 0.1,
            min: 0.1,
            label_after: 'Seconds',
            pattern: '',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'sampling_delay',
                value,
            })
        },
        {
            type: 'Select',
            label: 'Skip matrix button:',
            show: true,
            options: ['Yes', 'No'],
            value: game_settings.game.skip_matrix_btn,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'skip_matrix_btn',
                value,
            })
        },
        {
            type: 'Select',
            label: 'Stage 2 Obligatory clicks:',
            show: true,
            options: ['Yes', 'No'],
            value: game_settings.game.stage2_obligatory,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'stage2_obligatory',
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

                <GameSettings
                    changeSettings={changeSettings}
                    game_settings={game_settings.game}
                />

                <PracticeMatrices
                    changeSettings={changeSettings}
                    game_settings={game_settings.game}
                />
            </DivContainer>

            <DivContainer
                className='admin-settings-section admin-settings-section-raw'
            >
                <DivContainer
                    className='admin-settings-section-col admin-settings-section-h'
                    elements={[{
                        type: 'Label',
                        label: 'Memory task:',
                        show: true
                    }]}
                />

                <MemoryTask
                    changeSettings={changeSettings}
                    game_settings={game_settings.game}
                />
            </DivContainer>

            <DivContainer
                className='admin-settings-section admin-settings-section-raw'
            >
                <DivContainer
                    className='admin-settings-section-col admin-settings-section-h'
                    elements={[{
                        type: 'Label',
                        label: 'Matrices bank:',
                        show: true
                    }]}
                />

                <MatricesBank
                    changeSettings={changeSettings}
                    matrices_bank={game_settings.game.matrices_bank}
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
