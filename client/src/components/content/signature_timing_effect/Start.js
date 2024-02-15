import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import './gameStyles.css';
import './message.css';
import PropTypes from "prop-types";
import {NewLogs} from "../../../actions/logger";
import {getTimeDate} from "../../../utils/app_utils";
import WaitForAction2 from "../../screens/waitForAction/wait_for_action2";

import {DebuggerModalView, KeyTableID} from "../../screens/gameHandle/game_handle";

const ThisExperiment = 'SignatureTimingEffect';

let UserId = null;
let RunningName = '-';
let PaymentsSettings = null;
let StartTime = null;
let StoryTimeBegin = null;

let NumberOfStories = null;
let GameSet = {};

let LAST_X = 10;

let CURRENT_LINE = null;
let POSITION_LINE = null;

let STORY_MAX_LINES;

let GameRec = {}, PracticeRec = [];
let GameQues = {}, PracticeQues = [], BonusQues = [];

const ResetAll = () => {
    UserId = 'empty';
    RunningName = '-';
    StartTime = null;
    PaymentsSettings = null;
    GameSet = {};
    CURRENT_LINE = null;
    POSITION_LINE = null;
    GameRec = {};
    GameQues = {};
    StoryTimeBegin = null;
    PracticeRec = [];
    PracticeQues = [];
};

const ResetNewGame = () => {
    CURRENT_LINE = null;
    POSITION_LINE = null;
    GameRec = {};
    StoryTimeBegin = null;
    GameQues = {};
    PracticeRec = [];
    PracticeQues = [];
    BonusQues = [];
};

const Shape = (props) => {

    let {point_item, stroke, story_width, line_height} = props;

    let more_props = {};
    if (stroke){
        more_props.stroke = 'black';
        more_props.strokeWidth = '1';
        more_props.fill="transparent";
    }

    if (GameSet.expose_full_line === 'Yes')
        return (
            <rect
                width={(story_width||-20)+20}
                height={line_height}
                // height={story_line_height}
                // width={story_width}
                className='STE_polygon'
                x={point_item.x}
                y={point_item.y}
            />
        );
    else if (GameSet.game_condition.includes('m_a'))
        if (GameSet.with_image === 'Yes')
            return (
                <circle
                    r={GameSet.magnifier_radius}
                    className='STE_polygon'
                    cx={point_item.x}
                    cy={point_item.y}
                />
            );
        else
            return (
                <rect
                    width={GameSet.magnifier_width}
                    height={line_height}
                    // height={story_line_height}
                    // width={story_width}
                    className='STE_polygon'
                    x={point_item.x}
                    y={point_item.y}
                    {...more_props}
                />
            );

    else if (GameSet.magnifier_shape === 'Rect')
        return (
            <rect
                width={GameSet.magnifier_width}
                height={GameSet.magnifier_height}
                className='STE_polygon'
                x={point_item.x}
                y={point_item.y}
                {...more_props}
            />
        );
    else if (GameSet.magnifier_shape === 'Circle')
        return (
            <circle
                r={GameSet.magnifier_radius}
                className='STE_polygon'
                cx={point_item.x}
                cy={point_item.y}
                {...more_props}
            />
        );
    else if (GameSet.magnifier_shape === 'Ellipse')
        return (
            <ellipse
                rx={GameSet.magnifier_radius}
                ry={GameSet.magnifier_radius_y}
                className='STE_polygon'
                cx={point_item.x}
                cy={point_item.y}
                {...more_props}
            />
        );
}

function updateRow(story_key, new_date, position_line, part){

    let CurrentPart = part === 'Practice' ? PracticeRec : GameRec[story_key];

    const prev_index = CurrentPart.length - 2;
    // const prev_index = part === 'Practice' ? PracticeRec : (CurrentPart.length - 2);

    CurrentPart[prev_index].line_time = new_date - CurrentPart[prev_index].time;

    if (position_line < STORY_MAX_LINES && CurrentPart[prev_index].line_time < GameSet.minimum_line_time){
        CurrentPart = CurrentPart.filter((val, index) => index !== prev_index);
    }

    let total_line_time = 0, total_expose_line_time = 0, cumulative_text_time = 0,
        cumulative_text_expose_time = 0, cumulative_empty_time = 0;

    for (let i=1; i<CurrentPart.length; i++){
        const elapsed = CurrentPart[i].time - CurrentPart[i-1].time;

        if (CurrentPart[i-1].position_line === position_line){
            total_line_time += elapsed;
            if (CurrentPart[i-1].line_exposed){
                total_expose_line_time += elapsed;
            }
        }
        if (CurrentPart[i-1].line_exposed)
            cumulative_text_expose_time += elapsed;

        if (CurrentPart[i-1].position_line !== 'empty')
            cumulative_text_time += elapsed;

        if (CurrentPart[i-1].position_line === 'empty')
            cumulative_empty_time += elapsed;
    }

    CurrentPart[prev_index].total_line_time = total_line_time;
    CurrentPart[prev_index].total_expose_line_time = total_expose_line_time;
    CurrentPart[prev_index].cumulative_text_time = cumulative_text_time;
    CurrentPart[prev_index].cumulative_text_expose_time = cumulative_text_expose_time;
    CurrentPart[prev_index].cumulative_empty_time = cumulative_empty_time;
}

function insertLine(current_line, position_line, expose_text, total_lines, part) {
    const story_number = NumberOfStories - GameSet.stories.length;
    const story_key = 'story_' + story_number;

    const CurrentPart = part === 'Practice' ? PracticeRec : GameRec[story_key];

    if (CurrentPart.length>1 && CurrentPart[CurrentPart.length-1].position_line === position_line) return;

    const new_date = Date.now();

    const instance_num = CurrentPart.reduce(
        (total, story_rec) => total + story_rec.position_line === position_line ? 1 : 0, 1
    );

    const instance_expose_num = CurrentPart.reduce(
        (total, story_rec) => total + (story_rec.position_line === position_line && story_rec.line_exposed) ? 1 : 0,
        expose_text?1:0
    );

    const total_expose_lines = CurrentPart.reduce(
        (total, story_rec) => total + story_rec.line_exposed ? 1 : 0,
        expose_text?1:0
    );

    let db_line = {
        story: part === 'Practice' ? '0' : (story_number+1),
        position_line: position_line,
        next_line: current_line,
        line_exposed: expose_text.toString(),
        instance_num,
        instance_expose_num,
        total_expose_lines,
        time: new_date,
        line_time: '', //
        total_expose_line_time: '',
        total_line_time: '',
        cumulative_text_time: '',
        cumulative_text_expose_time: '',
        cumulative_empty_time: '',
        time_from_start: new_date - StartTime,
        time_story_begin: new_date - StoryTimeBegin,
        total_lines
    }

    CurrentPart.push(db_line);

    if (CurrentPart.length > 1)
        updateRow(story_key, new_date, position_line, part);

}

