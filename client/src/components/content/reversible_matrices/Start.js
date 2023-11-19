import React, {Fragment, useEffect, useMemo, useRef, useState} from 'react';
import './gameStyles.css';
import './message.css';
import PropTypes from "prop-types";
import {NewLogs} from "../../../actions/logger";
import {getTimeDate} from "../../../utils/app_utils";
import WaitForAction2 from "../../screens/waitForAction/wait_for_action2";

import {DebuggerModalView, KeyTableID} from "../../screens/gameHandle/game_handle";

const ThisExperiment = 'ReversibleMatrices';

let UserId = null;
let RunningName = '-';
let DebugMode = null;
let PaymentsSettings = null;

let ReversibleMode = null;
let MatBank = null;

let MatBankGroups = {};
let MatBankGroupsOrder = [];

let MemoryTaskValues = [], MemTaskOrder = [];

let MemTaskData = [];

let GameSet = {};

let RealMatricesValues = null;
let CurrentMatrixIndex = 0;

let PracticeMatrixValues = null;
let PracticeMatrixItem = null;

let PracticeEmptyMatrixValues = null;
let PracticeEmptyMatrixItem = null;

const PracticeMem = [
    ['B', 'M', 'L', 'O', 'J'],
    [85, 62, 41, 37, 57],
];
let PracticeMemAnswer = null;

let MatChanged = [], VisitMat = [];

let Records = {};

let GREEN_MATRIX_INDEX;

const BTN_Part1Matrices_BACKCOLOR = '#ffcccc';
const BTN_NewMatrices_BACKCOLOR = '#cc99ff';
const BTN_Finish_BACKCOLOR = '#ffff99';
const BTN_FinalD_BACKCOLOR = '#99ffcc';

let PracticeMatrixDimension = null;

let AT_LEAST_ONE_MATRIX_PART_1 = null, AT_LEAST_ONE_MATRIX_PART_2 = null;

const adjustFont = (textRef) => {
    let height, clientHeight, scrollHeight, maxHeight;

    try{
        textRef.current.style.fontSize = '50px';

        do {
            scrollHeight = textRef.current.scrollHeight;
            clientHeight = textRef.current.clientHeight;
            height = textRef.current.getBoundingClientRect().height;
            maxHeight = Math.max(clientHeight, height);

            if (scrollHeight>maxHeight) {
                let current_font_size = Number(textRef.current.style.fontSize.replace('px', ''));
                let new_size = (current_font_size - 0.5);
                if (new_size <= 0) break;
                textRef.current.style.fontSize = new_size + 'px';
            }

        }
        while (scrollHeight>maxHeight);

        let current_font_size = Number(textRef.current.style.fontSize.replace('px', ''));
        let size_ = textRef.current.style.fontSize;
        if (current_font_size > 30) size_ = '30px';

        textRef.current.style.fontSize = size_;

        // else if (current_font_size < 20) size_ = '20px';

        return size_;

    }
    catch (e) {
        return null;
    }
}

const ResetAll = () => {
    UserId = 'empty';
    RunningName = '-';
    DebugMode = null;
    ReversibleMode = null;
    MatBank = null;
    PaymentsSettings = null;
    GameSet = {};
    RealMatricesValues = [];
    MatChanged = [];
    VisitMat = [];
    MemTaskData = [];
    CurrentMatrixIndex = 0;
    Records = {};

    MatBankGroups = {};
    MatBankGroupsOrder = [];
    PracticeMemAnswer = [
        ['', '', '', '', ''],
        ['', '', '', '', '']
    ];

    PracticeMatrixDimension = null;

    PracticeEmptyMatrixValues = null;
    PracticeEmptyMatrixItem = null;

    AT_LEAST_ONE_MATRIX_PART_1 = null;
    AT_LEAST_ONE_MATRIX_PART_2 = null;
};

const RestGroups = (all) => {

    if (all){
        for (let i=0; i<MatBank.length; i++){
            const mat_item = MatBank[i];
            if (!mat_item.group || mat_item.group === ''){
                if (MatBankGroups.empty_group === undefined)
                    MatBankGroups.empty_group = [];
                MatBankGroups.empty_group.push(i);
            }
            else {
                if (MatBankGroups[mat_item.group] === undefined)
                    MatBankGroups[mat_item.group] = [];
                MatBankGroups[mat_item.group].push(i);
            }
        }
    }

    MatBankGroupsOrder = Object.keys(MatBankGroups);
}

const defaultDebugObj = {
    Condition: '',
    Part: '',
    Mode: '',
    StepPart: '',
    MatrixAppear: '',
    MatrixSerialNum: '',
    MatrixGroup: '',
    StepMatrix: '',
    NCols: '',
    NRows: '',
    Col: '',
    Row: '',
    Value: '',
    SquareRevealedLast: '',
    SquareRevealedMax: '',
    DistMax: '',
    HighestClick: '',
    AdditionalClick: '',
    DecisionNew: '',
    ChangesMat: '',
    dist_choose: {prob: '', value: ''},
    random_number: '',
};

// const getNextColor = () => {
//     let new_light_color;
//     do {
//         new_light_color = Math.random() * 360;
//     }
//     while (COLORS[new_light_color] !== undefined)
//
//     COLORS[new_light_color] = 'X';
//     return new_light_color;
// }

function getMaxDist(dist){
    let max_val = Number(dist[0].value);
    for (let i=1; i<dist.length; i++)
        if (Number(dist[i].value)>Number(max_val))
            max_val = Number(dist[i].value);

    return max_val;
}

class Messages extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            loading: true,
            ClassAdd: this.props.ClassAdd,
            Comp: this.props.Message,
        }

        this.Forward = this.props.Forward;
        this.Button = this.props.Button;
        this.props.setWaitForAction(true);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps){
            this.setState({
                ClassAdd: this.props.ClassAdd,
                Comp: this.props.Message,
            })
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({loading: false});
            this.props.setWaitForAction(false);
        }, 100);
    }

    render() {

        const Comp = this.state.Comp;

        return (
            <div
                className={'sp-message-mode MsgMode ' + this.state.ClassAdd}
                style={{
                    gridTemplateRows: '1fr max-content',
                    visibility: this.state.loading ? 'hidden' : 'visible'
                }}
            >
                {
                    !this.state.loading && (
                        <Comp insertTextInput={this.props.insertTextInput}/>
                    )
                }
                <button onClick={() => this.Forward()}>{this.Button}</button>
            </div>
        )
    }
}

const ChooseFinalError = ({posX, posY}) => {
    if (posX === null || posY === null) return <></>;
    return (
        <div
            className="RM_Matrix_FinalErrMsg"
            style={{
                top: posY,
                left: posX,
            }}
        >
            You have reached your limit,<br/>
            please make a decision
        </div>
    )
};

