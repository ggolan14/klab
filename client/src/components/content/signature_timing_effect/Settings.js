import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {DivContainer} from "../../screens/settings/elements_builder";
import {convertPointsRatio} from "../../screens/settings/settings";
import ColorPicker from "../../layout/colorPicker/color_picker";
import './steStyles.css';

const Answer = ({removeAnswer, changeAnswer, answer, answer_index}) => {

    return (
        <div className='settings-ste_add_answer'>
            <label>{answer_index+1}</label>
            <button
                className='btn-delete'
                onClick={() => removeAnswer(answer_index)}
            >Delete</button>
            <input
                value={answer}
                placeholder={`insert answer #${answer_index+1}`}
                onChange={e => changeAnswer(answer_index, e.target.value)}
            >
            </input>
        </div>
    )
}

const Question = ({question, question_index, removeQuestion, changeQuestion}) => {

    const addAnswer = () => {
        const {answers} = question;
        answers.push('');
        changeQuestion(question_index, 'answers', answers);
    }

    const removeAnswer = (answer_index) => {
        let {answers} = question;
        answers = answers.filter((ans, ans_index) => ans_index !== answer_index);
        changeQuestion(question_index, 'answers', answers);
    }

    const changeAnswer = (answer_index, value) => {
        let {answers} = question;
        answers[answer_index] = value;
        changeQuestion(question_index, 'answers', answers);
    }

    return (
        <div className='settings-ste_ques'>
            <div className='settings-ste_add_ques'>
                <label>{question_index+1}</label>
                <button
                    className='btn-delete'
                    onClick={() => removeQuestion(question_index)}
                >Delete</button>
                <input
                    value={question.que}
                    placeholder={`insert question #${question_index+1}`}
                    onChange={e => changeQuestion(question_index, 'que', e.target.value)}
                >
                </input>

            </div>

            <button className='settings-ste_btn-add_ans' onClick={addAnswer}>Add answer</button>
            {
                question.answers.map(
                    (answer, answer_index) => (
                        <Answer
                            removeAnswer={removeAnswer}
                            changeAnswer={changeAnswer}
                            key={'answer' +answer_index+ question_index}
                            answer={answer}
                            answer_index={answer_index}
                        />
                    )
                )
            }
        </div>
    )
}

const Story = ({story, changeStoryAttr, removeStory, story_index}) => {

    const [expand, setExpand] = useState(true);

    const addQuestion = () => {
        const {questions} = story;
        questions.push({
            que: '',
            answers: []
        });
        changeStoryAttr(story_index, 'questions', questions);
    }

    const removeQuestion = question_index => {
        let {questions} = story;
        questions = questions.filter((q_, q_index) => q_index !== question_index);
        changeStoryAttr(story_index, 'questions', questions);
    }

    const changeQuestion = (question_index, attr, value) => {
        let {questions} = story;
        questions[question_index][attr] = value;

        changeStoryAttr(story_index, 'questions', questions);
    }

    return (
        <div className='settings-ste_story'>
            <div className='settings-ste_story_l'>
                <label
                    onClick={() => setExpand(!expand)}
                >{expand? '-' : '+'}</label>
                <label>{story_index+1}.</label>
                <div>
                    <label>Active</label>
                    <select
                        value={story.active}
                        onChange={e => (
                            changeStoryAttr(story_index, 'active', e.target.value)
                        )}
                    >
                        <option value={'True'}>True</option>
                        <option value={'False'}>False</option>
                    </select>
                </div>

                <button
                    className='btn-delete'
                    onClick={() => removeStory(story_index)}
                >Delete</button>
            </div>

            {
                expand && (
                    <div
                        className='settings-ste_story_r'
                    >
                        <textarea
                            value={story.story_txt}
                            onChange={e => changeStoryAttr(story_index, 'story_txt', e.target.value)}
                        />
                        <button
                            className='settings-ste_btn-add_ques'
                            onClick={addQuestion}
                        >Add Question</button>

                        {
                            story.questions.map(
                                (question, question_index) => (
                                    <Question
                                        removeQuestion={removeQuestion}
                                        changeQuestion={changeQuestion}
                                        key={'question' + story_index + question_index}
                                        question={question}
                                        question_index={question_index}
                                    />
                                )
                            )
                        }
                    </div>
                )
            }

            <span></span>
        </div>
    )
};