function insertEmptyLine(total_lines, part) {

    const story_number = NumberOfStories - GameSet.stories.length;
    const story_key = 'story_' + story_number;

    const CurrentPart = part === 'Practice' ? PracticeRec : GameRec[story_key];

    if (CurrentPart.length>1 && CurrentPart[CurrentPart.length-1].position_line === 'empty') return;

    const new_date = Date.now();

    const instance_num = CurrentPart.reduce(
        (total, story_rec) => story_rec.position_line === 'empty' ? total+1 : total, 1
    );

    let db_line = {
        story: part === 'Practice' ? '0' : (story_number+1),
        // part,
        position_line: 'empty',
        next_line: CURRENT_LINE,
        line_exposed: false,
        instance_num,
        instance_expose_num: '',
        total_expose_lines: '',
        line_time: '',
        time: new_date,
        cumulative_line_time: '',
        cumulative_text_time: '',
        cumulative_empty_time: '',
        time_from_start: new_date - StartTime,
        time_story_begin: new_date - StoryTimeBegin,
        total_lines
    }

    CurrentPart.push(db_line);

    if (CurrentPart.length > 1)
        updateRow(story_key, new_date, 'empty', part);
}

const DebuggerGameItem = ({item}) => {

    return (
        <div className='STE-DebugGroupItem R_M-SummaryDebug'>
            <label>story: <span>{item.story}</span></label>
            <label>next_line: <span>{item.next_line}</span></label>
            <label>position_line: <span>{item.position_line}</span></label>
            <label>line_exposed: <span>{item.line_exposed.toString()}</span></label>
            <label>instance_num: <span>{item.instance_num}</span></label>
            <label>instance_expose_num: <span>{item.instance_expose_num}</span></label>
            <label>line_time: <span>{item.line_time}</span></label>
            <label>total_expose_line_time: <span>{item.total_expose_line_time}</span></label>
            <label>total_line_time: <span>{item.total_line_time}</span></label>
            <label>total_lines: <span>{item.total_lines}</span></label>
            <label>time: <span>{item.time}</span></label>
            <label>total_expose_lines: <span>{item.total_expose_lines}</span></label>
            <label>cumulative_empty_time: <span>{item.cumulative_empty_time}</span></label>
            <label>cumulative_text_time: <span>{item.cumulative_text_time}</span></label>
            <label>cumulative_text_expose_time: <span>{item.cumulative_text_expose_time}</span></label>
            <label>time_story_begin: <span>{item.time_story_begin}</span></label>
            <label>time_from_start: <span>{item.time_from_start}</span></label>
        </div>
    )
}