const Matrix = ({PracticeViewMode, PracticeViewMode2, MatrixView, MaxSize, PracticeGame, PracticeMode, matBackColor, setWaitForAction, refHeight, disableClicks, finalIndex, chooseIndex, currentMatrixItem, currentMatrixValues, onClickCallback, disableExploreNew, no_more_clicks, RM_MatViewDown}) => {

    const [position, setPosition] = useState({
        posX: null,
        posY: null,
    });

    const [cellDim, setCellDim] = useState(100);
    let MatRef = useRef(null);

    const MatSize = [Number(currentMatrixItem.size.split('X')[0]), Number(currentMatrixItem.size.split('X')[1])];

    useEffect(() => {
        const MatSize = [Number(currentMatrixItem.size.split('X')[0]), Number(currentMatrixItem.size.split('X')[1])];

        const handleResize = () => {
            // setCellDim(100);
            let clientWidth, clientHeight, scrollHeight;
            try {
                clientWidth = MatRef.current.clientWidth;
                clientHeight = MatRef.current.clientHeight;
                scrollHeight = MatRef.current.scrollHeight;
            }
            catch (e){
                return;
            }

            let clientHeightMatView = null, scrollHeightMatView = null, MinMate = null;

            try {
                clientHeightMatView = RM_MatViewDown.current.clientHeight;
                scrollHeightMatView = RM_MatViewDown.current.scrollHeight;
                MinMate = Math.min(clientHeightMatView, scrollHeightMatView);
            }
            catch (e){

            }

            let height__ = clientHeight - (scrollHeight-clientHeight);

            if (PracticeGame){
                let screen_height = (0.85*window.innerHeight)/2 - 50;
                height__ = Math.min(screen_height, height__);
            }

            if (MatrixView){
                let screen_height = window.innerHeight/2 - 50;
                height__ = Math.min(screen_height, height__);
            }

            if (MaxSize){
                let max_mat_size = 0.5*window.innerHeight;
                height__ = Math.min(max_mat_size, height__);
            }

            let MinSize;
            if (MinMate)
                MinSize = Math.min(clientHeightMatView, height__) - 20;
            else
                MinSize = Math.min(clientWidth, height__) - 20;

            if (MatrixView){
                MinSize = window.innerHeight/2 - 50;
            }

            if (PracticeViewMode){
                MinSize = 0.20*window.innerHeight - 50;
            }

            if (PracticeViewMode2){
                MinSize = 0.4*window.innerHeight - 50;
            }

            let size__, max_size = Math.max(MatSize[0], MatSize[1]);
            size__ = (MinSize-20)/max_size;
            size__ = Math.min(90, size__);

            // if (refHeight){
            //     size__ = (MinSize-20)/max_size;
            //     // size__ = (height__-20)/max_size;
            //     // setCellDim((0.7*window.innerHeight-250)/Math.max(MatSize[0], MatSize[1]));
            // }
            // else {
            //     size__ = MinSize/max_size;
            // }
            if (PracticeMode && PracticeMatrixDimension === null) {
                PracticeMatrixDimension = size__;
            }

            setCellDim(size__);
        };
        if(MatRef){
            window.addEventListener('resize', handleResize);
            setWaitForAction(true);

            setTimeout(() => {
                if (PracticeMode && PracticeMatrixDimension !== null)
                    setCellDim(PracticeMatrixDimension);
                else
                    handleResize();
                setWaitForAction(false);
            }, 300);
        }

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [currentMatrixItem, MatRef, PracticeViewMode2, PracticeMode, setWaitForAction, MatrixView, MaxSize, PracticeGame, PracticeViewMode, RM_MatViewDown]);

    const onClickCell = index => {
        let dist_choose;
        const random_number = Math.random();

        if (!disableExploreNew){

            let range = 0;
            for (let i=0; i<currentMatrixItem.dist.length; i++){
                range = Math.ceil((range + Number(currentMatrixItem.dist[i].prob))*100)/100;

                if (random_number <= range){
                    dist_choose = currentMatrixItem.dist[i];
                    break;
                }
            }
        }

        onClickCallback(index, dist_choose, dist_choose?random_number:null);
    };

    return (
        <>
            <div
                className='RM_Matrix'
                ref={MatRef}
                style={{
                    gridTemplateColumns: `repeat(${MatSize[0]}, max-content)`,
                    gridTemplateRows: `repeat(${MatSize[1]}, max-content)`,
                }}
                onMouseMove={e => {
                    let tag;
                    try {
                        tag = e.target.attributes.group.value;
                        if (tag !== 'MATRIX_ITEM')
                            if (position.posX !== null)
                                setPosition({
                                    posX: null,
                                    posY: null,
                                })
                    }
                    catch (e) {
                        if (position.posX !== null)
                            setPosition({
                                posX: null,
                                posY: null,
                            })
                    }
                }}
            >
                {
                    cellDim === null && <WaitForAction2/>
                }
                {
                    cellDim !== null && (new Array(MatSize[0]*MatSize[1])).fill('XXX').map(
                        (mat_item, index) => {
                            const index_exist = currentMatrixValues.Indexes.indexOf(index) !== -1;
                            const cell_value = currentMatrixValues.ValueByIndex[index] === undefined ? 'XXX' : currentMatrixValues.ValueByIndex[index];

                            return (
                                <label
                                    onClick={() => disableClicks? {} : onClickCell(index)}
                                    group='MATRIX_ITEM'
                                    onMouseMove={e => {
                                        if (no_more_clicks && !index_exist){
                                            setPosition({
                                                posX: e.pageX,
                                                posY: e.pageY,
                                            })
                                        }
                                        else {
                                            if (position.posX !== null)
                                                setPosition({
                                                    posX: null,
                                                    posY: null,
                                                })
                                        }
                                    }}
                                    className={'unselectable ' + (disableClicks? 'RM_disable_cell ':'') + (chooseIndex === index ? ' RM_MatItemSelect ' : '') + (finalIndex === index? ' RM_MatItemFinal ':'')}
                                    key={'%%%'+index}
                                    style={{
                                        backgroundColor:  matBackColor || 'rgb(240,255,255)',
                                        // backgroundColor:  !index_exist? `rgba(240,255,255,1)` : `rgba(240,255,255,${(chooseIndex === index) ? 0.1 : 0.5})`,
                                        // opacity: !index_exist? 1 : (chooseIndex === index ? 0.1 : 0.5),
                                        filter: !index_exist? '' : (chooseIndex === index ? 'brightness(85%)' : 'brightness(75%)'),
                                        // backgroundColor:  !index_exist? `hsl(${currentMatrixValues.Color}, 100%, 75%)` : `hsl(${currentMatrixValues.Color}, 60%, 70%)`,
                                        color: !index_exist ? 'rgba(0,0,0,0)' : '',
                                        height: cellDim,
                                        width: cellDim,
                                        fontSize: Math.floor(cellDim/2),
                                        pointerEvents: ((disableExploreNew && !index_exist) || disableClicks) ? 'none' : '',

                                        // position: 'relative'
                                    }}
                                >
                                    {/*<span style={{position: 'absolute', color: 'black', top: 5, left: 5, fontSize: 'medium'}}>{index%MatSize[0]}/{Math.floor(index/MatSize[0])}</span>*/}

                                    <span
                                        key={'span'+index}
                                        group='MATRIX_ITEM'
                                    >{cell_value}
                                    </span>
                                </label>
                            )
                        }
                    )
                }
            </div>

            <ChooseFinalError posX={position.posX} posY={position.posY}/>
        </>
    );
}

class PracticeReversibleViewMode extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;

        this.CurrentMatrixValues = ReversibleMode? PracticeMatrixValues[GREEN_MATRIX_INDEX] : PracticeEmptyMatrixValues;
        this.CurrentMatrixItem = ReversibleMode? PracticeMatrixItem[GREEN_MATRIX_INDEX] : PracticeEmptyMatrixItem;

        this.state = {
            step: 0,
            number_clicks: 0,
            choose_index: null,
            last_decision: false,
            final_decision: this.CurrentMatrixValues.FinalIndex,
            selected_indexes: null,
            disable_clicks: null,
            mode: 'View', // 'GoTo',
            MatrixItem: this.CurrentMatrixItem
        };

        this.matOnClick = this.matOnClick.bind(this);
        this.cellClickCallBack = this.cellClickCallBack.bind(this);
        this.MatMode = this.MatMode.bind(this);
        this.ViewMode = this.ViewMode.bind(this);

        this.RM_MatViewDown = React.createRef();
        this.highlightRef = React.createRef();

        if (ReversibleMode)
            this.CurrentMatrixItem.dist = this.CurrentMatrixItem.dist2;

        this.MoreClicks = this.CurrentMatrixItem.dist.length;
        this.BeforeClicks = this.CurrentMatrixItem.dist_length;

        this.FinalValue = getMaxDist(this.CurrentMatrixItem.dist);
    }

    cellClickCallBack(){
        let sc = this.state;
        sc.number_clicks++;
        this.setState(sc);
    }

    matOnClick(index) {
        let sc = this.state;
        sc.selected_indexes = index;
        sc.mode = 'Goto';
        this.setState(sc);
    }

    onClickCallback = (index, dist_choose) => {
        let sc = this.state;
        const MaxClicks = this.MoreClicks + (this.BeforeClicks || 0);
        if (this.CurrentMatrixValues.ValueByIndex[index] !== undefined){
            if (this.CurrentMatrixValues.Indexes.length < MaxClicks) return;
            sc.choose_index = index;

            if (this.CurrentMatrixValues.Indexes.length === MaxClicks){
                const mat_value = Number(this.CurrentMatrixValues.ValueByIndex[sc.choose_index]);
                const final_value = this.FinalValue;

                if (mat_value === final_value && this.CurrentMatrixValues.FinalIndex !== index ) {
                    sc.disable_clicks = true;
                    this.changeHighlightRef(false);
                }
                else {
                    this.changeHighlightRef(true);
                }
            }

            this.setState(sc);
        }
        else if (dist_choose && this.CurrentMatrixValues.ValueByIndex[index] === undefined){
            // sc.choose_index = index;

            sc.disable_clicks = true;
            sc.number_clicks++;
            this.CurrentMatrixValues.ValueByIndex[index] = dist_choose.value;
            this.CurrentMatrixValues.Indexes.push(index);

            const first_index = sc.MatrixItem.dist.findIndex(dist => dist.value === dist_choose.value);
            sc.MatrixItem.dist = sc.MatrixItem.dist.filter((dist, dist_index) => dist_index !== first_index);
            // sc.MatrixItem.dist = sc.MatrixItem.dist.filter(dist => dist.value !== dist_choose.value);

            this.setState(sc, () => {
                let sc_update = this.state;
                setTimeout(() => {
                    sc_update.disable_clicks = false;
                    this.setState(sc_update);
                }, GameSet.sampling_delay * 1000);
            });
        }

    }

    onClickFinal = () => {
        let sc = this.state;
        sc.final_decision = sc.choose_index;
        sc.last_decision = true;
        this.setState(sc);
    }

    getStageText = (all_open) => {
        let stageText;
        if (ReversibleMode){
            if (all_open)
                stageText = (
                    <>
                        If you want to change your decision,<br/>
                        Click the new number and then "final decision".<br/>
                        If you don’t want to change your decision,<br/>
                        press "Next"<br/>
                    </>
                );
            else
                stageText = (
                    <>
                        Please reveal <b>{this.MoreClicks-this.state.number_clicks}</b> more numbers.
                    </>
                );
        }
        else {
            stageText = (
                <>
                    Please reveal <b>{this.MoreClicks-this.state.number_clicks}</b> more numbers,<br/>
                    And finalize your decision.<br/>
                    After you have finished,<br/>
                    Please press "Next"<br/>
                </>
            );
        }

        return stageText;
    }

    MatMode(){
        const MaxClicks = this.MoreClicks + (this.BeforeClicks || 0);

        const all_open = this.CurrentMatrixValues.Indexes.length === MaxClicks;
        const final_choose = this.state.choose_index !== this.CurrentMatrixValues.FinalIndex && Number(this.CurrentMatrixValues.ValueByIndex[this.state.choose_index]) === this.FinalValue;
        const visibilityFinalMatBtn = all_open ? 'visible' : 'hidden';
        const visibilityNextMatBtn = all_open ? 'visible' : 'hidden';

        const disableNextMatBtn = !all_open;
        const disableFinalBtn = !all_open || !final_choose || this.state.last_decision;

        return (
            <div
                className='RM_Game'
            >
                <div className='RM_BoardP'>
                    <div className='RM_BoardP_head'>
                        <label className='l1'>
                            Revealed square {this.state.number_clicks} out of {this.MoreClicks}
                        </label>
                        <label className='l2'>Practice</label>
                    </div>

                    <div
                        className='RM_BoardP_b'
                    >
                        <div
                            ref={this.RM_MatViewDown}
                        >
                            <Matrix
                                PracticeGame={true}
                                PracticeMode={true}
                                matBackColor={this.state.MatrixItem.MatColor}
                                setWaitForAction={this.props.setWaitForAction}
                                finalIndex={this.state.final_decision}
                                chooseIndex={this.state.choose_index}
                                disableExploreNew={this.state.MatrixItem.dist.length === 0}
                                currentMatrixItem={this.state.MatrixItem}
                                currentMatrixValues={this.CurrentMatrixValues}
                                onClickCallback={this.onClickCallback}
                                disableClicks={this.state.disable_clicks}
                                refHeight={true}
                                RM_MatViewDown={this.RM_MatViewDown}
                            />
                        </div>

                        <ResponsiveText stageText={this.getStageText(all_open)} />
                    </div>



                </div>
                <div
                    className='RM_SideBtn'
                >
                    <button
                        className={'RM_button ' + (disableFinalBtn? 'disabledElem' : '')}
                        onClick={(visibilityFinalMatBtn && !disableFinalBtn) ?this.onClickFinal : undefined}
                        style={{
                            backgroundColor: BTN_FinalD_BACKCOLOR,
                            visibility: visibilityFinalMatBtn
                        }}
                    >Final Decision</button>
                    <button
                        className={'RM_SideBtnNM RM_button ' + (disableNextMatBtn? 'disabledElem' : '')}
                        onClick={(visibilityNextMatBtn && !disableNextMatBtn) ?this.props.Forward : undefined}
                        style={{
                            visibility: visibilityNextMatBtn
                        }}
                    >Next</button>
                </div>
            </div>
        )
    }

    MatView = () => {
        const matrices_show = PracticeMatrixValues.map((matrix_values, index_) => {
            const prevent_clicks = index_ !== GREEN_MATRIX_INDEX;

            return (
                <div
                    key={index_}
                    style={{cursor: 'pointer'}}
                    className={((prevent_clicks || this.state.step === 0) ? 'prevent-events' : '')}
                    onDoubleClick={(prevent_clicks || this.state.step === 0)? () => this.changeHighlightRef(true) : () => this.matOnClick(index_)}
                >
                    <Matrix
                        // MaxSize={true}
                        PracticeViewMode={this.state.step === 0}
                        PracticeViewMode2={this.state.step !== 0}
                        matBackColor={PracticeMatrixItem[index_].MatColor}
                        setWaitForAction={this.props.setWaitForAction}
                        finalIndex={matrix_values.FinalIndex}
                        chooseIndex={null}
                        disableExploreNew={true}
                        currentMatrixItem={PracticeMatrixItem[index_]}
                        currentMatrixValues={matrix_values}
                        onClickCallback={() => {}}
                        disableClicks={true}
                        refHeight={true}
                        RM_MatViewDown={this.RM_MatViewDown}
                    />
                </div>
            )
        });

        const empty_mat = (
            <div
                style={{cursor: 'pointer'}}
                className={'prevent-events'}
            >
                <Matrix
                    // MaxSize={true}
                    PracticeViewMode={!ReversibleMode || this.state.step === 0}
                    PracticeViewMode2={!ReversibleMode || this.state.step !== 0}
                    matBackColor={this.CurrentMatrixItem.MatColor}
                    setWaitForAction={this.props.setWaitForAction}
                    finalIndex={this.CurrentMatrixValues.FinalIndex}
                    chooseIndex={null}
                    disableExploreNew={true}
                    currentMatrixItem={this.CurrentMatrixItem}
                    currentMatrixValues={this.CurrentMatrixValues}
                    onClickCallback={() => {}}
                    disableClicks={true}
                    refHeight={true}
                    RM_MatViewDown={this.RM_MatViewDown}
                />
            </div>
        )
        return (
            <div
                className='RM_MatViewM'
                ref={this.RM_MatViewDown}
            >
                {ReversibleMode? matrices_show: empty_mat}
            </div>
        );
    }

    step0 = () => {
        const onClick = () => {
            this.setState({step: 1});
        }

        return (
            <div className='RM_PMatS0'>
                <label>OR</label>
                <label>Continue searching for numbers in new, empty matrices:</label>

                <Matrix
                    PracticeViewMode={true}
                    matBackColor={PracticeEmptyMatrixItem.MatColor}
                    setWaitForAction={this.props.setWaitForAction}
                    finalIndex={null}
                    chooseIndex={null}
                    disableExploreNew={true}
                    currentMatrixItem={PracticeEmptyMatrixItem}
                    currentMatrixValues={ PracticeEmptyMatrixValues}
                    onClickCallback={this.onClickCallback}
                    disableClicks={true}
                    refHeight={true}
                />

                <label>OR BOTH</label>
                <label>Within a new move limit for this part of the study.</label>
                <button onClick={onClick}>Next</button>
            </div>
        )
    }

    header = () => {
        const reverse_head = (
            <>
                {this.state.step === 0 && <label>In this part, you will be able to go back and change your decisions in the matrices you have searched in the first part of the study:</label>}
                {this.state.step === 1 && <label>Let’s assume you want to go back to the <span ref={this.highlightRef} style={{padding: '0.2rem', backgroundColor: PracticeMatrixItem[GREEN_MATRIX_INDEX].MatColor}}>green</span> matrix. <br/>Try double clicking it!</label>}
            </>
        );

        const ireverse_head = (
            <>
                <label>
                    In this part, you will be able to continue searching for numbers in new, empty matrices within a new move limit for this part of the study.
                </label>
            </>
        );

        return (
            <div
                className='RM_PMatH'
            >
                <label>Practice</label>
                { ReversibleMode? reverse_head : ireverse_head }
            </div>
        )
    }

    changeHighlightRef = active => {
        try {
            if (active){
                this.highlightRef.current.className = this.highlightRef.current.className.replace('active', '');
                this.highlightRef.current.className = this.highlightRef.current.className+" active";
            }
            else {
                this.highlightRef.current.className = this.highlightRef.current.className.replace('active', '');
            }
        }
        catch (e) {

        }
    }

    ViewMode() {
        return (
            <div
                className='RM_MatViewP'
            >
                {this.header()}
                {this.MatView()}
                {ReversibleMode && this.state.step === 0 && this.step0()}
                {!ReversibleMode && <button onClick={() => this.matOnClick(0)}>Next</button>}
            </div>
        )
    }

    render() {
        if (this.state.mode === 'View')
            return this.ViewMode();

        return this.MatMode();
    }
}