const Stories = ({settings, changeSettings}) => {

    const addStory = () => {
        // let stories = [];
        let {stories} = settings;
        stories.push({
            story_txt: '',
            questions: [],
            active: 'True'
        });

        changeSettings( {
            settings_of: 'game_settings',
            key: 'game',
            key2: 'stories',
            value: stories,
        })
    };

    const changeStoryAttr = (story_index, attr, value) => {
        let {stories} = settings;
        stories[story_index][attr] = value;

        changeSettings( {
            settings_of: 'game_settings',
            key: 'game',
            key2: 'stories',
            value: stories,
        })
    }

    const removeStory = story_index => {
        let {stories} = settings;
        stories = stories.filter((st, st_index) => st_index !== story_index);

        changeSettings( {
            settings_of: 'game_settings',
            key: 'game',
            key2: 'stories',
            value: stories,
        });

        let p_s = Number(settings.p_s);
        if (p_s > stories.length) {
            p_s = stories.length;
            changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'p_s',
                value: p_s,
            })
        }

    }

    return (
        <div className='settings-ste_stories'>

            <button className='settings-ste_btn-add_story' onClick={addStory}>Add Story</button>

            <div>
                {
                    settings.stories.map(
                        (story, story_index) => (
                            <Story
                                key={'story' + story_index}
                                story={story}
                                changeStoryAttr={changeStoryAttr}
                                removeStory={removeStory}
                                story_index={story_index}
                            />
                        )
                    )
                }
            </div>
        </div>
    )
};

const CorrectAnswers = ({question_index, answers, correct_answer, changeCorrect}) => {

    return (
        <div
            className='settings-ste_bonus_q_o'
        >
            <select
                value={correct_answer || 'Select'}
                onChange={e => changeCorrect(question_index, e.target.value)}
                style={{marginRight: 5}}
            >
                <option
                    value='Select'
                    disabled={true}
                >Select</option>
                {
                    answers.map(
                        (a, a_) => (
                            <option
                                key={a_}
                                value={a_}
                            >{a_+1}</option>
                        )
                    )
                }
            </select>
            <label>{question_index+1}</label>
        </div>
    )
}