class Story extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            points_arr: [],
            polygon_points: null,
            mouse_down: false,
            cursor: false,
            expose_text: true,
            FONTS_SIZE: null,
            story_line_height: ''
        };

        this.canvasRef = React.createRef();
        this.storyRef = React.createRef();
        this.textRef = React.createRef();

        this.NextBtn = this.NextBtn.bind(this);
        this.withMagnifier = this.withMagnifier.bind(this);
        this.withoutMagnifier = this.withoutMagnifier.bind(this);

        this.story_line_height = 0;
        this.story_width = 0;
        this.story_lines = [];
        this.first_load = true;
        window.addEventListener('resize', this.initCanvas);
    }

    setPoints = (new_points) => {
        let current_line = this.getCurrentLine();

        // let position_line = Math.floor(new_points.y/this.story_line_height);
        let position_line = Math.round(new_points.y/this.story_line_height);

        const scrollHeight = this.textRef.current.scrollHeight;

        let expose_text = true;
        if (!position_line || ((position_line > this.story_lines.length) && ((new_points.y - 5) > scrollHeight)) ) {
            CURRENT_LINE = current_line;
            POSITION_LINE = 'empty';
            insertEmptyLine(this.story_lines.length, this.props.part);
            return;
        }

        if (GameSet.game_condition.includes('m_a')){
            if (current_line < position_line) {
                expose_text = false;
            }

            if (GameSet.expose_full_line === 'No') {
                let width_;
                if (GameSet.with_image === 'Yes'){
                    width_ = GameSet.magnifier_radius;
                }
                else
                    width_ = (GameSet.magnifier_width / 2);
                if (current_line === position_line && LAST_X < (new_points.x-width_))
                    expose_text = false;
            }
        }

        let sc = this.state;

        if (GameSet.expose_full_line === 'Yes'){

            let line_start = this.story_line_height * (position_line-1) + 10;

            sc.polygon_points = {
                x: -5,
                y: line_start,
            }
        }
        else if (GameSet.with_image === 'Yes'){
            let width_, line_start;
            width_ = GameSet.magnifier_radius;
            line_start = new_points.y-width_;

            sc.polygon_points = {
                x: new_points.x-width_,
                y: line_start
            }
        }
        else if (GameSet.game_condition.includes('m_a')){
            let width_, line_start;
            if (GameSet.with_image === 'Yes'){
                width_ = GameSet.magnifier_radius;
                // line_start = this.story_line_height * (position_line-1) + 10;
                line_start = new_points.y-width_;
            }
            else {
                width_ = (GameSet.magnifier_width / 2);
                line_start = this.story_line_height * (position_line-1) + 10;
            }

            sc.polygon_points = {
                x: new_points.x-width_,
                y: line_start
            }
        }
        else if (GameSet.magnifier_shape === 'Rect') {
            sc.polygon_points = {
                x: new_points.x-(GameSet.magnifier_width/2),
                y: new_points.y-(GameSet.magnifier_height/2)
            }
        }
        else {
            sc.polygon_points = {
                x: new_points.x,
                y: new_points.y
            }
        }

        CURRENT_LINE = current_line;
        POSITION_LINE = position_line;

        if (expose_text && !GameSet.game_condition.includes('m_b')) {
            sc.points_arr.push(sc.polygon_points);
        }
        else if (expose_text && GameSet.game_condition.includes('m_b')) {
            sc.points_arr = [];
            sc.points_arr.push(sc.polygon_points);
        }

        if (GameSet.expose_full_line === 'Yes'){
            if (current_line === position_line) {
                this.story_lines[position_line-1] = true;
            }
        }
        else if (GameSet.game_condition.includes('m_a')){

            let width_;
            if (GameSet.with_image === 'Yes'){
                width_ = GameSet.magnifier_radius;
            }
            else
                width_ = (GameSet.magnifier_width / 2);

            if (LAST_X >= (this.story_width-5) && current_line === position_line) {
                this.story_lines[position_line-1] = true;
                LAST_X = 10;
            }
            else if (expose_text && current_line === position_line) {
                const curr = new_points.x + width_;
                if (LAST_X < curr) LAST_X = curr;
            }

        }

        sc.expose_text = expose_text;


        ///// Work For Full Line Need To Change It
        insertLine(current_line, position_line, expose_text, this.story_lines.length, this.props.part);
        ///// Work For Full Line Need To Change It


        this.setState(sc);
    }

    getCurrentLine = () => {
        for (let i=0;i<this.story_lines.length; i++){
            if (!this.story_lines[i]){
                return i+1;
            }
        }
    }

    mouseMove = (e) => {
        if (GameSet.need_click === 'Yes' && !this.state.mouse_down) return;

        let pt = this.canvasRef.current.createSVGPoint();

        pt.x=e.clientX;
        pt.y=e.clientY;

        let loc=pt.matrixTransform(this.canvasRef.current.getScreenCTM().inverse());

        this.setPoints({
            x: loc.x,
            y: loc.y,
        });
    };

    mouseLeave = () => {
        let sc = this.state;
        sc.polygon_points = null;
        POSITION_LINE = 'empty';
        insertEmptyLine(this.story_lines.length, this.props.part);
        // insertEmptyLine();
        if (['Hide', 'Hide And Reset'].indexOf(GameSet.on_leave) > -1){
            sc.points_arr = [];
            if (GameSet.on_leave === 'Hide And Reset') {
                for (let i = 0; i < this.story_lines.length; i++)
                    this.story_lines[i] = false;
                LAST_X = -10;
            }
        }
        this.setState(sc);
    };

    resetStory = () => {
        let el = ReactDOM.findDOMNode(this.textRef.current);
        const computed = window.getComputedStyle(el);

        let lineHeight = computed.getPropertyValue("line-height").replace('px', '');
        const lines_number = Math.floor(this.scrollHeight / (lineHeight));

        this.story_line_height = Number(lineHeight);
        this.story_width = this.textRef.current.scrollWidth;
        this.story_lines = (new Array(lines_number)).fill(false);
        STORY_MAX_LINES = lines_number;
        if (this.first_load) {
            this.first_load = false;
            StoryTimeBegin = Date.now();
        }
    }

    initCanvas = () => {
        let sc = this.state;
        sc.FONTS_SIZE = null;
        this.setState(sc, () => {
            sc = this.state;
            let height, clientHeight, scrollHeight;

            try{
                this.textRef.current.style.fontSize = '50px';

                do {
                    scrollHeight = this.textRef.current.scrollHeight;
                    height = this.textRef.current.getBoundingClientRect().height;
                    clientHeight = this.textRef.current.clientHeight;

                    if (scrollHeight>Math.min(height, clientHeight)) {
                        let current_font_size = Number(this.textRef.current.style.fontSize.replace('px', ''));
                        this.textRef.current.style.fontSize = (current_font_size - 0.1) + 'px';
                    }
                }
                while (scrollHeight>Math.min(height, clientHeight));

                sc.FONTS_SIZE = this.textRef.current.style.fontSize;
                this.scrollHeight = scrollHeight;
                this.setState(sc, () => this.resetStory());

            }
            catch (e) {
            }
        })
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.initCanvas);    }

    componentDidMount(){
        this.initCanvas();
    };

    changeMouseState = (mouse_down) => {
        let sc = this.state;
        sc.mouse_down = mouse_down;
        if (!mouse_down && ['Hide', 'Hide And Reset'].indexOf(GameSet.on_mouse_up) > -1){
            sc.points_arr = [];
            if (GameSet.on_mouse_up === 'Hide And Reset'){
                for (let i = 0; i < this.story_lines.length; i++)
                    this.story_lines[i] = false;
                LAST_X = -10;
            }
        }
        this.setState(sc);
    }

    TextParagraph = () => {
        return (
            <p
                className='STE_story2'
                ref={this.textRef}
                style={{
                    fontSize: this.state.FONTS_SIZE
                }}
            >
                {this.props.next_story.story_txt}
            </p>
        )
    }

    withMagnifier() {
        if (this.state.FONTS_SIZE === null)
            return (
                <p
                    className='STE_storyTxt'
                    ref={this.textRef}
                >
                    {this.props.next_story.story_txt}
                </p>
            )

        return (
            <>
                <div
                    className='STE_storyTxt'
                    onMouseMove={e => this.mouseMove(e)}
                    onMouseLeave={this.mouseLeave}
                    onMouseDown={GameSet.need_click === 'Yes'? () => this.changeMouseState(true) : undefined }
                    onMouseUp={GameSet.need_click === 'Yes'? () => this.changeMouseState(false) : undefined }
                    style={{
                        fontSize: this.state.FONTS_SIZE,
                    }}
                >
                    {this.TextParagraph()}
                </div>

                <div
                    id="ste_box"
                >
                    <svg
                        ref={this.canvasRef}
                        height="100%"
                        width="100%"
                        // viewBox="0 0 100 100"
                        // preserveAspectRatio="none"
                        id="innerbox"
                    >
                        <defs>
                            <mask
                                id="hole"
                            >
                                <rect width="100%" height="100%" fill="white"/>
                                {
                                    this.state.points_arr.map(
                                        (point_item,point_item_index) => (
                                            <Shape
                                                story_width={this.story_width}
                                                line_height={this.story_line_height}
                                                point_item={point_item}
                                                key={point_item_index}
                                                stroke={false}
                                            />
                                        )
                                    )
                                }
                            </mask>
                        </defs>
                        <rect
                            fill="white" width="100%" height="100%" mask="url(#hole)"
                        />
                        {
                            GameSet.expose_full_line === 'No' && GameSet.shape_border === 'Show' && GameSet.with_image === 'No' && this.state.expose_text && this.state.polygon_points && (
                                <Shape
                                    stroke={true}
                                    point_item={this.state.polygon_points}
                                />
                            )
                        }
                    </svg>
                </div>

                <div
                    className='STE_storyCover'
                >
                    {this.TextParagraph()}
                </div>
            </>
        )
    }

    withoutMagnifier() {
        return (
            <p
                className='STE_storyTxt'
                ref={this.textRef}
            >
                {this.props.next_story.story_txt}
            </p>
        )
    }

    NextBtn() {
        this.props.Forward();
    }

    debuggerContent = () => {
        const story_number = NumberOfStories - GameSet.stories.length;
        const story_key = 'story_' + story_number;

        const CurrentPart = this.props.part === 'Practice' ? PracticeRec : GameRec[story_key];

        return (
            <>
                <div className='R_M-SummaryDebug'>
                    <label>TotalLines:<span>{this.story_lines.length}</span></label>
                    <label>NextLineToExpose:<span>{CURRENT_LINE}</span></label>
                    <label>PositionLine:<span>{POSITION_LINE}</span></label>
                </div>

                <div className='STE-DebugGroup'>
                    {
                        CurrentPart.map(
                            story_item => (
                                <DebuggerGameItem
                                    item={story_item}
                                    key={story_item.position_line + story_item.instance_num + story_item.time}
                                />
                            )
                        )
                    }
                </div>
            </>
        )
    }

    render() {
        const styles = {};
        if (GameSet.with_image === 'No' && GameSet.game_condition.includes('_m') && GameSet.cursor === 'Hide')
            styles.cursor = 'none';

        return (
            <div
                className='STE_board'
            >
                <label>
                    {
                        this.props.part === 'Practice' ? (
                            <span>Practice - story</span>
                        ) : (
                            <span>Story {NumberOfStories - GameSet.stories.length + 1} out of {NumberOfStories}</span>
                        )
                    }
                    {
                        GameSet.game_condition.includes('_m') && (
                            <span>To read the story, please use your mouse to reveal the text line by line</span>
                        )
                    }
                </label>

                <div
                    className={'STE_storyCont ' + (GameSet.with_image === 'Yes' ? 'STE_WithImg' : '')}
                    styles={styles}
                >
                    {
                        GameSet.game_condition.includes('_m') ? this.withMagnifier() : this.withoutMagnifier()
                    }
                </div>
                <DebuggerModalView>
                    {this.debuggerContent()}
                </DebuggerModalView>
                <button className='STE_next_btn' onClick={this.NextBtn}>Next</button>
            </div>
        )
    }
}