class PracticeMode extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            loading: false,
            step: 0,
            trial: 0,
            mat: 0,
            final_decision: null,
            choose_index: null,
            disable_clicks: false,
        };

        this.highlightRef = React.createRef();

        // PracticeMatrixValues
        // PracticeMatrixItem

        let max_open = [];
        for (let i=0; i<PracticeMatrixItem.length; i++)
            max_open.push(PracticeMatrixItem[i].dist.length);

        let first_choice = PracticeMatrixItem[0].dist[0].value;
        this.PracticeMatrices = [
            {
                MaxOpen: PracticeMatrixItem[0].dist.length,
                Numbers: PracticeMatrixItem[0].dist.map(dist => dist.value),
                BySteps: true,
                FinalValue: getMaxDist(PracticeMatrixItem[0].dist),
                arrow_line: 1,
                Steps: [
                    <>
                        When you first see a matrix there are many empty squares.<br/>
                        You may press any square you want to reveal the number behind it.<br/>
                        Please press a square to reveal a number and move to the next part in the practice.<br/>
                        <br/>
                        <br/>
                    </>,
                    <>
                        The number you revealed is {first_choice}.<br/>
                        As you can see, your revealed squares will be counted above,<br/>
                        And you will know how many more moves you have left.<br/>
                        {/*Please press <b>2</b> additional squares to reveal additional numbers.<br/>*/}
                        {/*<br/>*/}
                    </>,
                    <>
                        Please press <b>{max_open[0]-2}</b> additional square to reveal additional number.<br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                    </>,
                    <>
                        Let’s assume you don’t want to reveal any more numbers<br/>
                        and want to decide based on the numbers you now see in the matrix.<br/>
                        When you are ready to decide, please select the square with the <span ref={this.highlightRef} className='RM_final_err'><b>highest number</b></span>.<br/>
                        <br/>
                        <br/>
                    </>,
                    <>
                        To finalize your decision, Press "final decision".<br/>
                        <br/>
                        (Only revealing a new number will count as a move, Finalizing a decision will not).<br/>
                        <br/>
                        <br/>
                    </>,
                    <>
                        The selected number is your final decision in this matrix,<br/>
                        and will account for calculation of your bonus payment in the end of the game.<br/>
                        Thus, it is important to try and find the highest numbers in a matrix!<br/>
                        Once you have decided, you can move to a new matrix (As long as you have more moves left)<br/>
                        Please press "Next"<br/>
                    </>,
                ]
            },
            {
                MaxOpen: PracticeMatrixItem[1].dist.length,
                MaxOpen2: PracticeMatrixItem[1].dist2.length,
                Numbers: PracticeMatrixItem[1].dist.map(dist => dist.value),
                Numbers2: PracticeMatrixItem[1].dist2.map(dist => dist.value),
                BySteps: true,
                FinalValue: getMaxDist(PracticeMatrixItem[1].dist),
                FinalValue2: getMaxDist(PracticeMatrixItem[1].dist2),
                Steps: [
                    <>
                        Please reveal <b>{max_open[1]}</b> numbers in this matrix.<br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                    </>,
                    <>
                        Please press <b>{max_open[1]-1}</b> additional square to reveal additional number.<br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                    </>,
                    <>
                        Please choose the <span ref={this.highlightRef} className='RM_final_err'><b>highest number</b></span><br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                    </>,
                    <>
                        Please press "Final Decision"<br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                    </>,
                    <>
                        You have still {max_open[2]} moves left so let’s continue practicing!<br/>
                        Please press "Next"<br/>
                        <br/>
                        <br/>
                        <br/>
                    </>
                ]
            },
            {
                MaxOpen: PracticeMatrixItem[2].dist.length,
                Numbers: PracticeMatrixItem[2].dist.map(dist => dist.value),
                BySteps: false,
                FinalValue: getMaxDist(PracticeMatrixItem[2].dist),
                Steps: [
                    <>
                        Try to find the highest number in the matrix using the {max_open[2]} moves left!<br/>
                        In the game,<br/>
                        You can choose to divide your moves to search in more matrices and reveal less squares inside each matrix,<br/>
                        or search in less matrices and reveal more squares in each of them.<br/>
                        <b>Important!</b><br/>
                        Each matrix has different values, and you may find higher numbers that will count for higher bonuses in this game!
                    </>
                ]
            },
            // {
            //     MaxOpen: PracticeMatrixItem[3].dist.length,
            //     Numbers: PracticeMatrixItem[3].dist,
            //     BySteps: true,
            //     FinalValue: getMaxDist(PracticeMatrixItem[3].dist),
            //     Steps: [
            //         <>
            //             Try to Finish your moves and find the highest number in the matrix!<br/>
            //             <br/>
            //             <b>Important!</b>
            //             <br/>
            //             Each matrix has different values, and you may find higher numbers that will count for higher bonuses in this game!
            //         </>,
            //         <>
            //             Try to Finish your moves and find the highest number in the matrix!<br/>
            //             <br/>
            //             <b>Important!</b>
            //             <br/>
            //             Each matrix has different values, and you may find higher numbers that will count for higher bonuses in this game!
            //         </>,
            //         <>
            //             Try to Finish your moves and find the highest number in the matrix!<br/>
            //             <br/>
            //             <b>Important!</b>
            //             <br/>
            //             Each matrix has different values, and you may find higher numbers that will count for higher bonuses in this game!
            //         </>,
            //         <>
            //             Try to Finish your moves and find the highest number in the matrix!<br/>
            //             <br/>
            //             <b>Important!</b>
            //             <br/>
            //             Each matrix has different values, and you may find higher numbers that will count for higher bonuses in this game!
            //         </>,
            //         <>
            //             Try to Finish your moves and find the highest number in the matrix!<br/>
            //             <br/>
            //             <b>Important!</b>
            //             <br/>
            //             Each matrix has different values, and you may find higher numbers that will count for higher bonuses in this game!
            //         </>,
            //         <>
            //             Try to Finish your moves and find the highest number in the matrix!<br/>
            //             <br/>
            //             <b>Important!</b>
            //             <br/>
            //             Each matrix has different values, and you may find higher numbers that will count for higher bonuses in this game!
            //         </>,
            //         <>
            //             Try to Finish your moves and find the highest number in the matrix!<br/>
            //             <br/>
            //             <b>Important!</b>
            //             <br/>
            //             Each matrix has different values, and you may find higher numbers that will count for higher bonuses in this game!
            //         </>,
            //         <>
            //             You have used all your moves.
            //             <br/>
            //             <br/>
            //             In the game, you will be moved to the next task.
            //         </>
            //     ]
            // }
        ];

        this.NumbrOfClick = this.PracticeMatrices.reduce((total, mat) => (total + mat.MaxOpen), 0);

        this.RM_MatViewDown = React.createRef();
    }

    nextMatrix = () => {
        let sc = this.state;
        sc.mat++;
        sc.step = 0;
        if (sc.mat === this.PracticeMatrices.length)
            this.props.Forward();
        else
            this.setState(sc);
    }

    changeHighlightRef = active => {
        try {
            if (active){
                this.highlightRef.current.className = this.highlightRef.current.className.replace('active', '');
                this.highlightRef.current.className = this.highlightRef.current.className+" active";
            }
            else {
                this.highlightRef.current.className = this.highlightRef.current.className.replace('active', '');
            }
        }
        catch (e) {

        }
    }

    onClickCallback = (index, dist_choose) => {
        let sc = this.state;

        if (PracticeMatrixValues[sc.mat].ValueByIndex[index] !== undefined){
            if (PracticeMatrixValues[sc.mat].Indexes.length < this.PracticeMatrices[sc.mat].MaxOpen) return;
            sc.choose_index = index;

            if (PracticeMatrixValues[sc.mat].Indexes.length === this.PracticeMatrices[sc.mat].MaxOpen){
                const mat_value = Number(PracticeMatrixValues[sc.mat].ValueByIndex[sc.choose_index]);
                const final_value = Number(this.PracticeMatrices[sc.mat].FinalValue);
                if (mat_value === final_value) {
                    sc.step++;
                    sc.disable_clicks = true;
                    sc.disable_clicks = true;
                    this.changeHighlightRef(false);
                }
                else {
                    this.changeHighlightRef(true);
                }
            }

            this.setState(sc);
        }
        else if (dist_choose && PracticeMatrixValues[sc.mat].ValueByIndex[index] === undefined){
            // sc.choose_index = index;

            sc.disable_clicks = true;
            sc.step++;
            sc.trial++;
            PracticeMatrixValues[sc.mat].ValueByIndex[index] = dist_choose.value;
            PracticeMatrixValues[sc.mat].Indexes.push(index);
            const first_index = PracticeMatrixItem[sc.mat].dist.findIndex(dist => dist.value === dist_choose.value);
            PracticeMatrixItem[sc.mat].dist = PracticeMatrixItem[sc.mat].dist.filter((dist, dist_index) => dist_index !== first_index);
            // PracticeMatrixItem[sc.mat].dist = PracticeMatrixItem[sc.mat].dist.filter(dist => dist.value !== dist_choose.value);

            this.setState(sc, () => {
                let sc_update = this.state;
                setTimeout(() => {
                    sc_update.disable_clicks = false;
                    this.setState(sc_update);
                }, GameSet.sampling_delay * 1000);
            });
        }

    }

    onClickFinal = () => {
        let sc = this.state;
        sc.final_decision = sc.choose_index;
        PracticeMatrixValues[sc.mat].FinalIndex = sc.choose_index;
        sc.step++;
        this.setState(sc);
    }

    onClickNextPuzzle = () => {
        this.props.setWaitForAction(true);

        setTimeout(() => {
            let sc = this.state;
            sc.mat++;
            if (sc.mat === this.PracticeMatrices.length) {
                this.props.setWaitForAction(false);
                return this.props.Forward();
            }
            sc.final_decision = null;
            sc.choose_index = null;
            sc.disable_clicks = false;
            sc.step = 0;
            this.setState(sc, () => this.props.setWaitForAction(false));
        }, 1200);
    }

    arrowLine(){

        return (
            <div className='RM_BoardP_l_r'>
                <div className="RM_BoardP_l_r-ar"></div>
                <div className="RM_BoardP_l_r-l"></div>
            </div>
        )
    }

    render() {
        if (this.state.loading)
            return <WaitForAction2 />;

        const all_open = PracticeMatrixValues[this.state.mat].Indexes.length === this.PracticeMatrices[this.state.mat].MaxOpen;
        const final_choose = Number(PracticeMatrixValues[this.state.mat].ValueByIndex[this.state.choose_index]) === Number(this.PracticeMatrices[this.state.mat].FinalValue);
        const visibilityFinalMatBtn = (final_choose&&all_open) ? 'visible' : 'hidden';
        const visibilityNextMatBtn = this.state.final_decision === null ? 'hidden' : 'visible';

        const disableNextMatBtn = this.state.final_decision === null;
        const disableFinalBtn = !disableNextMatBtn;

        let arrowLine = false;
        try {
            arrowLine = this.state.step === this.PracticeMatrices[this.state.mat].arrow_line;
        }
        catch (e){}

        let StepLabel = '';
        const CurrentMatrix = this.PracticeMatrices[this.state.mat];
        if (CurrentMatrix.BySteps){
            StepLabel = CurrentMatrix.Steps[this.state.step] || <></>;
        }
        else
            StepLabel = this.PracticeMatrices[this.state.mat].Steps[0] || <></>;

        return (
            <div
                className='RM_Game'
            >
                <div
                    className='RM_BoardP'
                >
                    <div className='RM_BoardP_head'>
                        <label className='l1'>
                            Revealed square
                            <span className={arrowLine?'l1B':''}>
                                {this.state.trial}
                                {arrowLine && this.arrowLine()}
                            </span>
                            out of {this.NumbrOfClick}
                        </label>
                        <div>

                        </div>
                        <label className='l2'>Practice</label>
                    </div>

                    <div
                        className='RM_BoardP_b'
                    >
                        <div
                            ref={this.RM_MatViewDown}
                        >
                            <Matrix
                                PracticeGame={true}
                                PracticeMode={true}
                                matBackColor={PracticeMatrixItem[this.state.mat].MatColor}
                                setWaitForAction={this.props.setWaitForAction}
                                finalIndex={this.state.final_decision}
                                chooseIndex={this.state.choose_index}
                                disableExploreNew={PracticeMatrixItem[this.state.mat].dist.length === 0}
                                currentMatrixItem={PracticeMatrixItem[this.state.mat]}
                                currentMatrixValues={PracticeMatrixValues[this.state.mat]}
                                onClickCallback={this.onClickCallback}
                                disableClicks={this.state.disable_clicks}
                                refHeight={true}
                                RM_MatViewDown={this.RM_MatViewDown}
                            />
                        </div>

                        <ResponsiveText stageText={StepLabel} />
                    </div>
                    {/*<label>{}</label>*/}
                </div>
                <div
                    className='RM_SideBtn'
                >
                    <button
                        className={'RM_button ' + (disableFinalBtn? 'disabledElem' : '')}
                        onClick={(visibilityFinalMatBtn && !disableFinalBtn) ?this.onClickFinal : undefined}
                        style={{
                            backgroundColor: BTN_FinalD_BACKCOLOR,
                            visibility: visibilityFinalMatBtn
                        }}
                    >Final Decision</button>
                    <button
                        className={'RM_SideBtnNM RM_button ' + (disableNextMatBtn? 'disabledElem' : '')}
                        onClick={(visibilityNextMatBtn && !disableNextMatBtn) ?this.onClickNextPuzzle : undefined}
                        style={{
                            visibility: visibilityNextMatBtn
                        }}
                    >Next</button>
                </div>
            </div>
        )
    }

}