const BonusQuestions = ({settings, changeSettings}) => {
    const [expand, setExpand] = useState(true);

    const addQuestion = () => {
        let {bonus_ques, c_b} = settings;
        if (bonus_ques === undefined)
            bonus_ques = [];
        if (c_b === undefined)
            c_b = [];
        bonus_ques.push({
            que: '',
            answers: []
        });
        c_b.push(null);
        changeSettings([
            {
                settings_of: 'game_settings',
                key: 'game',
                key2: 'bonus_ques',
                value: bonus_ques,
            },
            {
                settings_of: 'game_settings',
                key: 'game',
                key2: 'c_b',
                value: c_b,
            }
        ]);
    }

    const removeQuestion = question_index => {
        let {bonus_ques, c_b} = settings;
        if (bonus_ques === undefined)
            bonus_ques = [];
        if (c_b === undefined)
            c_b = [];
        bonus_ques = bonus_ques.filter((q_, q_index) => q_index !== question_index);
        c_b = c_b.filter((q_, q_index) => q_index !== question_index);
        changeSettings([
            {
                settings_of: 'game_settings',
                key: 'game',
                key2: 'bonus_ques',
                value: bonus_ques,
            },
            {
                settings_of: 'game_settings',
                key: 'game',
                key2: 'c_b',
                value: c_b,
            }
        ]);
    }

    const changeQuestion = (question_index, attr, value) => {
        let {bonus_ques} = settings;
        bonus_ques[question_index][attr] = value;

        changeSettings( {
            settings_of: 'game_settings',
            key: 'game',
            key2: 'bonus_ques',
            value: bonus_ques,
        })
    }

    const changeCorrect = (question_index, value) => {
        let {c_b} = settings;

        c_b[question_index] = value;

        changeSettings( {
            settings_of: 'game_settings',
            key: 'game',
            key2: 'c_b',
            value: c_b,
        })
    }

    const bonus_ques = settings.bonus_ques || [];
    const correct_answers = settings.c_b || [];

    return (
        <div className='settings-ste_story'>
            <div
                className='settings-ste_story_r'
            >
                <div className='settings-ste_bonus_q'>
                    <label>Correct order:</label>
                    <div>
                        {
                            bonus_ques.map(
                                (q, q_i) => (
                                    <CorrectAnswers
                                        changeCorrect={changeCorrect}
                                        question_index={q_i}
                                        answers={q.answers}
                                        correct_answer={correct_answers[q_i]}
                                        key={q_i}
                                    />
                                )
                            )
                        }
                    </div>
                </div>

                <div className='settings-ste_story_l'>
                    <label
                        onClick={() => setExpand(!expand)}
                    >{expand? '-' : '+'}</label>

                    <button
                        className='settings-ste_btn-add_ques'
                        onClick={addQuestion}
                        style={{marginLeft: 0}}
                    >Add Question</button>
                </div>

                {
                    expand && (
                        <>
                            {
                                bonus_ques.map(
                                    (question, question_index) => (
                                        <Question
                                            removeQuestion={removeQuestion}
                                            changeQuestion={changeQuestion}
                                            key={'question-b' + question_index}
                                            question={question}
                                            question_index={question_index}
                                        />
                                    )
                                )
                            }
                        </>
                    )
                }

            </div>

            <span></span>
        </div>
    )
};

export const AppBackColors = ({settings, changeSettings}) => {

    const style = {
        display: 'grid',
        gridAutoFlow: 'column',
        alignItems: 'center',
        columnGap: 5,
        width: 'max-content',
        marginLeft: '0.5rem'
    }
    return (
        <>
            <div style={style}>
                <label>Background</label>
                <ColorPicker
                    defaultValue={settings.app_back}
                    setSetting={value => {
                        changeSettings( {
                            settings_of: 'game_settings',
                            key: 'game',
                            key2: 'app_back',
                            value,
                        })
                    }}
                />
            </div>
            {/*<div style={style}>*/}
            {/*    <label>Scratch cover</label>*/}
            {/*    <ColorPicker*/}
            {/*        defaultValue={settings.scratch_cover}*/}
            {/*        setSetting={value => {*/}
            {/*            changeSettings( {*/}
            {/*                settings_of: 'game_settings',*/}
            {/*                key: 'game',*/}
            {/*                key2: 'scratch_cover',*/}
            {/*                value,*/}
            {/*            })*/}
            {/*        }}*/}
            {/*    />*/}
            {/*</div>*/}
        </>
    )
};

const all_cond = {
    f_d_m: 'Declaration at first with magnifier',
    e_d_m: 'Declaration at end with magnifier',
    f_d_m_a: 'Declaration at first with magnifier A',
    e_d_m_a: 'Declaration at end with magnifier A',
    f_d_m_b: 'Declaration at first with magnifier B',
    e_d_m_b: 'Declaration at end with magnifier B',
    f_d: 'Declaration at first without magnifier',
    e_d: 'Declaration at end without magnifier'
};

const Cond = ({cond, checked, change_conds}) => {

    return (
        <label>
            <input
                checked={checked}
                type='checkbox'
                onChange={e => change_conds(cond, e.target.checked)}
            />
            {all_cond[cond]}
        </label>
    )
}