const GameWelcome = ({Forward}) => {

    return (
        <div
            className='STE_GW'
        >
            <label>Welcome to the <b>"Subjective story"</b> study.</label>
            <p>
                In this study, you will be asked to read a total of {NumberOfStories+1} short stories and then answer questions concerning these stories.
                It will take about 15 minutes to complete the task. Please read each of the stories before answering the questions.
                Each story can be read once. After pressing the "Next" key it will not be possible to go back and read the story once again.
                All questions must be answered, without answering the questions it will not be possible to proceed to the next story.
                At the beginning of the study, there will be a practice story with questions, you can read it and answer the questions as
                many times as you want. When you want to finish practicing, please press "Go to story 1".
                The basic payment for participation is {PaymentsSettings.sign_of_reward}{PaymentsSettings.show_up_fee}. To get the Prolific completion code, as well as your basic payment and bonus,
                you will have to complete the task in good faith and without breaks. This task cannot be taken from a mobile device.
                If one of the stories makes you uncomfortable you may leave the study at any time. You will receive your completion code once you
                have completed all the stories and questions. If everything is clear, please press "Next"
            </p>
            <label>If everything is clear, please press "Next"</label>
            <button onClick={Forward} className='STE_next_btn'>Next</button>
        </div>
    )
}

// const GameWelcome1 = ({Forward}) => {
//
//     return (
//         <div
//             className='STE_GW'
//         >
//             <label>Welcome to the <b>"Subjective story"</b> study.</label>
//             <p>
//                 In this study, you will be asked to read {NumberOfStories} short stories and then answer questions concerning these stories.
//                 It will take about 12 minutes to complete the task. Please read each of the stories before answering the questions.
//                 Each story can be read once. After pressing the "Next" key it will not be possible to go back and read the story once again.
//                 All questions must be answered, without answering the questions it will not be possible to proceed to the next story.
//                 At the beginning of the experiment, there will be a practice story, you can perform it as many times as you need.
//                 Please click "Go to story 1" when you are ready in the practice. The basic payment for participation is {PaymentsSettings.sign_of_reward}{PaymentsSettings.show_up_fee}.
//                 To get the Prolific completion code, as well as your base payment and bonus,
//                 you will have to complete the task in good faith and without breaks.
//                 This task cannot be taken from a mobile device.
//                 If one of the stories makes you uncomfortable you may leave the experiment at any time.
//                 You will receive your completion code once you have completed all of the stories and questions.
//                 Please complete this study in a sequence, without taking breaks during your participation.
//                 {/*In this study, you will be asked to read {NumberOfStories} short stories and then answer questions concerning these stories. Please read each of the stories carefully before answering the questions.*/}
//                 {/*The basic payment for completing the study is {PaymentsSettings.sign_of_reward}{PaymentsSettings.show_up_fee}, and following the instructions in good faith will make you eligible for an additional bonus of {PaymentsSettings.sign_of_reward}{PaymentsSettings.bonus_endowment}.*/}
//                 {/*Each story can be read once. After pressing the "Next" key it will not be possible to go back.*/}
//                 {/*All questions must be answered, without answering the questions it will not be possible to proceed to the next story.*/}
//             </p>
//             <label>If everything is clear, please press "Next"</label>
//             <button onClick={Forward} className='STE_next_btn'>Next</button>
//         </div>
//     )
// }

// const GameWelcome2 = ({Forward}) => {
//
//     return (
//         <div
//             className='STE_GW'
//         >
//             <label>Welcome to the <b>"Subjective story"</b> study.</label>
//             <p>
//                 In this study, you will be asked to read {NumberOfStories} short stories and then answer questions
//                 concerning these stories. Please read each of the stories carefully before answering
//                 the questions. The basic payment for completing the study in good faith is {PaymentsSettings.sign_of_reward}{PaymentsSettings.show_up_fee}, and there are chances to win a bonus of {PaymentsSettings.sign_of_reward}{PaymentsSettings.bonus_endowment}.
//                 Each story can be read once. After pressing the "Next" key it will not be possible to
//                 go back.
//                 All questions must be answered, without answering the questions it will not be
//                 possible to proceed to the next story.
//             </p>
//             <label>If everything is clear, please press "Next"</label>
//             <button onClick={Forward} className='STE_next_btn'>Next</button>
//         </div>
//     )
// }

const AfterPractice = ({Forward}) => {

    let label, back_btn;
    if (GameSet.game_condition.includes('f_d')) {
        label = <><span>If everything is clear, please press "Next",</span><span> if you want to practice again, please press "Do practice again".</span></>;
        back_btn = 'Do practice again';
    }
    else {
        label = <><span>If everything is clear, please press "Next",</span><span> if you want to practice again, please press "Try again".</span></>;
        back_btn = 'Try again';
    }

    return (
        <div
            className='STE_AP STE_Prompt'
        >
            <label>{label}</label>
            <div>
                <button onClick={() => Forward('Back')} className='STE_next_btn'>{back_btn}</button>
                <button onClick={Forward} className='STE_next_btn'>Next</button>
            </div>
        </div>
    )
}