const RealSideText = ({Stage, Mode, LimitCLicksNumber, number_of_clicks}) => {
    const [fontSize, setFontSize] = useState('20px');

    let textRef = useRef(null);

    useEffect(() => {
        if (!textRef) return ;

        const handleResize = () => {
            setFontSize(adjustFont(textRef));
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [textRef]);

    return (
        <p
            ref={textRef}
            style={{
                fontSize,
            }}
        >
            {/*You may reveal as many squares as you want inside the {this.props.LimitCLicksNumber} squares limit and see the numbers behind them.*/}
            Click the squares to reveal their values.
            <br/><br/>
            {/*When you feel you have searched enough, please select the square with the highest number.*/}
            When you are ready to move on to the next matrix, select the square with the highest value, then press "Final Decision".
            {
                Stage === 1 && (
                    <>
                        <br/><br/>
                        You will then proceed to a new matrix.
                    </>
                )
            }
            {/*Then press "Final Decision".*/}
            {
                // this.props.Stage === 1 ? 'To move on to the next matrix, press "Next"' : (
                Stage === 2 && ReversibleMode && Mode !== 'Goto' && (
                    <>
                        <br/><br/>
                        To select another matrix, press "Part 1 Matrices".
                        <br/><br/>
                        To reveal squares in new matrices, press "New Matrices".
                    </>
                )

            }

            {
                // this.props.Stage === 1 ? 'To move on to the next matrix, press "Next"' : (
                Stage === 2 && ReversibleMode && Mode === 'Goto' && (
                    <>
                        <br/><br/>
                        To proceed to a new matrix, press "Next New Matrix".
                        <br/><br/>
                        To revisit a part 1 matrix,
                        press "Part 1 Matrices".
                    </>
                )

            }

            {
                // this.props.Stage === 1 ? 'To move on to the next matrix, press "Next"' : (
                Stage === 2 && !ReversibleMode && (
                    <>
                        <br/><br/>
                        To proceed to a new matrix, press "Next New Matrix".
                    </>
                )

            }

            <br/><br/>
            <span style={{color: 'red', textDecoration: 'underline'}}>Important!</span><br/>
            You have {LimitCLicksNumber-number_of_clicks} moves left. <br/>It is your decision how to divide these moves between matrices.


        </p>
    )
}

const ResponsiveText = ({stageText}) => {
    const [fontSize, setFontSize] = useState('20px');
    const [paraHeight, setParaHeight] = useState((0.85*window.innerHeight)/2 - 50);

    let textRef = useRef(null);

    useEffect(() => {
        if (!textRef) return ;

        const handleResize = () => {
            setParaHeight((0.85*window.innerHeight)/2 - 50);
            setFontSize(adjustFont(textRef));
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [textRef, stageText]);

    return (
        <p
            ref={textRef}
            style={{
                textAlign: 'center',
                fontSize,
                height: paraHeight,
                width: '100%',
            }}
        >
            {stageText}
        </p>
    )
}

class RealMode extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            loading: true,
            text_input_error: false,
            final_decision: this.props.MatrixValues? this.props.MatrixValues.FinalIndex : null,
            currentMatrixValues: this.props.MatrixValues,
            choose_index: null,
            disable_clicks: false,
            number_of_clicks: this.props.NumOfClicks,
            debug_row: !DebugMode ? null : {...defaultDebugObj}
        };

        this.onClickCallback = this.onClickCallback.bind(this);
        this.nextMatrix = this.nextMatrix.bind(this);
        this.onClickFinal = this.onClickFinal.bind(this);
        this.onClickNextPuzzle = this.onClickNextPuzzle.bind(this);
        this.onClickStageTwo = this.onClickStageTwo.bind(this);
        this.newRow = this.newRow.bind(this);
        this.stage1_Btn = this.stage1_Btn.bind(this);
        this.stage2_r_goto_Btn = this.stage2_r_goto_Btn.bind(this);
        this.stage2_r_new_Btn = this.stage2_r_new_Btn.bind(this);
        this.stage2_nr_Btn = this.stage2_nr_Btn.bind(this);

        this.mat_clicks = 0;
    }

    componentDidMount() {
        if (this.props.Mode !== 'Goto')
            this.nextMatrix(true);
        else {
            this.setState({
                loading: false
            })
        }
    }

    nextMatrix(first_time) {
        this.mat_clicks = 0;
        let sc = this.state;
        sc.loading = true;
        sc.final_decision = null;
        sc.currentMatrixValues = null;
        sc.choose_index = null;
        sc.disable_clicks = false;
        this.props.setWaitForAction(true);

        if (DebugMode)
            sc.debug_row = {...defaultDebugObj};

        this.setState(sc, () => {
            if (MatBankGroupsOrder.length === 0)
                RestGroups(false);

            const random_group_index = Math.floor(Math.random() * MatBankGroupsOrder.length);
            const random_group = MatBankGroupsOrder[random_group_index];
            MatBankGroupsOrder = MatBankGroupsOrder.filter(go => go !== random_group);

            const random_group_item_index = Math.floor(Math.random() * MatBankGroups[random_group].length);
            const random_group_item = MatBankGroups[random_group][random_group_item_index];

            MatBankGroups[random_group] = MatBankGroups[random_group].filter((bg, bg_index) => bg_index !== random_group_item_index);

            if (MatBankGroups[random_group].length === 0)
                delete MatBankGroups[random_group];

            if (Object.keys(MatBankGroups).length === 0)
                RestGroups(true);

            let sc_ = this.state;

            CurrentMatrixIndex++;

            let new_mat_v = {
                Stage: this.props.Stage,
                Indexes: [],
                ValueByIndex: {},
                RealIndex: random_group_item,
                MatrixSerialNum: CurrentMatrixIndex,
                FinalIndex: null,
                FinalValue1: null,
                FinalValue2: null,
                FinalIndexChanged: false,
                IndexInMatricesValues: RealMatricesValues.length
            };

            sc_.currentMatrixValues = new_mat_v;

            RealMatricesValues.push(new_mat_v);
            sc_.loading = false;

            this.setState(sc_);
        });
    }

    newRow(index, final){
        const currentMatrixValues = this.state.currentMatrixValues;
        const currentMatrix = MatBank[currentMatrixValues.RealIndex];

        let sc = this.state;
        let [cols, rows] = currentMatrix.size.split('X');

        let row = Math.floor(index/cols);
        let col = index%cols;

        const value = sc.currentMatrixValues.ValueByIndex[index];
        let MatrixAppear = '';
        try {
            MatrixAppear = RealMatricesValues.reduce((total, mat_item) => total + (mat_item.RealIndex === currentMatrixValues.RealIndex ? 1 : 0), 0)
        }
        catch (e) {
            MatrixAppear = '';
        }
        let db_row = {
            Condition: ReversibleMode ? 1 : 2,
            Part: this.props.Stage,  // Stage
            StepPart: this.state.number_of_clicks, // Clicks in stage
            MatrixAppear, // index
            // MatrixSize: currentMatrix.size,
            MatrixBankIndex: currentMatrixValues.RealIndex,
            MatrixSerialNum: currentMatrixValues.MatrixSerialNum,
            MatrixGroup: currentMatrix.group || '', // clicks in this specific matrix
            StepMatrix: '', // clicks in this specific matrix
            Mode: final? 2 : 1,
            NCols: cols,
            NRows: rows,
            Col: col+1,
            Row: row+1,
            Value: value,
            SquareRevealedLast: '',
            SquareRevealedMax: '',
            DistMax: '', // true false
            HighestClick: '',
            AdditionalClick: '',
            DecisionNew: '',
            ChangesMat: MatChanged.map(m_c => m_c+1).join(' ')
        }

        let mat_step = this.mat_clicks;

        try {
            if (this.props.MatrixValues)
                mat_step = this.props.MatrixValues.Indexes.length;
        }
        catch (e) {

        }

        if (final) {
            db_row.SquareRevealedLast = (sc.currentMatrixValues.Indexes[sc.currentMatrixValues.Indexes.length - 1] === index).toString();
            let SquareRevealedMax = true;

            const values = sc.currentMatrixValues.ValueByIndex;
            let high_val = null;
            let high_index = null;
            for (let key_val in values){
                if (Number(values[key_val]) > Number(value)){
                    SquareRevealedMax = false;
                }

                if (high_val === null){
                    high_val = Number(values[key_val]);
                    high_index = key_val;
                }
                else if (Number(values[key_val]) > high_val) {
                    high_val = Number(values[key_val]);
                    high_index = key_val;
                }
            }

            db_row.SquareRevealedMax = SquareRevealedMax.toString();
            db_row.HighestClick = sc.currentMatrixValues.Indexes.indexOf(Number(high_index)) + 1;

            const dists = currentMatrix.dist;
            let max_value = dists[0].value;
            for (let i=0; i<dists.length; i++){
                if(dists[i].value > max_value)
                    max_value = dists[i].value;
            }

            db_row.DistMax = (Number(max_value) === Number(value)).toString();
        }

        db_row.StepMatrix = mat_step;

        if (this.props.Stage === 2)
            db_row.AdditionalClick = this.mat_clicks;

        if (this.props.Stage === 2 && final && this.props.Mode === 'Goto') {
            // let show_index = currentMatrixValues.Indexes.indexOf(index);
            // db_row.DecisionNew = (show_index >= (currentMatrixValues.Indexes.length - this.mat_clicks)).toString();

            let final_val1 = RealMatricesValues[sc.currentMatrixValues.IndexInMatricesValues].FinalValue1;
            let final_val2 = RealMatricesValues[sc.currentMatrixValues.IndexInMatricesValues].FinalValue2;
            db_row.DecisionNew = (final_val1 !== final_val2).toString();
        }

        if (Records[CurrentMatrixIndex] === undefined)
            Records[CurrentMatrixIndex] = [];
        Records[CurrentMatrixIndex].push(db_row);
        this.props.insertGameLine(db_row);
        return db_row;
    }

    onClickCallback(index, dist_choose, random_number){
        let sc = this.state;
        if (sc.currentMatrixValues.ValueByIndex[index] !== undefined){
            sc.choose_index = index;
            this.setState(sc);
        }
        else if (dist_choose && sc.currentMatrixValues.ValueByIndex[index] === undefined){
            if (ReversibleMode && this.props.Stage === 2 && this.props.Mode === 'Goto'){
                let mat_changed = [...MatChanged];
                mat_changed.push(sc.currentMatrixValues.IndexInMatricesValues);
                mat_changed = new Set(mat_changed);
                MatChanged = Array.from(mat_changed);
            }


            if (this.props.LimitClicks && (sc.number_of_clicks === this.props.LimitCLicksNumber)) return;
            sc.disable_clicks = true;
            sc.currentMatrixValues.ValueByIndex[index] = dist_choose.value;
            sc.currentMatrixValues.Indexes.push(index);
            sc.number_of_clicks++;
            this.mat_clicks++;

            if (sc.number_of_clicks === Math.floor(this.props.LimitCLicksNumber/2)) {
                if((this.props.Stage === 1 && !AT_LEAST_ONE_MATRIX_PART_1) || (this.props.Stage === 2 && !AT_LEAST_ONE_MATRIX_PART_2) )
                    sc.text_input_error = true;
            }

            let debug_row = this.newRow(index, false);

            if (DebugMode) {
                sc.debug_row = {...sc.debug_row, ...debug_row, dist_choose, random_number};
            }

            if (this.props.cellClickCallBack !== undefined)
                this.props.cellClickCallBack();

            this.setState(sc, () => {
                setTimeout(() => {
                    this.setState({
                        disable_clicks: false
                    });
                }, GameSet.sampling_delay * 1000);
            });
        }
    }

    onClickFinal(){
        let sc = this.state;
        if (sc.choose_index === null)
            return;
        sc.final_decision = sc.choose_index;
        RealMatricesValues[sc.currentMatrixValues.IndexInMatricesValues].FinalIndex = sc.choose_index;

        const value_by_index = RealMatricesValues[sc.currentMatrixValues.IndexInMatricesValues].ValueByIndex[sc.final_decision];
        if (this.props.Stage === 1){
            RealMatricesValues[sc.currentMatrixValues.IndexInMatricesValues].FinalValue1 = value_by_index;
        }
        else if (this.props.Stage === 2){
            RealMatricesValues[sc.currentMatrixValues.IndexInMatricesValues].FinalValue2 = value_by_index;
        }

        if (this.props.Stage === 2 && this.props.Mode === 'Goto') {
            RealMatricesValues[sc.currentMatrixValues.IndexInMatricesValues].FinalIndexChanged = true;
            if (ReversibleMode){
                // let mat_changed = [...MatChanged];
                // mat_changed.push(sc.currentMatrixValues.IndexInMatricesValues);
                // mat_changed = new Set(mat_changed);
                // MatChanged = Array.from(mat_changed);
            }
        }
        let debug_row = this.newRow(sc.choose_index, true);


        //// CHANGE /////
        if (ReversibleMode && this.props.Stage === 2 && this.props.Mode === 'Goto'){
            // let mat_changed = [...MatChanged];
            // mat_changed.push(sc.currentMatrixValues.IndexInMatricesValues);
            // mat_changed = new Set(mat_changed);
            // MatChanged = Array.from(mat_changed);
        }
        //// CHANGE /////


        if (DebugMode)
            sc.debug_row = {...sc.debug_row, ...debug_row, final_decision: sc.final_decision};
        this.setState(sc);
    }

    onClickNextPuzzle() {
        if (this.props.Stage === 1 && !AT_LEAST_ONE_MATRIX_PART_1) {
            AT_LEAST_ONE_MATRIX_PART_1 = true;
        }
        else if (this.props.Stage === 2 && !AT_LEAST_ONE_MATRIX_PART_2) {
            AT_LEAST_ONE_MATRIX_PART_2 = true;
        }

        if (this.props.Stage === 2)
            return this.props.ViewModeClick('Explore');
        let sc = this.state;

        if ((this.props.LimitClicks && (sc.number_of_clicks === this.props.LimitCLicksNumber))) {
            return this.props.Forward();
        }

        if (sc.final_decision === null || (GameSet.num_of_mat_rule === 'Limit' && GameSet.num_of_mat === RealMatricesValues.length))
            return;
        this.nextMatrix(false);
        // this.props.Forward();
    }

    onClickStageTwo(){
        this.props.Forward();
    }

    stage1_Btn(){
        const final_btn = this.state.final_decision === null;

        let next_btn = '';
        if ((this.props.LimitClicks && (this.state.number_of_clicks === this.props.LimitCLicksNumber))) {
            next_btn = 'Next';
        }
        else {
            next_btn = 'Next Matrix';
        }

        return (
            <>
                {final_btn && (
                    <button
                        style={{backgroundColor: BTN_FinalD_BACKCOLOR}}
                        onClick={this.onClickFinal}
                            className={'RM_button ' + (this.state.choose_index === null ? 'disabledElem' : '')}
                    >Final Decision
                    </button>
                )}
                <button onClick={this.onClickNextPuzzle} className={'RM_button RM_SideBtnNM ' + (this.state.final_decision === null? 'disabledElem': '')}>{next_btn}</button>
            </>
        );
    }

    stage2_r_goto_Btn(){
        const final_btn = !RealMatricesValues[this.state.currentMatrixValues.IndexInMatricesValues].FinalIndexChanged;

        if (!final_btn && (this.props.LimitClicks && (this.state.number_of_clicks === this.props.LimitCLicksNumber))) {
            return (
                <button style={{backgroundColor: BTN_Finish_BACKCOLOR}} onClick={this.props.Forward} className='RM_button'>Finish</button>
            )
        }
        return (
            <>
                {final_btn && (
                    <button onClick={this.onClickFinal}
                            style={{backgroundColor: BTN_FinalD_BACKCOLOR}}
                            className={'RM_button ' + (this.state.choose_index === null ? 'disabledElem' : '')}
                    >Final Decision
                    </button>
                )}
                <button style={{backgroundColor: BTN_Part1Matrices_BACKCOLOR}} onClick={this.onClickStageTwo} className={'RM_button ' + (this.state.final_decision === null? 'disabledElem': '')}>Part 1 Matrices</button>
                <button style={{backgroundColor: BTN_NewMatrices_BACKCOLOR}} onClick={this.onClickNextPuzzle} className={'RM_button ' + (this.state.final_decision === null? 'disabledElem': '')}>New Matrices</button>
            </>
        );
    }

    stage2_r_new_Btn(){
        const final_btn = this.state.final_decision === null;

        if (!final_btn && (this.props.LimitClicks && (this.state.number_of_clicks === this.props.LimitCLicksNumber))) {
            return (
                <button style={{backgroundColor: BTN_Finish_BACKCOLOR}} onClick={this.props.Forward} className='RM_button'>Finish</button>
            )
        }

        return (
            <>
                {final_btn && (
                    <button onClick={this.onClickFinal}
                            style={{backgroundColor: BTN_FinalD_BACKCOLOR}}
                            className={'RM_button ' + (this.state.choose_index === null ? 'disabledElem' : '')}
                    >Final Decision
                    </button>
                )}
                <button style={{backgroundColor: '#ccccff'}} onClick={this.onClickNextPuzzle} className={'RM_button ' + (this.state.final_decision === null? 'disabledElem': '')}>Next New Matrix</button>
                <button style={{backgroundColor: BTN_Part1Matrices_BACKCOLOR}} onClick={this.onClickStageTwo} className={'RM_button ' + (this.state.final_decision === null? 'disabledElem': '')}>Part 1 Matrices</button>
            </>
        );
    }

    stage2_nr_Btn(){
        const final_btn = this.state.final_decision === null;
        if (!final_btn && (this.props.LimitClicks && (this.state.number_of_clicks === this.props.LimitCLicksNumber))) {
            return (
                <button style={{backgroundColor: BTN_Finish_BACKCOLOR}} onClick={this.props.Forward} className='RM_button'>Finish</button>
            )
        }
        return (
            <>
                {final_btn && (
                    <button onClick={this.onClickFinal}
                            style={{backgroundColor: BTN_FinalD_BACKCOLOR}}
                            className={'RM_button ' + (this.state.choose_index === null ? 'disabledElem' : '')}
                    >Final Decision
                    </button>
                )}
                <button style={{backgroundColor: BTN_NewMatrices_BACKCOLOR}} onClick={this.onClickNextPuzzle} className={'RM_button ' + (this.state.final_decision === null? 'disabledElem': '')}>Next New Matrix</button>
            </>
        );
    }

    render() {
        if (this.state.loading)
            return <WaitForAction2 />;

        let disableExploreNew = false;

        if (this.props.LimitClicks)
            disableExploreNew = this.props.LimitCLicksNumber === this.state.number_of_clicks;

        if (this.props.Stage === 1){
            disableExploreNew = this.state.final_decision !== null;
        }
        else {
            if (this.props.Mode !== 'Goto'){
                disableExploreNew = this.state.final_decision !== null;
            }
            else {
                disableExploreNew = RealMatricesValues[this.state.currentMatrixValues.IndexInMatricesValues].FinalIndexChanged;
            }
        }

        const currentMatrixValues = this.state.currentMatrixValues;
        const currentMatrix = MatBank[currentMatrixValues.RealIndex];

        let no_more_clicks = false;
        if (this.props.LimitClicks)
            no_more_clicks  = this.props.LimitCLicksNumber === this.state.number_of_clicks;

            return (
            <>
                <div
                    className='RM_Game'
                >
                    <div
                        className='RM_BoardR'
                    >
                        <div className='RM_BoardRL'>
                            <label><b>Revealed square {this.state.number_of_clicks} {this.props.LimitClicks ? `out of ${this.props.LimitCLicksNumber}` : ''}</b></label>
                            <RealSideText
                                Stage={this.props.Stage}
                                Mode={this.props.Mode}
                                LimitCLicksNumber={this.props.LimitCLicksNumber}
                                number_of_clicks={this.state.number_of_clicks}
                            />
                        </div>
                        <Matrix
                            setWaitForAction={this.props.setWaitForAction}
                            no_more_clicks={no_more_clicks}
                            finalIndex={this.state.final_decision}
                            chooseIndex={this.state.choose_index}
                            disableExploreNew={disableExploreNew}
                            currentMatrixItem={MatBank[this.state.currentMatrixValues.RealIndex]}
                            currentMatrixValues={this.state.currentMatrixValues}
                            disableClicks={this.state.disable_clicks}
                            onClickCallback={this.onClickCallback}
                            refHeight={false}
                        />
                    </div>
                    <div
                        className='RM_SideBtn'
                    >
                        {
                            this.props.Stage === 1 && this.stage1_Btn()
                        }

                        {
                            this.props.Stage === 2 && ReversibleMode && this.props.Mode === 'Goto' && this.stage2_r_goto_Btn()
                        }

                        {
                            this.props.Stage === 2 && ReversibleMode && this.props.Mode !== 'Goto' && this.stage2_r_new_Btn()
                        }

                        {
                            this.props.Stage === 2 && !ReversibleMode && this.stage2_nr_Btn()
                        }
                        {
                            this.props.Stage === 2 && GameSet.stage2_obligatory !== 'Yes' && (
                                <button style={{backgroundColor: BTN_Finish_BACKCOLOR}} onClick={this.onClickStageTwo} className='RM_button'>Finish</button>
                            )
                        }
                    </div>
                </div>
                {DebugMode && this.state.debug_row && (
                    <DebuggerModalView>
                        <div className='rm_debug'>
                            <div>
                                <label>Stage:<span>{this.props.Mode}</span></label>
                                <label>Part:<span>{this.props.Stage}</span></label>
                                <label>Condition: <span>{ReversibleMode? 'Reversible' : 'Irreversible'}</span></label>
                            </div>
                            <div className='rm_debug_nv'>
                                <label><span style={{color: 'blue', marginTop: 10}}>New value:</span></label>
                                <label>Random number: <span>{this.state.debug_row.random_number !== '' ? Math.floor(this.state.debug_row.random_number*1000)/1000 : ''}</span></label>
                                <label>Value: <span>{this.state.debug_row.dist_choose.value}</span></label>
                                <label>Prob: <span>{this.state.debug_row.dist_choose.prob}</span></label>
                            </div>

                            <div className='rm_debug_cm'>
                                <label><span style={{color: 'blue', marginTop: 10}}>Current matrix:</span></label>
                                <label>Real index: <span>{currentMatrixValues.RealIndex}</span></label>
                                {
                                    currentMatrix.dist.map(
                                        (cm_dist, index) => (
                                            <div key={'div' + index}>
                                                <label key={'l1' + index}>Value: <span>{cm_dist.value}</span></label>
                                                <label key={'l2' + index}>Prob: <span>{cm_dist.prob}</span></label>
                                            </div>
                                        )
                                    )
                                }
                            </div>

                            <div className='rm_debug_rec'>
                                <label><span style={{color: 'blue', marginTop: 10}}>Records:</span></label>
                                <label>Part:<span>{this.state.debug_row.Part}</span></label>
                                <label>Condition: <span>{this.state.debug_row.Condition}</span></label>
                                <label>StepPart: <span>{this.state.debug_row.StepPart}</span></label>
                                <label>MatrixAppear: <span>{this.state.debug_row.MatrixAppear}</span></label>
                                <label>MatrixSerialNum: <span>{this.state.debug_row.MatrixSerialNum}</span></label>
                                <label>MatrixGroup: <span>{this.state.debug_row.MatrixGroup}</span></label>
                                <label>StepMatrix: <span>{this.state.debug_row.StepMatrix}</span></label>
                                <label>Mode: <span>{this.state.debug_row.Mode}</span></label>
                                <label>NCols: <span>{this.state.debug_row.NCols}</span></label>
                                <label>NRows: <span>{this.state.debug_row.NRows}</span></label>
                                <label>Col: <span>{this.state.debug_row.Col}</span></label>
                                <label>Row: <span>{this.state.debug_row.Row}</span></label>
                                <label>Value: <span>{this.state.debug_row.Value}</span></label>
                                <label>SquareRevealedLast: <span>{this.state.debug_row.SquareRevealedLast}</span></label>
                                <label>SquareRevealedMax: <span>{this.state.debug_row.SquareRevealedMax}</span></label>
                                <label>DistMax: <span>{this.state.debug_row.DistMax}</span></label>
                                <label>HighestClick: <span>{this.state.debug_row.HighestClick}</span></label>
                                <label>AdditionalClick: <span>{this.state.debug_row.AdditionalClick}</span></label>
                                <label>DecisionNew: <span>{this.state.debug_row.DecisionNew}</span></label>
                                <label>ChangesMat: <span>{this.state.debug_row.ChangesMat}</span></label>
                            </div>
                        </div>
                    </DebuggerModalView>
                )}

                {
                    this.state.text_input_error && (
                        <ErrorWarning>
                            <div style={{display: 'grid', gridRowGap: '1rem'}}>
                                <label>Notice you have used half of your moves in the current matrix.</label>
                                <label>Please note that you can use your remaining moves in the current matrix or move to a new matrix.</label>
                            </div>
                            <button onClick={() => this.setState({text_input_error: false})}>OK</button>
                        </ErrorWarning>
                    )
                }
            </>
        )
    }
}

const MatrixView = ({matrix_values, RM_MatViewDown, setWaitForAction}) => {
    return useMemo(() => {
        return (
            <Matrix
                MatrixView={true}
                setWaitForAction={setWaitForAction}
                finalIndex={matrix_values.FinalIndex}
                chooseIndex={matrix_values.FinalIndex}
                disableExploreNew={true}
                currentMatrixItem={MatBank[matrix_values.RealIndex]}
                currentMatrixValues={matrix_values}
                onClickCallback={() => {
                }}
                disableClicks={true}
                refHeight={true}
                RM_MatViewDown={RM_MatViewDown}
            />
        )
    }, [matrix_values, RM_MatViewDown, setWaitForAction]);
}

class MatricesViewMode extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;

        this.first_show = true;
        // this.props.insertGameLine
        // this.props.Forward
        // this.props.Stage

        this.state = {
            loading: false,
            selected_indexes: [],
            non_reversible_step: 0,
            reversible_step: 0,
            mode: 'View', // 'Explore' 'GoTo'
        };

        this.number_clicks = 0;

        this.matOnClick = this.matOnClick.bind(this);
        this.onClickFinish = this.onClickFinish.bind(this);
        this.cellClickCallBack = this.cellClickCallBack.bind(this);
        this.MatMode = this.MatMode.bind(this);
        this.ViewMode = this.ViewMode.bind(this);
        this.getNumberOfClicksDone = this.getNumberOfClicksDone.bind(this);
        this.ReverseFirstPage = this.ReverseFirstPage.bind(this);
        this.ViewModeClick = this.ViewModeClick.bind(this);

        // this.makeTestMat();

        this.RM_MatViewDown = React.createRef();

    }

    cellClickCallBack(){
        this.number_clicks++;
    }

    makeTestMat(){
        for (let i=0; i<2; i++){
            let real_index = 6;
            RealMatricesValues.push( {
                Indexes: [],
                ValueByIndex: {},
                RealIndex: real_index,
                FinalIndex: null,
                IndexInMatricesValues: RealMatricesValues.length
            })

            const selected_mat = MatBank[real_index];
            const mat_size = Number(selected_mat.size.split('X')[0]) * Number(selected_mat.size.split('X')[1]);

            const random_selected = Math.floor(Math.random() * 10)+5;
            for (let j=0;j<random_selected;j++){
                let random_index_selected;

                do {
                    random_index_selected = Math.floor(Math.random() * mat_size);
                }
                while (RealMatricesValues[RealMatricesValues.length-1].Indexes.indexOf(random_index_selected) !== -1);

                RealMatricesValues[RealMatricesValues.length-1].Indexes.push(random_index_selected);
                const values = [9, 99, 999];
                const random_value = Math.floor(Math.random() * values.length);
                RealMatricesValues[RealMatricesValues.length-1].ValueByIndex[random_index_selected] = values[random_value];
            }
            const random_final = Math.floor(Math.random() * RealMatricesValues[RealMatricesValues.length-1].Indexes.length);

            RealMatricesValues[RealMatricesValues.length-1].FinalIndex = RealMatricesValues[RealMatricesValues.length-1].Indexes[random_final];
        }
    }

    ReversibleModeTextOld(){

        return (
            <>
                {
                    this.first_show ? (
                        <p>
                            You have finished the second part of the study! In the following part, you have an option to reveal additional {GameSet['stage2_clicks']} squares! You have two options (you can choose to divide your moves and exploit both options):<br/>
                        </p>
                    ) : (
                        <p>
                            <b>You have {GameSet['stage2_clicks'] - this.number_clicks} squares to reveal left out of the additional {GameSet['stage2_clicks']} squares!</b><br/>
                            You have two options (you can choose to divide your moves and exploit both options):<br/>
                        </p>
                    )
                }
                <ol>
                    <li>
                        <b>Reveal new matrices - </b>- to reveal numbers in new matrices, please press "New matrices".<br/>
                        You can choose to reveal as many new matrices as you would like using the additional {GameSet['stage2_clicks'] - this.number_clicks} moves.
                    </li>
                    <li><b>Go back to previous matrices – </b>you may choose to reveal more numbers in the matrices you have already seen and maybe change your choices by selecting another number as final decision. To go to a previous matrix, please select one of the matrices below and then press "Go to matrix". You can choose to change as many matrices as you would like.</li>
                </ol>
                <p>
                    After each click, you have the option to go back to this screen ("All Matrices").<br/>
                    {GameSet.stage2_obligatory !== 'Yes' && `You may also choose to not use some of the additional ${GameSet['stage2_clicks'] - this.number_clicks} reveals or any of them.`}
                    <br/>
                    When you are done, click "Finish".
                </p>
            </>
        )
    }

    ReversibleModeText(){
        // {GameSet['stage2_clicks'] - this.number_clicks}
        // {GameSet['stage2_clicks']}
        // GameSet.stage2_obligatory !== 'Yes'


        return (
            <>
                <span className='head'>Revisit part 1 matrices</span><br/>
                You may choose to reveal more numbers in the matrices you have already seen and maybe change your choices by selecting another number as final decision.<br/>
                To go to a matrix, please <b>double click on one of the matrices below</b>
            </>
        )
    }

    NotReversibleModeText(){
        // {GameSet['stage2_clicks'] - this.number_clicks}
        // {GameSet['stage2_clicks']}
        // GameSet.stage2_obligatory !== 'Yes'

        const msg1 = (
            <>
                <span className='head'>You have finished the second part of the study!</span><br/>
                We would like to know –<br/>
                If you could go back to certain matrices to reveal more numbers and maybe change your choices,<br/>
                which matrices would those be?<br/>
                <b>Please select from the matrices below, the matrices you would go back to if you could.</b><br/>
                You can select as many matrices as you want.<br/>
                When you are done, press "Next".
            </>
        );

        const msg2 = (
            <>
                <span className='head'>Thanks!</span><br/>
                In the following part, you have an option to reveal additional {GameSet['stage2_clicks']} squares!<br/>
                To reveal squares in new matrices, please press "New matrices".<br/>
                You can choose to reveal as many new matrices as you would like using the additional {GameSet['stage2_clicks']} moves.

                {
                    GameSet.stage2_obligatory !== 'Yes' && (
                        <>
                            You may also choose to not use some of the additional {GameSet['stage2_clicks']} moves or any of them.<br/>
                            When you are done, press "Finish".
                        </>
                    )
                }
            </>
        );

        if (this.state.non_reversible_step === 0)
            return msg1;
        else
            return msg2
    }

    NotReversibleModeTextOld(){

        const msg1 = (
            <p>
                You have finished the second part of the study!<br/>
                <br/>
                we would like to know –<br/>
                If you could go back to certain matrices to reveal more numbers and maybe change your choices,
                which matrices would those be?<br/>
                Please select the matrices you would go back to if you could from the matrices below.<br/>
                You can select as many matrices as you want.
                <br/>
                When you are done, click "Next".
            </p>
        );

        const msg2 = (
            <p>
                <b>Thanks!</b><br/><br/>
                In the second part of the study, you have an option to reveal additional {GameSet['stage2_clicks']} squares!<br/>
                You may reveal additional matrices - to sample new matrices, please press "New matrices".<br/>
                You can choose to reveal as many new matrices as you would like using the additional {GameSet['stage2_clicks']} moves.<br/>
                In each matrix, you may reveal as many numbers as you want until you set your decision.<br/>
                {GameSet.stage2_obligatory !== 'Yes' && `You may also choose to not use some of the additional ${GameSet['stage2_clicks']} moves or any of them.`}
                <br/>
                <br/>
                <br/>
                When you are done, click "Finish".
            </p>
        );

        if (this.state.non_reversible_step === 0)
            return msg1;
        else
            return msg2
    }

    componentDidMount() {
        // this.props.setWaitForAction(true);
        // setTimeout(() => {
        //     this.props.setWaitForAction(false);
        // }, 500);

    }

    matOnClick(index) {
        let sc = this.state;

        if (sc.selected_indexes.indexOf(index) === -1)
            if (ReversibleMode)
                sc.selected_indexes = [index];
            else
                sc.selected_indexes.push(index);
        else
            sc.selected_indexes = sc.selected_indexes.filter(index_ => index_ !== index);

        if (!ReversibleMode)
            MatChanged = [...sc.selected_indexes];

        let mat_changed = [...VisitMat];
        mat_changed.push(index);
        mat_changed = new Set(mat_changed);
        VisitMat = Array.from(mat_changed);

        if(ReversibleMode)
            sc.mode = 'Goto';

        this.setState(sc, () => {

        });
    }

    onClickFinish(){
        let sc = this.state;

        if (ReversibleMode || sc.non_reversible_step === 1){
            this.props.Forward();
        }
        else {
            sc.non_reversible_step++;
        }
        this.setState(sc);
    }

    getNumberOfClicksDone() {
        return this.number_clicks;
    }

    MatMode(){

        const Forward = () => {
            if (ReversibleMode){
                let sc = this.state;
                sc.mode = 'View';
                this.setState(sc, () => {
                    if (this.number_clicks === GameSet['stage2_clicks']){
                        this.props.Forward();
                    }
                });
            }
            else
                this.props.Forward();
        }

        return (
            <RealMode
                setWaitForAction={this.props.setWaitForAction}
                Forward={Forward}
                insertGameLine={this.props.insertGameLine}
                Stage={2}
                LimitClicks={GameSet['stage2_clicks_rule'] === 'Limit'}
                LimitCLicksNumber={GameSet['stage2_clicks']}
                NumOfClicks={this.number_clicks}
                getNumberOfClicksDone={this.getNumberOfClicksDone}
                cellClickCallBack={this.cellClickCallBack}
                Mode={this.state.mode}
                ViewModeClick={this.ViewModeClick}
                MatrixItem={this.state.mode === 'Explore' ? null : MatBank[RealMatricesValues[this.state.selected_indexes[0]].RealIndex]}
                MatrixValues={this.state.mode === 'Explore' ? null : RealMatricesValues[this.state.selected_indexes[0]]}
            />
        )
    }

    ViewModeClick(click_on) {
        this.setState({loading: true}, () => {
            let sc = this.state;
            sc.loading = false;
            if (GameSet['stage2_clicks'] === this.number_clicks)
                return this.setState(sc);

            if (click_on === 'Goto' && sc.selected_indexes.length === 0)
                return this.setState(sc);
            sc.mode = click_on;
            this.first_show = false;
            sc.loading = false;
            this.setState(sc);
        });
    }

    ViewMode() {
        // const finishBtnText = (ReversibleMode || this.state.non_reversible_step === 1) ? 'Finish' : 'Next';
        const showMatrices = this.state.non_reversible_step === 0;


        return (
            <div
                className='RM_MatView'
            >
                <div
                    className={this.state.non_reversible_step === 0 ? 'RM_MatViewUp1' : 'RM_MatViewUp2'}
                >
                    <div
                        className='RM_MatViewUpTxt'
                    >
                        <ResponsiveText
                            stageText={ReversibleMode? this.ReversibleModeText() : this.NotReversibleModeText()}
                        />
                    </div>
                    <div
                        className='RM_MatViewUpBtn'
                    >
                        {(ReversibleMode || this.state.non_reversible_step === 1) && (
                            <button
                                style={{backgroundColor: BTN_NewMatrices_BACKCOLOR}}
                                onClick={() => this.ViewModeClick('Explore')}
                                className={'RM_button ' + (GameSet['stage2_clicks'] === this.number_clicks?'disabledElem':'')}
                            >New Matrices</button>
                        )}

                        {(!ReversibleMode && this.state.non_reversible_step === 0) && (
                            <button
                                onClick={this.onClickFinish}
                                className={'RM_SideBtnNM RM_button'}
                            >Next</button>
                        )}

                        {
                            GameSet.stage2_obligatory !== 'Yes' && (
                                <button
                                    style={{backgroundColor: BTN_Finish_BACKCOLOR}}
                                    className='RM_button'
                                    onClick={this.onClickFinish}
                                >Finish
                                </button>
                            )
                        }

                    </div>
                </div>
                <div
                    className='RM_MatViewDown'
                    ref={this.RM_MatViewDown}
                >
                    {
                        showMatrices && (
                            RealMatricesValues.map(
                                (matrix_values, index_) => {
                                    if (matrix_values.Stage === 2)
                                        return <Fragment key={index_ + '###' + matrix_values.RealIndex}></Fragment>;

                                    const prevent_clicks = VisitMat.indexOf(index_) > -1;
                                    return (
                                        <div
                                            key={index_ + '###' + matrix_values.RealIndex}
                                            style={{cursor: 'pointer'}}
                                            className={(ReversibleMode && prevent_clicks ? 'prevent-events' : '') + (prevent_clicks ? ' RM_MatViewDownSelMathChanged ' : '') + (this.state.selected_indexes.indexOf(index_) > -1 || prevent_clicks ? ' RM_MatViewDownSelMath' : '')}
                                            onClick={ReversibleMode? undefined : () => this.matOnClick(index_)}
                                            onDoubleClick={!ReversibleMode? undefined : () => (prevent_clicks? undefined : this.matOnClick(index_))}
                                        >
                                            <MatrixView
                                                matrix_values={matrix_values}
                                                RM_MatViewDown={this.RM_MatViewDown}
                                                setWaitForAction={this.props.setWaitForAction}
                                            />
                                        </div>
                                    )
                                }
                            )
                        )
                    }
                </div>
            </div>
        )
    }

    ReverseFirstPage(){

        const onClick = on => {
            let sc = this.state;
            sc.reversible_step++;
            this.setState(sc, () => {
                if (on === 'NewMatrices'){
                    this.ViewModeClick('Explore')
                }
                else if (on === 'Finish'){
                    this.onClickFinish();
                }
                else
                    this.props.setWaitForAction(true);
            })
        }
        return (
            <div
                className='RM_RF'
            >
                <div className='RM_RF_h'>
                    <label>You have finished the second part of the study!</label>
                    <label>In the following part, you have an option to reveal additional {GameSet['stage2_clicks']} squares</label>
                    <label>You may use these moves in two ways (you can also choose to divide your moves between both options):</label>
                </div>

                <div className='RM_RF_b'>
                    <div>
                        <label>Option 1</label>
                        <button
                            style={{backgroundColor: BTN_NewMatrices_BACKCOLOR}}
                            onClick={() => onClick('NewMatrices')}
                        >New Matrices</button>

                        <div>
                            <label>Reveal new matrices</label>
                            <label>To reveal squares in new matrices, please press "New matrices".</label>
                        </div>
                    </div>

                    <div>
                        <label>Option 2</label>
                        <button
                            style={{backgroundColor: BTN_Part1Matrices_BACKCOLOR}}
                            onClick={() => onClick('AllMat')}
                        >Part 1 matrices</button>

                        <div>
                            <label>Go back to previous matrices</label>
                            <label>To reveal more squares in the matrices you have already seen and change your choices by selecting another number as final decision,
                                please press "Part 1 Matrices".
                            </label>
                        </div>
                    </div>

                </div>

                <div className='RM_RF_f'>
                    <label><b>At each step, both options will appear on the screen</b></label>
                    {
                        GameSet.stage2_obligatory !== 'Yes' && (
                            <>
                                <label>
                                    You may also choose to not use some of the additional {GameSet['stage2_clicks']} moves or any of them.<br/>
                                    When you are done, press "Finish".
                                </label>
                                <button
                                    style={{backgroundColor: BTN_Finish_BACKCOLOR}}
                                    onClick={() => onClick('Finish')}
                                >Finish</button>
                            </>
                        )
                    }
                </div>
            </div>
        )
    }

    render() {
        if (this.state.loading) return <></>;

        if (ReversibleMode && this.state.reversible_step === 0)
            return this.ReverseFirstPage();

        if (this.state.mode === 'View')
            return this.ViewMode();

        return this.MatMode();

    }
}

