import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {DivContainer} from "../../screens/settings/elements_builder";
import {convertPointsRatio} from "../../screens/settings/settings";
import {AppBackColors} from "../signature_timing_effect/Settings";
import './adeStyles.css';
import {checkDigit} from "../../../utils/app_utils";

const Answer = ({me_correct, removeAnswer, changeAnswer, answer, answer_index}) => {
    return (
        <div className={'settings-ade_add_answer ' + (me_correct ? 'settings-ade_add_answer_co' : '')}>
            <label>{answer_index+1}</label>
            <input
                value={answer}
                placeholder={`insert answer #${answer_index+1}`}
                onChange={e => changeAnswer(answer_index, e.target.value)}
            >
            </input>
            <button
                className='btn-delete'
                onClick={() => removeAnswer(answer_index)}
            >Delete</button>
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
    };


    const changeAnswer = (answer_index, value) => {
        let {answers} = question;
        answers[answer_index] = value;
        changeQuestion(question_index, 'answers', answers);
    };

    const changeCorrect = (value) => {
        changeQuestion(question_index, 'co', value);
    };

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

            <div
                className='settings-ade_ques_co'
            >
                <label>Correct answers: </label>
                <select
                    value={question.co || 'Choose'}
                    onChange={e => changeCorrect(e.target.value)}
                >
                    <option value='Choose' disabled={true}>Choose</option>
                    {
                        question.answers.map(
                            (answer, answer_index) => (
                                <option key={answer_index} value={answer_index}>{answer_index + 1}</option>
                            )
                        )
                    }
                </select>
            </div>

            <button className='settings-ste_btn-add_ans' onClick={addAnswer}>Add answer</button>
            {
                question.answers.map(
                    (answer, answer_index) => (
                        <Answer
                            me_correct={question.co === answer_index.toString()}
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

const Story = ({story, me_practice, changeStoryAttr, removeStory, story_index}) => {

    const [expand, setExpand] = useState(true);

    const addQuestion = () => {
        const {questions} = story;
        questions.push({
            que: '',
            answers: [],
            co: null
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
        <div className={'settings-ste_story ' + (me_practice ? 'settings-ade_story-p' : '')}>
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
                        className='settings-ade_story_r'
                    >
                        <label>Abstract text:</label>
                        <textarea
                            className='a'
                            value={story.abstract_txt}
                            onChange={e => changeStoryAttr(story_index, 'abstract_txt', e.target.value)}
                        />
                        <label>Story text:</label>
                        <textarea
                            className='b'
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
                                me_practice={(settings.p_s-1) === story_index}
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

const DecText = ({prop, settings, changeSettings}) => {
    const onChange = text => {
        changeSettings( {
            settings_of: 'game_settings',
            key: 'game',
            key2: prop,
            value: text,
        });
    }

    if (!prop.includes(settings.cond) && ['u_d', 'r'].indexOf(settings.cond) === -1)
        return <></>;

    let text;
    if (prop === 'e_d_t')
        text = 'Each set declaration text';
    else if (prop === 'c_d_t')
        text = 'Custom declaration text';
    if (prop === 'e_d_t_i')
        text = 'Each set declaration checkbox text';
    else if (prop === 'c_d_t_i')
        text = 'Custom declaration checkbox text';


    return (
        <div className='settings-ade_dec'>
            <label>{text}: </label>
            <input value={settings[prop]} onChange={e => onChange(e.target.value)}/>
        </div>
    )
};

const MiliToClock = (mili) => {
    mili=mili/1000;
    let seconds = Math.round(mili % 60);
    mili = Math.floor(mili / 60);
    let minutes = Math.round(mili % 60);
    mili = Math.floor(mili / 60);
    let hours = Math.round(mili % 24);
    mili = Math.floor(mili / 24);

    return `${checkDigit(hours)}:${checkDigit(minutes)}:${checkDigit(seconds)}`;

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
            label: 'Practice Story:',
            show: true,
            options: ['None', ...game_settings.game.stories.map((s, s_i) => (s_i+1))],
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
            type: 'Select',
            label: 'Random story:',
            show: true,
            options: ['Yes', 'No'],
            value: game_settings.game.r_s,
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'r_s',
                value,
            })
        },
        {
            type: 'Select',
            label: 'Condition:',
            show: true,
            options: [
                {
                    value: 'n_d',
                    label: 'No declaration'
                },
                {
                    value: 'e_d',
                    label: 'Each set declaration'
                },
                {
                    value: 'c_d',
                    label: 'Custom declaration'
                },
                {
                    value: 'r',
                    label: 'Random'
                },
                {
                    value: 'u_d',
                    label: 'Uniform distribution'
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
            label: 'Read time:',
            show: game_settings.game.cond === 'c_d' || ['u_d', 'r'].indexOf(game_settings.game.cond) > -1,
            class_name: '',
            value: game_settings.game.r_t,
            input_type: 'number',
            min: 0,
            label_after: '(mili seconds) = ' + MiliToClock(game_settings.game.r_t),
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'r_t',
                value,
            })
        },
        {
            type: 'Input',
            label: 'Min mistakes:',
            show: game_settings.game.cond === 'c_d' || ['u_d', 'r'].indexOf(game_settings.game.cond) > -1,
            class_name: '',
            value: game_settings.game.m_m,
            input_type: 'number',
            min: 0,
            max: 100,
            label_after: 'percent (0-100)',
            callback: value => changeSettings({
                settings_of: 'game_settings',
                key: 'game',
                key2: 'm_m',
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

                <DecText
                    prop='e_d_t'
                    changeSettings={changeSettings}
                    settings={game_settings.game}
                />

                <DecText
                    prop='e_d_t_i'
                    changeSettings={changeSettings}
                    settings={game_settings.game}
                />

                <DecText
                    prop='c_d_t'
                    changeSettings={changeSettings}
                    settings={game_settings.game}
                />

                <DecText
                    prop='c_d_t_i'
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