const BeforeLastQues = ({Forward}) => {
    return (
        <div className='STE_BLQ STE_Prompt'>
            <p>
                Congratulations,<br/>You finish the main part of the study.
                <br/><br/>
                Before getting the completion code, please answer a few more questions. The purpose of this section is to understand the relationship between emotions and memory. For every correct answer, you will receive a {PaymentsSettings.sign_of_reward}{PaymentsSettings.bonus_endowment} bonus
                <br/>
                Important! Your basic payment for completing the study will be paid regardless of your answers.
            </p>
            <button
                className='STE_next_btn'
                onClick={Forward}
            >Go to the questions
            </button>
        </div>
    )
}

const Declaration = ({Forward}) => {
    const [checked, setChecked] = useState(false);

    const dec_at_end = GameSet.game_condition.includes('e_d');

    return (
        <div className='STE_Dec STE_Prompt' >
        {/*<div className={'STE_Dec ' + (dec_at_end? '' : 'STE_Prompt')}>*/}
            <label>Declaration</label>
            {
                dec_at_end? (
                    <label>Please declare that you understood the instructions and read the stories.</label>
                ) : (
                    <label>Please declare that you understood the instructions and will read the stories.</label>
                )
            }

            <label>
                <input
                    checked={checked}
                    type='checkbox'
                    onChange={e => setChecked(e.target.checked) }
                />
                {
                    dec_at_end? (
                        <>I have read each of the stories carefully and understand that a failure to do so will revoke my eligibility to receive the bonus.</>
                    ) : (
                        <>I will read each of the stories carefully and understand that a failure to do so will revoke my eligibility to receive the bonus.</>
                    )
                }
            </label>

            <button
                className={'STE_next_btn ' + (checked? '': 'disabledElem')}
                onClick={Forward}
            >{dec_at_end? 'Finish' : 'Go to story 1'}
            </button>
        </div>
    )
}

// const Declaration2 = ({Forward, set_check, checked_2 = false}) => {
//     const [checked, setChecked] = useState(checked_2);
//     useEffect(() => {
//         setChecked(checked_2);
//     }, [checked_2]);
//     const dec_at_end = GameSet.game_condition.includes('e_d');
//
//     return (
//         <div className={'STE_Dec ' + (dec_at_end? '' : 'STE_Prompt')}>
//             <label>Declaration</label>
//             {
//                 dec_at_end? (
//                     <label>Please declare that you understood the instructions and read the stories.</label>
//                 ) : (
//                     <label>Please declare that you understood the instructions and will read the stories.</label>
//                 )
//             }
//
//             <label>
//                 <input
//                     checked={checked}
//                     type='checkbox'
//                     onChange={e => dec_at_end? set_check(e.target.checked) : setChecked(e.target.checked)}
//                 />
//                 {
//                     dec_at_end? (
//                         <>I have read each of the stories carefully and understand that a failure to do so
//                             might revoke my eligibility to receive the basic payment and will for sure eliminate
//                             my chances to win the bonus.</>
//                     ) : (
//                         <>I will read each of the stories carefully and understand that a failure to do so might
//                             revoke my eligibility to receive the basic payment and will for sure eliminate my
//                             chances to win the bonus.</>
//                     )
//                 }
//             </label>
//
//             {!dec_at_end && <button className={'STE_next_btn ' + (checked? '': 'disabledElem')} onClick={Forward}>Go to story 1</button>}
//         </div>
//     )
// }

const FinishGame = ({Forward}) => {
    return (
        <div className={'STE_FM STE_Prompt '}>
            <label>Congratulation, you almost finished the study</label>

            <div>
                <button className='STE_next_btn' onClick={Forward}>Continue</button>
                <label>
                    Press this key to save your answers and get your completion code
                </label>
            </div>
        </div>
    )
}

// const FinishGame1 = ({Forward}) => {
//     const [checked, setChecked] = useState(false);
//     const [newGameMsg, setNewGameMsg] = useState(false);
//     const [newDecMsg, setNewDecMsg] = useState(false);
//     const dec_at_end = GameSet.game_condition.includes('e_d');
//
//     const setCheck = check => {
//         setChecked(check);
//     }
//
//     const btnClick = (option) => {
//         if (option === 'Back')
//             setNewGameMsg(true);
//         else if (option === 'Continue'){
//             if (dec_at_end && !checked)
//                 setNewDecMsg(true);
//             else
//                 Forward();
//         }
//     }
//
//     return (
//         <div className={'STE_FM STE_Prompt '}>
//             <label>Congratulation, you almost finished the study</label>
//
//             {dec_at_end && (
//                 <Declaration
//                     set_check={setCheck}
//                     checked_2={checked}
//                 />
//             )}
//
//             <div className='STE_FM_m'>
//                 <div>
//                     <button className='STE_next_btn' onClick={() => btnClick('Back')}>Back</button>
//                     <label>
//                         Please press this key if you think you made mistakes and you want to change your answers. Notice that if you press this key <b>all</b> your previous answers will be erased, and you will be asked to repeat the study <b>from the beginning</b> (stories/questions may change).
//                     </label>
//                 </div>
//                 <div>
//                     <button className='STE_next_btn' onClick={() => btnClick('Continue')}>Continue</button>
//                     <label>
//                         Press this key to save your answers and get your completion code
//                     </label>
//                 </div>
//             </div>
//
//             {
//                 newGameMsg && (
//                     <div className='STE_FM_ngm'>
//                         <div className='STE_Prompt'>
//                             <label>
//                                 Are you sure you want to start the study from the beginning?<br/>
//                                 You will be asked to read stories and answer questions from scratch.
//                             </label>
//
//                             <div>
//                                 <button className='STE_next_btn' onClick={() => Forward('NewGame')}>Yes I want to start all over again</button>
//                                 <button className='STE_next_btn' onClick={() => setNewGameMsg(false)}>Cancel</button>
//                             </div>
//                         </div>
//                     </div>
//                 )
//             }
//
//             {
//                 newDecMsg && (
//                     <div className='STE_FM_dm'>
//                         <div className='STE_Prompt'>
//                             <label>You cannot get your completion code without the declaration</label>
//                             <button className='STE_next_btn' onClick={() => setNewDecMsg(false)}>OK</button>
//                         </div>
//                     </div>
//                 )
//             }
//         </div>
//     )
// }