const Timer = ({Next}) => {

    const [timeLbl, setTimeLbl] = useState('3');

    useEffect(() => {

        setTimeout(() => {
            if (timeLbl === 'Go!') {
                Next();
            }
            else {
                let lbl = Number(timeLbl)-1;
                if (lbl === 0)
                    lbl = 'Go!'
                setTimeLbl(lbl.toString());
            }
        }, 1000);
    }, [timeLbl, Next]);
    return (
        <label
            className='RM_MT_t mid RM_MT_l_box'
        >
            {timeLbl}
        </label>
    )
}

const getMem = trial => {
    const mem_real_index = MemTaskOrder[trial];

    return {
        mem: GameSet.mem_task[mem_real_index],
        real_index: mem_real_index
    };
}

const ShowLetters = ({practice, Next, trial}) => {

    const [showLetters, setShowLetters] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setShowLetters(false);
            setTimeout(() => {
                Next();
            }, 1500);
        }, GameSet.l_s * 1000);
    }, [Next]);

    const letters = practice? PracticeMem[trial] : getMem(trial).mem;

    return (
        <div
            className={'RM_MT_sl ' + (showLetters?'mid':'full')}
        >
            {
                showLetters && letters.map(
                    (letter, letter_i) => (
                        <label
                            className='RM_MT_l_box'
                            key={letter_i}
                        >
                            {letter}
                        </label>
                    )
                )
            }
        </div>
    )
}