const ConditionsSelect = ({changeSettings, settings}) => {

    const change_conds = (cond, checked) => {
        let conds = settings.conds || [];

        if (checked){
            if (conds.indexOf(cond) === -1)
                conds.push(cond);
        }
        else {
            conds = conds.filter(cond_ => cond_ !== cond);
        }
        changeSettings({
            settings_of: 'game_settings',
            key: 'game',
            key2: 'conds',
            value: conds,
        })
    }

    return (
        <div className='settings-ste_cond'>

            <label>Conditions:</label>
            <div>
                {
                    Object.keys(all_cond).map(
                        cond => {
                            let checked = false;
                            if (Array.isArray(settings.conds))
                                checked = settings.conds.indexOf(cond) > -1;
                            return (
                                <Cond
                                    cond={cond}
                                    checked={checked}
                                    change_conds={change_conds}
                                    key={cond}
                                />
                            )
                        }
                    )
                }
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

    const NEED_MAG = game_settings.game.condition !== 'e_d';

    const game_elements = [
        {
            type: 'Select',
            label: 'Practice Story:',
            show: true,
            options: game_settings.game.stories.map((s, s_i) => (s_i+1)),
            value: game_settings.game.p_s,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'p_s',
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
            label: 'Line Time Minimum:',
            show: true,
            class_name: '',
            value: game_settings.game.l_t,
            input_type: 'number',
            step: 1,
            min: 0,
            label_after: 'mili seconds',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'l_t',
                value,
            })
        },
        {
            type: 'Select',
            label: 'With image:',
            show: true,
            options: ['Yes', 'No'],
            value: game_settings.game.w_i,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'w_i',
                value,
            })
        },
        {
            type: 'Select',
            label: 'Need Click:',
            show: NEED_MAG,
            options: ['Yes', 'No'],
            value: game_settings.game.n_c,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'n_c',
                value,
            })
        },
        {
            type: 'Select',
            label: 'Expose Full Line:',
            show: NEED_MAG,
            options: ['Yes', 'No'],
            value: game_settings.game.f_l,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'f_l',
                value,
            })
        },
        {
            type: 'Select',
            label: 'On leave story:',
            show: NEED_MAG,
            options: ['Nothing', 'Hide', 'Hide And Reset'],
            value: game_settings.game.o_l,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'o_l',
                value,
            })
        },
        {
            type: 'Select',
            label: 'On mouse up:',
            show: NEED_MAG,
            options: ['Nothing', 'Hide', 'Hide And Reset'],
            value: game_settings.game.o_m_u,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'o_m_u',
                value,
            })
        },
        {
            type: 'Select',
            label: 'Shape border:',
            show: NEED_MAG,
            options: ['Hide', 'Show'],
            value: game_settings.game.s_b,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 's_b',
                value,
            })
        },
        {
            type: 'Select',
            label: 'Cursor:',
            show: NEED_MAG,
            options: ['Hide', 'Show'],
            value: game_settings.game.cursor,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'cursor',
                value,
            })
        },
        {
            type: 'Select',
            label: 'Condition:',
            show: true,
            options: [
                {
                    value: 'r',
                    label: 'Random'
                },
                {
                    value: 'n_r',
                    label: 'Uniform distribution'
                },
            ],
            // options: [
            //     {
            //         value: 'f_d_m',
            //         label: 'Declaration at first with magnifier'
            //     },
            //     {
            //         value: 'f_d_m_a',
            //         label: 'Declaration at first with magnifier A'
            //     },
            //     {
            //         value: 'f_d_m_b',
            //         label: 'Declaration at first with magnifier B'
            //     },
            //     {
            //         value: 'f_d',
            //         label: 'Declaration at first without magnifier'
            //     },
            //     {
            //         value: 'e_d_m',
            //         label: 'Declaration at end with magnifier'
            //     },
            //     {
            //         value: 'e_d_m_a',
            //         label: 'Declaration at end with magnifier A'
            //     },
            //     {
            //         value: 'e_d_m_b',
            //         label: 'Declaration at end with magnifier B'
            //     },
            //     {
            //         value: 'e_d',
            //         label: 'Declaration at end without magnifier'
            //     },
            //     {
            //         value: 'r',
            //         label: 'Random'
            //     },
            //     {
            //         value: 'n_r',
            //         label: 'Uniform distribution'
            //     },
            // ],
            value: game_settings.game.condition,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'condition',
                value,
            })
        },
    ];

    let Magnifier_shape, MagnifierRadiusShow = false, MagnifierHeightShow = false;
    if (game_settings.game.w_i === 'Yes' && game_settings.game.f_l === 'No')
        Magnifier_shape = 'Circle';
    else if (game_settings.game.f_l === 'Yes')
        Magnifier_shape = 'Rect';
    else
        Magnifier_shape = game_settings.game.magnifier_shape;

    if (NEED_MAG && game_settings.game.f_l === 'No'){
        MagnifierRadiusShow = game_settings.game.w_i === 'Yes' ? true : (['Circle', 'Ellipse'].indexOf(game_settings.game.magnifier_shape) > -1);
    }

    if (NEED_MAG && (game_settings.game.f_l === 'Yes' || (game_settings.game.magnifier_shape === 'Rect' && game_settings.game.w_i === 'No')))
        MagnifierHeightShow = true;


    const magnifier_elements = [
        {
            type: 'Select',
            label: 'Magnifier shape:',
            show: NEED_MAG,
            disabled: game_settings.game.w_i === 'Yes' || game_settings.game.f_l === 'Yes',
            options: ['Circle', 'Rect', 'Ellipse'],
            value: Magnifier_shape,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'magnifier_shape',
                value,
            })
        },
        {
            type: 'Input',
            label: game_settings.game.w_i === 'Yes' ? 'Magnifier radius' : (game_settings.game.magnifier_shape === 'Circle' ? 'Magnifier radius:' : 'Magnifier radius X axis'),
            show: MagnifierRadiusShow,
            class_name: '',
            disabled: game_settings.game.w_i === 'Yes' || game_settings.game.f_l === 'Yes',
            value: game_settings.game.w_i === 'Yes' ? 25 : game_settings.game.magnifier_radius,
            input_type: 'number',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'magnifier_radius',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Magnifier radius Y axis:',
            show: NEED_MAG && game_settings.game.magnifier_shape === 'Ellipse' && game_settings.game.w_i === 'No' && game_settings.game.f_l === 'No' ,
            class_name: '',
            disabled: game_settings.game.f_l === 'Yes',
            value: game_settings.game.magnifier_radius_y,
            input_type: 'number',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'magnifier_radius_y',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Magnifier height:',
            show: MagnifierHeightShow,
            class_name: '',
            disabled: game_settings.game.f_l === 'Yes',
            value: game_settings.game.f_l === 'Yes' ? 'Full Line' : game_settings.game.magnifier_height,
            input_type: 'number',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'magnifier_height',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Magnifier width:',
            disabled: game_settings.game.f_l === 'Yes',
            show: MagnifierHeightShow,
            class_name: '',
            value: game_settings.game.f_l === 'Yes' ? 'Full Line' : game_settings.game.magnifier_width,
            input_type: 'number',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'magnifier_width',
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
                <AppBackColors
                    changeSettings={changeSettings}
                    settings={game_settings.game}
                />

                <DivContainer
                    className='admin-settings-section-raw admin-settings-section-b'
                    elements={game_elements}
                />

                <ConditionsSelect
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
                <DivContainer
                    className='admin-settings-section-col admin-settings-section-h'
                    elements={[{
                        type: 'Label',
                        label: 'Bonus questions:',
                        show: true
                    }]}
                />

                <BonusQuestions
                    settings={game_settings.game}
                    changeSettings={changeSettings}
                />
            </DivContainer>

            <DivContainer
                className='admin-settings-section admin-settings-section-raw'
            >
                <DivContainer
                    className='admin-settings-section-col admin-settings-section-h'
                    elements={[{
                        type: 'Label',
                        label: 'Stories:',
                        show: true
                    }]}
                />

                <Stories
                    settings={game_settings.game}
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