// const FinishGame2 = ({Forward}) => {
//     const [checked, setChecked] = useState(false);
//     const [newGameMsg, setNewGameMsg] = useState(false);
//     const [newDecMsg, setNewDecMsg] = useState(false);
//     const dec_at_end = GameSet.game_condition.includes('e_d');
//
//     const setCheck = check => {
//         setChecked(check);
//     }
//
//     const btnClick = (option) => {
//         if (option === 'Back')
//             setNewGameMsg(true);
//         else if (option === 'Continue'){
//             if (dec_at_end && !checked)
//                 setNewDecMsg(true);
//             else
//                 Forward();
//         }
//     }
//
//     return (
//         <div className={'STE_FM STE_Prompt '}>
//             <label>Congratulation, you almost finished the study</label>
//
//             {dec_at_end && (
//                 <Declaration
//                     set_check={setCheck}
//                     checked_2={checked}
//                 />
//             )}
//
//             <div className='STE_FM_m'>
//                 <div>
//                     <button className='STE_next_btn' onClick={() => btnClick('Back')}>Back</button>
//                     <label>
//                         Please press this key if you think you made mistakes and you want to change your
//                         answers. Notice that if you press this key <b>all</b> your previous answers will be erased,
//                         and you will be asked to repeat the study <b>from the beginning</b> (stories/questions may change).
//                     </label>
//                 </div>
//                 <div>
//                     <button className='STE_next_btn' onClick={() => btnClick('Continue')}>Continue</button>
//                     <label>
//                         Press this key to save your answers and get your completion code
//                     </label>
//                 </div>
//             </div>
//
//             {
//                 newGameMsg && (
//                     <div className='STE_FM_ngm'>
//                         <div className='STE_Prompt'>
//                             <label>
//                                 Are you sure you want to start the study from the beginning?<br/>
//                                 You will be asked to read stories and answer questions from scratch.
//                             </label>
//
//                             <div>
//                                 <button className='STE_next_btn' onClick={() => Forward('NewGame')}>Yes, I want to start all over again</button>
//                                 <button className='STE_next_btn' onClick={() => setNewGameMsg(false)}>Cancel</button>
//                             </div>
//                         </div>
//                     </div>
//                 )
//             }
//
//             {
//                 newDecMsg && (
//                     <div className='STE_FM_dm'>
//                         <div className='STE_Prompt'>
//                             <label>You cannot get your completion code without the declaration</label>
//                             <button className='STE_next_btn' onClick={() => setNewDecMsg(false)}>OK</button>
//                         </div>
//                     </div>
//                 )
//             }
//         </div>
//     )
// }

const FinishStory = ({Forward}) => {

    const story_num = NumberOfStories - GameSet.stories.length;

    return (
        <div className='STE_Dec STE_Prompt'>
            <label></label>
            <label>
                Great, you finished the questions for story {story_num}.<br/>
                To move to the next story please press 'Go to story {story_num+1}'.
            </label>


            <button className='STE_next_btn ' onClick={Forward}>Go to story {story_num+1}</button>
        </div>
    )
}

const Question = ({question, selectAnswer, question_index}) => {

    return (
        <div className='STE_Que'>
            <label>{(question_index+1) +'. '+ question.que}</label>
            <div>
                {
                    question.answers.map(
                        (answer, answer_index) => (
                            <label
                                key={'q' +answer_index+answer}
                            >
                                <input
                                    onClick={() => selectAnswer(question_index, answer_index)}
                                    type="radio"
                                    key={answer_index+answer}
                                    name={'q' + question_index}

                                />
                                {answer}
                            </label>

                        )
                    )
                }
            </div>
        </div>
    )
}

const Questions = ({questions, Forward, part}) => {

    const [quesAns, setQuesAns] = useState((new Array(questions.length)).fill(null));

    useEffect(() => {

        const story_number = NumberOfStories - GameSet.stories.length;
        const story_key = 'story_' + story_number;
        let CurrentPart = part === 'Practice' ? PracticeQues : GameQues[story_key];

        if (CurrentPart.length === 0)
            CurrentPart = new Array(questions.length);
    }, [part, questions]);

    let err_ans = false;
    for (let i=0; i<quesAns.length; i++)
        if (quesAns[i] === null){
            err_ans = true;
            break;
        }

    const selectAnswer = (question_index, answer_index) => {
        let q_ = [...quesAns];
        q_[question_index] = answer_index;
        const story_number = NumberOfStories - GameSet.stories.length;
        const story_key = 'story_' + story_number;
        let CurrentPart = part === 'Practice' ? PracticeQues : GameQues[story_key];

        CurrentPart[question_index] = answer_index+1;
        setQuesAns(q_);
    }

    const Continue = () => {
        const story_number = NumberOfStories - GameSet.stories.length;
        const story_key = 'story_' + story_number;
        let CurrentPart = part === 'Practice' ? PracticeQues : GameQues[story_key];

        NewLogs({
            user_id: UserId,
            exp: ThisExperiment,
            running_name: RunningName,
            action: 'F.Q',
            type: 'LogGameType',
            more_params: {
                part: part.charAt(0).toLowerCase(),
                story: part === 'Practice'? 0 : (story_number+1),
                answers: CurrentPart.join(', '),
                local_t: getTimeDate().time,
                local_d: getTimeDate().date,
            },
        }).then((res) => {});
        Forward();
    }
    return (
        <div className='STE_Ques'>
            <div className='STE_Ques-h'>
                <label>{part === 'Practice' ? 'Practice - ' : ''}Questions</label>
                <label>Please answer the questions below.</label>
            </div>
            <div className='STE_QuesList'>
                {
                    questions.map(
                        (question, question_index) => (
                            <Question
                                key={question_index+question.que}
                                question={question}
                                question_index={question_index}
                                selectAnswer={selectAnswer}
                            />
                        )
                    )
                }
            </div>

            <button className={'STE_next_btn ' + (err_ans? 'disabledElem' : '')} onClick={err_ans? undefined : Continue}>Next</button>
        </div>
    )
}