const InsertLetters = ({practice, Next, trial}) => {

    const [letters, setLetters] = useState((new Array(practice ? PracticeMem[trial].length : getMem(trial).mem.length).fill('')))

    useEffect(() => {
        if (!practice)
            MemoryTaskValues[trial] = (new Array(getMem(trial).mem.length).fill(''));
    }, [practice, trial]);

    const changeLetter = (l_index, val) => {
        const letters_ = [...letters];

        letters_[l_index] = val;

        if (practice)
            PracticeMemAnswer[trial][l_index] = val;
        else
            MemoryTaskValues[trial][l_index] = val;

        setLetters(letters_);
    }

    const nextBtn = () => {

        if (practice){
            Next();
            return;
        }
        const current_mem = getMem(trial);
        const mem_val = current_mem.mem;
        const mem_index = current_mem.real_index;
        let mem_values = MemoryTaskValues[trial];
        for (let i=0; i<mem_values.length; i++)
            if (mem_values[i] === '')
                mem_values[i] = '?';

        const obj = {
            trial: trial+1,
            task_id: mem_index,
            task: mem_val.join(' '),
            memory: mem_values.join(' '),
        }
        MemTaskData.push(obj);
        Next();
    }

    return (
        <div
            className='RM_MT_il mid'
        >
            <div className='RM_MT_il_1'>
                {
                    letters.map(
                        (letter, letter_i) => (
                            <input
                                maxLength={2}
                                className='RM_MT_l_box'
                                key={letter_i}
                                onChange={e => {
                                    let last_input = '';
                                    try {
                                        last_input = e.target.value;
                                        // last_input = e.target.value.charAt(e.target.value.length-1);
                                    }
                                    catch (e) {

                                    }
                                    changeLetter(letter_i, last_input);
                                }}
                                value={letter}
                            />
                        )
                    )
                }
            </div>

            <div className='RM_MT_il_2'>
                <label>Please fill in the numbers\letters you remember in the correct places.</label>
                <label>If you don’t remember a letter\number, please keep the square empty.</label>
                <label>When you have finished, press "Next"</label>
            </div>
            <button onClick={nextBtn}>Next</button>
        </div>
    )
}