const BonusQuestions = ({Forward}) => {

    const [quesAns, setQuesAns] = useState((new Array(GameSet.bonus_ques.length)).fill(null));

    useEffect(() => {
        BonusQues = (new Array(GameSet.bonus_ques.length)).fill('');
    }, []);

    let err_ans = false;
    for (let i=0; i<quesAns.length; i++)
        if (quesAns[i] === null){
            err_ans = true;
            break;
        }

    const selectAnswer = (question_index, answer_index) => {
        let q_ = [...quesAns];
        q_[question_index] = answer_index;
        BonusQues[question_index] = answer_index+1;
        setQuesAns(q_);
    }
    return (
        <div className='STE_Ques'>
            <div className='STE_Ques-h'>
                <label>Please answer the questions below.</label>
            </div>
            <div className='STE_QuesList'>
                {
                    GameSet.bonus_ques.map(
                        (question, question_index) => (
                            <Question
                                key={question_index+question.que}
                                question={question}
                                question_index={question_index}
                                selectAnswer={selectAnswer}
                            />
                        )
                    )
                }
            </div>

            <button
                className={'STE_next_btn ' + (err_ans? 'disabledElem' : '')}
                onClick={err_ans? undefined : Forward}
            >
                Move to exit survey
            </button>
        </div>
    )
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            step: 0,
            isLoading: false
        }

        this.nextStep = this.nextStep.bind(this);
        this.sendPartToDb = this.sendPartToDb.bind(this);
    }

    sendPartToDb(){
        const story_number = NumberOfStories - GameSet.stories.length;
        const story_key = 'story_' + story_number;

        const CurrentPart = this.props.Part === 'Practice' ? PracticeRec : GameRec[story_key];

        let sc = this.state;
        sc.isLoading = true;
        this.props.insertGameArray(CurrentPart);
        this.setState(sc, () => {
            this.props.sendGameDataToDB().then(
                () => {
                    NewLogs({
                        user_id: UserId,
                        exp: ThisExperiment,
                        running_name: RunningName,
                        action: 'F.S',
                        type: 'LogGameType',
                        more_params: {
                            part: this.props.Part.charAt(0).toLowerCase(),
                            story: this.props.Part === 'Practice'? 0 : (story_number+1),
                            local_t: getTimeDate().time,
                            local_d: getTimeDate().date,
                        },
                    }).then((res) => {});

                    sc = this.state;
                    sc.isLoading = false;
                    this.setState(sc);
                }
            );
        });
    }

    nextStep(){
        let sc = this.state;

        if (sc.step === 2){
            sc.step = 0;
        }
        else if (sc.step === 1){
            if (this.props.Part === 'Practice') {
                return this.props.Forward();
            }

            GameSet.stories = GameSet.stories.filter((d_, index) => index !== 0);
            if (GameSet.stories.length === 0) {
                return this.props.Forward();
            }
            else {
                sc.step = 2;
            }
        }
        else {
            this.sendPartToDb();
            sc.step++;
        }
        this.setState(sc);
    }

    render() {
        const {step} = this.state;

        const next_story = this.props.Part === 'Practice' ? GameSet.practice_story : GameSet.stories[0];
        const questions = this.props.Part === 'Practice' ? GameSet.practice_story.questions : GameSet.stories[0].questions;

        if (this.state.isLoading) return <WaitForAction2/>;


        return (
            <>
                {step === 0 && <Story part={this.props.Part} Forward={this.nextStep} next_story={next_story}/>}
                {step === 1 && <Questions part={this.props.Part} Forward={this.nextStep} questions={questions}/>}
                {step === 2 && <FinishStory part={this.props.Part} Forward={this.nextStep} />}
            </>
        );
    }
}