class MemoryTask extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.practice = this.props.Practice;
        this.state = {
            loading: false,
            trial: 0,
            step: 0,
            finish_msg: false
        };
    }

    FinishDemo(){
        const next = () => {
            let sc = this.state;
            sc.practice = false;
            sc.finish_msg = false;
            this.setState(sc);
        }
        return (
            <div className='finish_demo'>
                <label>Great!</label>
                <label className='a'>The characters you have seen: <span>{PracticeMem.map(pm=><span key={pm}>{pm}</span>)}</span></label>
                <label className='b'>The characters you have inserted: <span>{PracticeMemAnswer.map(pm=><span style={{color: pm === '' ? 'white' : 'orangered'}} key={pm}>{!pm.localeCompare('') ? '?' : pm}</span>)}</span></label>
                <label>Now you will begin the memory game,</label>
                <label>Good luck!!!</label>
                <button onClick={next}>Next</button>
            </div>
        )
    }

    Next = () => {
        let sc = this.state;
        if (sc.step === 2){
            sc.step = 0;
            if (this.practice){
                // sc.finish_msg = true;
                if (sc.trial === (PracticeMem.length-1)) {
                    return this.props.Forward();
                }
                else {
                    sc.trial++;
                }
            }
            else {
                if (sc.trial === (GameSet.mem_task.length-1)) {
                    return this.props.Forward();
                }
                else {
                    sc.trial++;
                }
            }
        }
        else {
            sc.step++;
        }
        this.setState(sc);
    }

    render() {
        if (this.state.loading) return <></>;

        // if (this.state.finish_msg)
        //     return this.FinishDemo();

        if (this.state.step === 0)
            return <Timer Next={this.Next}/>;

        if (this.state.step === 1)
            return <ShowLetters practice={this.practice} Next={this.Next} trial={this.state.trial}/>;

        if (this.state.step === 2)
            return <InsertLetters practice={this.practice} Next={this.Next} trial={this.state.trial}/>;
    }
}

const ErrorWarning = ({children}) => {
  return (
      <div className='rm_text_input_error_c'>
          <div className='rm_text_input_error'>
              {children}
          </div>
      </div>
  )
}

class Start extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        ResetAll();

        UserId = props.user_id;
        RunningName = props.running_name;
        DebugMode = props.dmr;

        let RunCounter = KeyTableID();

        // ReversibleMode = false;
        ReversibleMode = (RunCounter%2) === 0;
        PaymentsSettings = props.game_settings.payments;
        MatBank = [...props.game_settings.game.matrices_bank];

        RestGroups(true);

        GameSet.num_of_mat = Number(props.game_settings.game.num_of_mat);
        GameSet.num_of_mat_rule = props.game_settings.game.num_of_mat_rule;
        GameSet.stage1_clicks = Number(props.game_settings.game.stage1_clicks);
        GameSet.stage1_clicks_rule = props.game_settings.game.stage1_clicks_rule;
        GameSet.stage2_clicks = Number(props.game_settings.game.stage2_clicks);
        GameSet.stage2_clicks_rule = props.game_settings.game.stage2_clicks_rule;
        GameSet.skip_matrix_btn = props.game_settings.game.skip_matrix_btn;
        GameSet.stage2_obligatory = props.game_settings.game.stage2_obligatory;
        GameSet.sampling_delay = Number(props.game_settings.game.sampling_delay);
        GameSet.l_s = Number(props.game_settings.game.l_s);
        GameSet.mem_task = props.game_settings.game.mem_task;
        // GameSet.colors = props.game_settings.game.colors;

        GameSet.practice_matrices = props.game_settings.game.pm_bank;

        GREEN_MATRIX_INDEX = 1;

        PracticeMatrixValues = [
            {
                Indexes: [],
                ValueByIndex: {},
                FinalIndex: null
            },
            {
                Indexes: [],
                ValueByIndex: {},
                FinalIndex: null,
                FinalValue1: null,
                FinalValue2: null,
            },
            {
                Indexes: [],
                ValueByIndex: {},
                FinalIndex: null
            },
        ];

        function convertColor(color_obj){
            return `rgba(${color_obj.r}, ${color_obj.g}, ${color_obj.b}, ${color_obj.a})`;
        }
        // PracticeGreenMatrix = convertColor(GameSet.colors[1]);
        // PracticeEmptyMatrix = convertColor(GameSet.colors[4]);

        PracticeMatrixItem = [];

        for (let i=0; i<(GameSet.practice_matrices.length-1); i++){
            PracticeMatrixItem.push({
                dist: GameSet.practice_matrices[i].dist.map(dist => ({value: Number(dist), prob: 1})),
                dist_length: GameSet.practice_matrices[i].dist.length,
                dist2: GameSet.practice_matrices[i].dist2 ? GameSet.practice_matrices[i].dist2.map(dist => ({value: Number(dist), prob: 1})) : null,
                size: "5X5",
                MatColor: convertColor(GameSet.practice_matrices[i].MatColor)
            })
        }


        PracticeEmptyMatrixValues = {
            Indexes: [],
            ValueByIndex: {},
            FinalIndex: null
        };

        PracticeEmptyMatrixItem = {
            dist: GameSet.practice_matrices[GameSet.practice_matrices.length-1].dist.map(dist => ({value: Number(dist), prob: 1})),
            size: "5X5",
            MatColor: convertColor(GameSet.practice_matrices[GameSet.practice_matrices.length-1].MatColor)
        };

        MemoryTaskValues = (new Array(GameSet.mem_task.length).fill([]));

        this.Forward = this.Forward.bind(this);
        this.initializeGame = this.initializeGame.bind(this);

        this.state = {
            tasks_index: 0,
            isa: props.isa,
            isLoading: true,
            text_input_error: false
        };

        this.game_template = null;
        this.props.SetLimitedTime(false);

        this.initializeGame();
    }

    initializeGame1() {

        let game_template = [];

        game_template.push({
            Mode: 'Message',
            Of: 'GameWelcome',
            Message: GameWelcome,
            Button: 'Start practice'
        });

        try {
            const mem_task = GameSet.mem_task;
            if (Array.isArray(mem_task) && mem_task.length > 0) {
                // MemTaskOrder = (new Array(GameSet.mem_task.length)).fill('');
                let all_indexes = ((new Array(GameSet.mem_task.length)).fill('')).map((a, b) => b);
                do {
                    let rnd_index = Math.floor(Math.random() * all_indexes.length);
                    MemTaskOrder.push(all_indexes[rnd_index]);
                    all_indexes = all_indexes.filter((a,b) => b !== rnd_index);
                }
                while (all_indexes.length > 0);

                game_template.push({
                    Mode: 'Message',
                    Of: 'MemTaskIntro',
                    Message: MemTaskIntro,
                    Button: 'Next'
                });

                game_template.push({
                    Mode: 'MemoryTask',
                });

                game_template.push({
                    Mode: 'Message',
                    Of: 'SecondPartEnd',
                    Message: SecondPartEnd,
                    Button: 'Next'
                });
            }
        }
        catch (e) {

        }

        this.game_template = game_template;
    }

    initializeGame() {

        let game_template = [];

        game_template.push({
            Mode: 'Message',
            Of: 'GameWelcome',
            Message: GameWelcome,
            Button: 'Start practice'
        });

        game_template.push({
            Mode: 'Game',
            Level: 'Practice',
        });

        game_template.push({
            Mode: 'Message',
            Of: 'PracticeEnd1',
            Message: PracticeEnd1,
            Button: 'Next'
        });

        game_template.push({
            Mode: 'MemoryTask',
            Practice: true
        });

        game_template.push({
            Mode: 'Message',
            Of: 'PracticeEnd2',
            Message: PracticeEnd2,
            Button: 'Next'
        });
        if (!ReversibleMode) {
            // game_template.push({
            //     Mode: 'Message',
            //     Of: 'PracticeEndIrreversible',
            //     Message: PracticeEndIrreversible,
            //     Button: 'Next'
            // });

            // game_template.push({
            //     Mode: 'EMPTY_MAT',
            // });
        }
        else {
            // game_template.push({
            //     Mode: 'PracticeMatricesView',
            // });
        }

        game_template.push({
            Mode: 'PracticeMatricesView',
        });

        game_template.push({
            Mode: 'Message',
            Of: 'PracticeEnd',
            Message: PracticeEnd,
            Button: 'Next'
        });

        game_template.push({
            Mode: 'Game',
            Level: 'Real',
            Stage: 1
        });

        try {
            const mem_task = GameSet.mem_task;
            if (Array.isArray(mem_task) && mem_task.length > 0) {
                // MemTaskOrder = (new Array(GameSet.mem_task.length)).fill('');
                let all_indexes = ((new Array(GameSet.mem_task.length)).fill('')).map((a, b) => b);
                do {
                    let rnd_index = Math.floor(Math.random() * all_indexes.length);
                    MemTaskOrder.push(all_indexes[rnd_index]);
                    all_indexes = all_indexes.filter((a,b) => b !== rnd_index);
                }
                while (all_indexes.length > 0);

                game_template.push({
                    Mode: 'Message',
                    Of: 'MemTaskIntro',
                    Message: MemTaskIntro,
                    Button: 'Next'
                });

                game_template.push({
                    Mode: 'MemoryTask',
                    Practice: false
                });

                game_template.push({
                    Mode: 'Message',
                    Of: 'SecondPartEnd',
                    Message: SecondPartEnd,
                    Button: 'Next'
                });
            }
        }
        catch (e) {

        }

        game_template.push({
            Mode: 'MatricesView'
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
                local_t: getTimeDate().time,
                local_d: getTimeDate().date,
            },
        }).then((res) => this.setState({isLoading: false}));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isa !== this.props.isa){
            let sc = this.state;
            sc.isa = this.props.isa;
            this.setState(sc);
        }
    }

    Forward(){
        let sc = this.state;

        if (sc.tasks_index === (this.game_template.length-1)){
            this.props.SetLimitedTime(false);

            let game_points = RealMatricesValues.reduce((total, num) => total + (Number(num.FinalValue2) || Number(num.FinalValue1) || 0), 0);

            let avg_points = Math.floor((game_points/RealMatricesValues.length)*100)/100;
            let exchange_ratio = PaymentsSettings.exchange_ratio;

            let bonus = PaymentsSettings.bonus_endowment;
            bonus = bonus + Math.floor((avg_points/exchange_ratio)*100)/100

            let total_pay = Math.floor((bonus + PaymentsSettings.show_up_fee)*100)/100;


            let debug_args = null;
            if (DebugMode) {
                let all_values = RealMatricesValues.map(rmv => ({
                    Stage: rmv.Stage,
                    FinalValue1: rmv.FinalValue1,
                    FinalValue2: rmv.FinalValue2,
                }));

                debug_args = {
                    all_values,
                    game_points,
                    total_matrix: RealMatricesValues.length,
                    avg_points,
                    exchange_ratio,
                    bonus: Math.floor((game_points/RealMatricesValues.length)*100)/100,
                    bonus_endowment: PaymentsSettings.bonus_endowment,
                    total_bonus: bonus,
                    total_pay,
                }
            }

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
                    total_payment: total_pay,
                    local_t: current_time.time,
                    local_d: current_time.date,
                },
            }).then((res) => {});

            this.props.insertPayment({
                game_points,
                total_matrix: RealMatricesValues.length,
                avg_points,
                sign_of_reward: PaymentsSettings.sign_of_reward,
                show_up_fee: PaymentsSettings.show_up_fee,
                exchange_ratio: PaymentsSettings.exchange_ratio,
                bonus_endowment: PaymentsSettings.bonus_endowment,
                bonus: bonus,
                total_payment: total_pay,
                Time: current_time.time,
                Date: current_time.date
            });
            this.props.insertMoreRecords('mem_task', MemTaskData);

            sc.isLoading = true;
            this.setState(sc, () => {
                this.props.sendGameDataToDB().then(
                    () => {
                        NewLogs({
                            user_id: UserId,
                            exp: ThisExperiment,
                            running_name: RunningName,
                            action: 'G.E.S',
                            type: 'LogGameType',
                            more_params: {
                                game_points,
                                bonus,
                                total_payment: total_pay,
                                local_t: current_time.time,
                                local_d: current_time.date,
                            },
                        }).then((res) => {});
                        this.props.callbackFunction('FinishGame', {need_summary: true, args: debug_args});
                    }
                );
            });
        }
        else {
            if (sc.tasks_index === 0){
                const TextInput = this.props.getTextInput('TextInput');
                const word = ReversibleMode? 'Reversible' : 'Irreversible';

                if (TextInput.toLowerCase() !== word.toLowerCase()){
                    sc.text_input_error = true;
                    return this.setState(sc);
                }
            }
            AT_LEAST_ONE_MATRIX_PART_1 = false;
            AT_LEAST_ONE_MATRIX_PART_2 = false;
            sc.tasks_index++;
            if (this.game_template[sc.tasks_index].Mode === 'MatricesView' || (this.game_template[sc.tasks_index].Mode === 'Game' && this.game_template[sc.tasks_index].Level === 'Real'))
                this.props.SetLimitedTime(true);
            else
                this.props.SetLimitedTime(false);
        }
        this.setState(sc);
    }

    render() {
        if (!this.state || this.state.isLoading)
            return <WaitForAction2/>;

        const Mode = this.game_template[this.state.tasks_index].Mode;
        const ModeProps = this.game_template[this.state.tasks_index];

        return (
            <div
                className='RM_main unselectable'
            >
                {
                    this.state.text_input_error && (
                        <ErrorWarning>
                            <label>Please carefully read again before proceeding to the next page.</label>
                            <button onClick={() => this.setState({text_input_error: false})}>OK</button>
                        </ErrorWarning>
                    )
                }
                {Mode === 'Message' && (
                    <Messages
                        Message={ModeProps.Message}
                        setWaitForAction={this.props.setWaitForAction}
                        insertTextInput={this.props.insertTextInput}
                        ClassAdd={ModeProps.Of === 'GameWelcome' ? 'rm_gw-m' : ''}
                        Button={ModeProps.Button}
                        Forward={this.Forward}
                    />
                )}

                {Mode === 'Game' && (

                    ModeProps.Level === 'Real'? (
                        <RealMode
                            setWaitForAction={this.props.setWaitForAction}
                            Forward={this.Forward}
                            insertGameLine={this.props.insertGameLine}
                            Stage={ModeProps.Stage}
                            LimitClicks={GameSet['stage1_clicks_rule'] === 'Limit'}
                            LimitCLicksNumber={GameSet['stage1_clicks']}
                            NumOfClicks={0}
                            Mode='Explore'
                            MatrixItem={null}
                            MatrixValues={null}
                        />
                    ): (
                        <PracticeMode
                            setWaitForAction={this.props.setWaitForAction}
                            Forward={this.Forward}
                            insertGameLine={this.props.insertGameLine}
                        />
                    )
                )}

                {Mode === 'MatricesView' && (
                    <MatricesViewMode
                        setWaitForAction={this.props.setWaitForAction}
                        Forward={this.Forward}
                        insertGameLine={this.props.insertGameLine}
                    />
                )}

                {Mode === 'PracticeMatricesView' && (
                    <PracticeReversibleViewMode
                        setWaitForAction={this.props.setWaitForAction}
                        Forward={this.Forward}
                    />
                )}

                {Mode === 'MemoryTask' && (
                    <MemoryTask
                        Practice={ModeProps.Practice}
                        setWaitForAction={this.props.setWaitForAction}
                        Forward={this.Forward}
                    />
                )}
            </div>
        );
    }
}

Start.propTypes = {
    game_settings: PropTypes.object,
};

export default Start;

const GameWelcome = ({insertTextInput}) => {
    const [fontSize, setFontSize] = useState('20');
    let textRef = useRef(null);

    const handleResize = () => {
        let f_s = adjustFont(textRef);
        setFontSize(f_s);
    };

    useEffect(() => {
        if (!textRef)
            return () => {
                window.removeEventListener('resize', handleResize);
            }

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        }

    }, [textRef]);

    // const gameMatNumber = GameSet.num_of_mat_rule === 'NoLimit' ? '' : `, but you may reveal only ${GameSet.num_of_mat} squares throughout the experiment`;
    // const stage1MatNumber = GameSet.stage1_clicks_rule === 'NoLimit' ? '' : <>In the first part of the experiment, you have <b>{GameSet.stage1_clicks} moves</b>, which means you can reveal <b>{GameSet.stage1_clicks} squares</b>.</>;
    // const stage2MatNumberReversible = GameSet.stage1_clicks_rule === 'NoLimit' ? '' : <>In the second part, you will get additional <b>{GameSet.stage2_clicks} moves</b>. You will be able to use these additional moves to return to previous matrices or to reveal new matrices <b>or</b> both.</>;
    // const stage2MatNumberIReversible = GameSet.stage1_clicks_rule === 'NoLimit' ? '' : <>In the second part, you will get additional <b>{GameSet.stage2_clicks} moves</b>. You will be able to use these additional moves to reveal new matrices.</>;

    const reverseText = ReversibleMode? ' your choices are reversible -  You will be able to get back to each of the matrices later, continue searching and change your final decisions.' : ' your choices are irreversible - You will not be able to change the number you choose in each matrix.';

    return (
        <div
            className='rm_gw'
        >
            <p
                ref={textRef}
                style={{
                    fontSize,
                }}
            >
                <><span style={{fontSize: 'larger'}}><b>Welcome to the "Game of Matrices"!</b></span></><br/>
                <b>Please read carefully the following instructions:</b><br/>
                This study examines how people search and make decisions.<br/>
                Show up fee for completing the study is <b>{PaymentsSettings.sign_of_reward}{PaymentsSettings.show_up_fee}</b>, but in addition there are performance-based <b>bonuses!</b><br/>

                At the beginning of each round, a matrix with empty squares will be presented on the screen. Behind each square, there is a number.
                You can press the squares to reveal their value. Once you believe you searched enough in a matrix,
                please choose the highest revealed number and press the "final decision" button.
                The number you chose will be saved to calculate your bonus, and you will proceed to the next matrix
                <br/><br/>
                {/*At the end of the study, the average of the numbers you chose in each matrix will determine your bonus payment, that is – you should try to choose the highest value in each matrix. Bonus is calculated in exchange ratio of {PaymentsSettings.exchange_ratio} for every point earned in the game.<br/><br/>*/}
                At the end of the study, the numbers you chose in each matrix will determine your bonus payment, the higher the number are – the higher will be your bonus!<br/><br/>

                <span style={{color: 'red', fontWeight: 'bold'}}>Notice:{reverseText}</span>
                <br/>
                <br/>
                In the first part of the experiment, you have <b>{GameSet.stage1_clicks} moves</b>, which means you can reveal <b>{GameSet.stage1_clicks} squares</b>.<br/>
                In the second part, you will be completing a memory task.<br/>
                In the third part, you will get additional <b>{GameSet.stage2_clicks} moves</b>.<br/>
                {ReversibleMode? <>You will be able to use these additional moves to return to previous matrices or to reveal new matrices <b>or</b> both.</> : <>You will be able to use these additional moves to reveal new matrices.</>}<br/>

                Please write the word "{ReversibleMode? 'Reversible' : 'Irreversible'}" in the comment box below, then press start.
            </p>
            <div className='sp-m-com'>
                <label><u>Comments:</u></label>
                <textarea onChange={e => insertTextInput('TextInput', e.target.value)}/>
            </div>
        </div>
    )
};

const PracticeEnd = () => {

    const remember = ReversibleMode ? (
        <>Your choices are reversible -  You will be able to get back to each of the matrices later, continue searching and change your final decisions.</>
    ) : (
        <>Your choices are irreversible - You will not be able to change the number you chose in each matrix.</>
    );

    return (
        <div
            className='MsgMode_PE'
        >
            <label>You have finished Practice!</label>
            <label><b>Remember:</b></label>
            <label>{remember}</label>
            <label>Choose the highest numbers to get higher bonuses!</label>
        </div>
    )
};

const SecondPartEnd = () => {

    return (
        <div
            className='MsgMode_SE'
        >
            <label>Great!</label>
            <br/>
            <label>You have finished the second part of the study.</label>
            <br/>
            <label>Now we will proceed to the third part of the study.</label>
        </div>
    )
};

const MemTaskIntro = () => {

    return (
        <div
            className='MsgMode_SE'
        >
            <label>Great!</label>
            <label>You have finished the first part of the study.</label>
            <label>In the following part, you will be playing a memory game.</label>
            <label>In each round, a list of characters (letters or numbers) will appear on the screen for {GameSet.l_s} second{GameSet.l_s !== 1 ? 's' : ''}.</label>
            <label>Try to memorize as many of them!</label>
            <label>Next, you will have to write each character that appeared on the screen in its appropriate place.</label>
            {/*<label>Let’s start from a quick practice…</label>*/}
        </div>
    )
};

const PracticeEnd1 = () => {

    return (
        <div
            className='MsgMode_SE'
        >
            <label>Practice</label>
            <br/>
            <label><b>
                In the real game, after you finish the first part you will be moved to a memory task.
            </b></label>
            <label>
                In each round, a list of characters will appear on the screen for 2 seconds.
            </label>

            <label>
                Try to memorize as many of them!
            </label>

            <label>
                next, you will have to write the characters that appeared in the blank spaces.
            </label>

            <label
                style={{
                    color: 'rgb(129,5,5)'
                }}
            >
                let’s continue practicing!
            </label>
        </div>
    )
};

const PracticeEnd2 = () => {

    return (
        <div
            className='MsgMode_SE'
        >
            <label>Practice</label>
            <br/>
            <label><b>
                In the real game, after you finished the memory task,
                You will be moved to the third part of the study.
            </b></label>

            <label
                style={{
                    color: 'rgb(129,5,5)'
                }}
            >
                let’s continue practicing!
            </label>
        </div>
    )
};