class Start extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        ResetAll();

        UserId = props.user_id;
        RunningName = props.running_name;

        PaymentsSettings = props.game_settings.payments;

        GameSet.magnifier_shape = props.game_settings.game.magnifier_shape;
        GameSet.magnifier_height = Number(props.game_settings.game.magnifier_height);
        GameSet.magnifier_width = Number(props.game_settings.game.magnifier_width);
        GameSet.magnifier_radius = Number(props.game_settings.game.magnifier_radius);
        GameSet.magnifier_radius_y = Number(props.game_settings.game.magnifier_radius_y);
        GameSet.app_back = props.game_settings.game.app_back;
        GameSet.with_image = props.game_settings.game.w_i;
        GameSet.need_click = props.game_settings.game.n_c;
        GameSet.expose_full_line = props.game_settings.game.f_l;
        GameSet.on_leave = props.game_settings.game.o_l;
        GameSet.on_mouse_up = props.game_settings.game.o_m_u;
        GameSet.cursor = props.game_settings.game.cursor;
        GameSet.shape_border = props.game_settings.game.s_b;
        GameSet.minimum_line_time = Number(props.game_settings.game.l_t);
        GameSet.practice_index = Number(props.game_settings.game.p_s) || 0;
        GameSet.bonus_ques = props.game_settings.game.bonus_ques;
        GameSet.correct_bonus = props.game_settings.game.c_b;

        if (GameSet.with_image === 'Yes'){
            GameSet.magnifier_shape = 'Circle';
            GameSet.magnifier_radius = 25;
        }
        GameSet.game_condition = props.game_settings.game.condition;

        const all_cond = props.game_settings.game.conds;

        // const all_cond = [
        //     'f_d',
        //     'f_d_m',
        //     'f_d_m_b',
        //     'e_d',
        //     'e_d_m',
        //     'e_d_m_b'
        // ];

        if (GameSet.game_condition === 'r'){
            GameSet.game_condition = all_cond[Math.floor(Math.random() * all_cond.length)];
        }
        else if (GameSet.game_condition === 'n_r'){
            let RunCounter = KeyTableID();
            GameSet.game_condition = all_cond[RunCounter%all_cond.length];
        }

        this.Forward = this.Forward.bind(this);
        this.initializeGame = this.initializeGame.bind(this);

        this.state = {
            tasks_index: 0,
            isa: props.isa,
            isLoading: true,
        };

        this.game_template = null;
        this.props.SetLimitedTime(false);

        this.initializeGame();
    }

    initNewGame = () => {
        ResetNewGame();
        let stories = this.props.game_settings.game.stories;
        GameSet.practice_story = stories[GameSet.practice_index-1];
        GameSet.stories = stories.filter((s, s_i) => s_i !== (GameSet.practice_index-1));
        NumberOfStories = GameSet.stories.length;

        for (let i=0; i<NumberOfStories; i++) {
            GameRec['story_' + (i)] = [];
            GameQues['story_' + (i)] = [];
        }

        StartTime = Date.now();
        this.setState({
            tasks_index: 0,
            isLoading: false,
        })
    }

    initializeGame() {
        let game_template = [];

        game_template.push({
            Component: GameWelcome
        });

        game_template.push({
            Component: Game,
            Part: 'Practice'
        });

        game_template.push({
            Component: AfterPractice
        });

        if (GameSet.game_condition.includes('f_d'))
            game_template.push({
                Component: Declaration
            });

        game_template.push({
            Component: Game,
            Part: 'Real'
        });

        if (GameSet.game_condition.includes('e_d')) {
            game_template.push({
                Component: FinishGame
            });

            game_template.push({
                Component: Declaration
            });
        }

        game_template.push({
            Component: BeforeLastQues
        });

        game_template.push({
            Component: BonusQuestions
        });

        this.game_template = game_template;
    }

    componentDidMount(){
        NewLogs({
            user_id: UserId,
            exp: ThisExperiment,
            running_name: RunningName,
            action: 'G.L',
            type: 'LogGameType',
            more_params: {
                cond: GameSet.game_condition,
                local_t: getTimeDate().time,
                local_d: getTimeDate().date,
            },
        }).then((res) => this.initNewGame());
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isa !== this.props.isa){
            let sc = this.state;
            sc.isa = this.props.isa;
            this.setState(sc);
        }
    }

    Forward(option){
        let sc = this.state;

        if (sc.tasks_index === (this.game_template.length-1)){
            this.props.SetLimitedTime(false);

            this.props.insertTextInput('condition', GameSet.game_condition);
            this.props.insertTextInput('FinalOption', option === 'NewGame');

            // let story6 = '', story6_p = '';
            // try {
            //     const story6_ques = GameQues['story_5'];
            //     if (!story6_ques)
            //         throw 'err';
            //     story6 = 1;
            //     story6_p = 100;
            //     for (let i=0; i<story6_ques.length; i++)
            //         if (story6_ques[i] !== STORY_6_ANSWERS[i]){
            //             story6 = 0;
            //             story6_p -= 25;
            //             // break;
            //         }
            //     story6_p /= 100;
            // }
            // catch (e) {}

            // this.props.insertTextInput('story6', story6);
            // this.props.insertTextInput('story6_p', story6_p);

            // let all_rec = [...PracticeRec];
            // for (let story_num in GameRec)
            //     all_rec = [...all_rec, ...GameRec[story_num]];
            //
            // this.props.insertGameArray(all_rec);

            for (let story_que in GameQues){
                let que_answers = GameQues[story_que];
                let story_num = Number(story_que.replace('story_', '')) + 1;
                for (let i=0; i<que_answers.length; i++){
                    this.props.insertTextInput(`S${story_num}#${i+1}`, que_answers[i])
                }
            }

            for (let i=0; i<PracticeQues.length; i++){
                this.props.insertTextInput(`P#${i+1}`, PracticeQues[i])
            }

            let bonus = 0, game_points = 0;

            let correct_ans = 0;
            for (let i=0; i<BonusQues.length; i++){
                this.props.insertTextInput(`B#${i+1}`, BonusQues[i]);

                const c1 = Number(GameSet.correct_bonus[i]);
                const c2 = Number(BonusQues[i]-1);
                if (c1 === c2)
                    correct_ans++;
            }

            const percent = Math.floor((correct_ans/BonusQues.length)*1000)/1000;
            this.props.insertTextInput('correct_ans_bonus', correct_ans)
            this.props.insertTextInput('correct_per_bonus', percent)

            // let story6 = '', story6_p = '';
            // try {
            //     const story6_ques = GameQues['story_5'];
            //     if (!story6_ques)
            //         throw 'err';
            //     story6 = 1;
            //     story6_p = 100;
            //     for (let i=0; i<story6_ques.length; i++)
            //         if (story6_ques[i] !== STORY_6_ANSWERS[i]){
            //             story6 = 0;
            //             story6_p -= 25;
            //             // break;
            //         }
            //     story6_p /= 100;
            // }
            // catch (e) {}


            let total_pay = Math.floor((bonus + PaymentsSettings.show_up_fee)*100)/100;

            const current_time = getTimeDate();
            NewLogs({
                user_id: UserId,
                exp: ThisExperiment,
                running_name: RunningName,
                action: 'G.E',
                type: 'LogGameType',
                more_params: {
                    game_points,
                    bonus,
                    correct_per: percent,
                    total_payment: total_pay,
                    local_t: current_time.time,
                    local_d: current_time.date,
                },
            }).then((res) => {});

            this.props.insertPayment({
                game_points: correct_ans,
                correct_per: percent,
                sign_of_reward: PaymentsSettings.sign_of_reward,
                show_up_fee: PaymentsSettings.show_up_fee,
                exchange_ratio: PaymentsSettings.exchange_ratio,
                bonus_endowment: PaymentsSettings.bonus_endowment,
                bonus: bonus,
                total_payment: total_pay,
                Time: current_time.time,
                Date: current_time.date
            });

            sc.isLoading = true;
            this.setState(sc, () => {
                this.props.callbackFunction('FinishGame', {need_summary: option !== 'NewGame', new_game: option === 'NewGame', args: {game_points}});

                // this.props.sendGameDataToDB().then(() => {
                //         NewLogs({
                //             user_id: UserId,
                //             exp: ThisExperiment,
                //             running_name: RunningName,
                //             action: 'G.E.S',
                //             type: 'LogGameType',
                //             more_params: {
                //                 game_points,
                //                 correct_per: percent,
                //                 bonus,
                //                 total_payment: total_pay,
                //                 local_t: current_time.time,
                //                 local_d: current_time.date,
                //             },
                //         }).then((res) => {});
                //         this.props.callbackFunction('FinishGame', {need_summary: option !== 'NewGame', new_game: option === 'NewGame', args: {game_points}});
                //     });
            });
        }
        else {
            if (option === 'Back')
                sc.tasks_index--;
            else
                sc.tasks_index++;
        }
        this.setState(sc);
    }

    render() {
        if (!this.state || this.state.isLoading)
            return <WaitForAction2/>;

        const Component = this.game_template[this.state.tasks_index].Component;
        const Part = this.game_template[this.state.tasks_index].Part;
        return (
            <div
                className='STE_main unselectable'
                style={{
                    backgroundColor: `rgba(${GameSet.app_back.r}, ${GameSet.app_back.g}, ${GameSet.app_back.b}, ${GameSet.app_back.a})`
                }}
            >
                <Component
                    Forward={this.Forward}
                    sendGameDataToDB={this.props.sendGameDataToDB}
                    insertGameArray={this.props.insertGameArray}
                    Part={Part}
                />
            </div>
        );
    }
}

Start.propTypes = {
    game_settings: PropTypes.object,
};

export default Start;

/*
           Props:
           SetLimitedTime,
           dmr,
           running_name: DB_RECORDS.KeyTable.RunningName,
           getTable,
           insertGameLine,
           sendGameDataToDB,
           insertTextInput,
           insertTaskGameLine,
           insertPayment,
           insertLineCustomTable,
           setWaitForAction: setWaitForAction,
           game_settings,
           more,
           isa,
           user_id: DB_RECORDS.UserDetails.UserId,
           callbackFunction
        */

