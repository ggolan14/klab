import React, {Fragment, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import './gameStyles.css';
import $ from "jquery";
import {NewLogs} from "../../../actions/logger";
import {getTimeDate} from "../../../utils/app_utils";

const ThisExperiment = 'WordPuzzle';

let letters_selected_indexes = [];
let letters_founded_indexes = [];
let letters_selected_direction = null;
let letters_card = [];
let word_list = [];
let words_info = {};
let words_indexes = {};
let words_indexes_set = new Set();
let indexes_counter = {};
let puzzle_indexes_counter = {};
let puzzle_words_indexes = {};
let GAME_POINTS = 0;
let letters_references = {};
let UserId = 'empty';
let RunningName = '-';
let FoundedWordsCountPuzzle = 0, FoundedWordsCountTotal = 0;

let NumberOfDiagonalWords = 0, NumberOfVerticalWords = 0, NumberOfHorizontalWords = 0;

let NEXT_WORD = '';

let COORDINTAES = {
    x: 0,
    y: 0
};

const CoordinatesMouseMove = (e) => {
    COORDINTAES.x = e.clientX;
    COORDINTAES.y = e.clientY;
}

const ResetAll = () => {
    letters_selected_indexes = [];
    letters_founded_indexes = [];
    letters_selected_direction = null;
    letters_card = [];
    word_list = [];
    words_info = {};
    words_indexes = {};
    words_indexes_set = new Set();
    indexes_counter = {};
    puzzle_indexes_counter = {};
    puzzle_words_indexes = {};
    GAME_POINTS = 0;
    letters_references = {};
    UserId = 'empty';
    RunningName = '-';
    FoundedWordsCountPuzzle = 0;
    FoundedWordsCountTotal = 0;
    NumberOfDiagonalWords = 0;
    NumberOfVerticalWords = 0;
    NumberOfHorizontalWords = 0;
}

const getRandomLetter = () => {
    return String.fromCharCode(97 + Math.floor(Math.random() * 26))
};

const mouseMove = ({e, svgRef, setPoints}) => {
    let pt = svgRef.current.createSVGPoint();

    pt.x=e.clientX;
    pt.y=e.clientY;

    let loc=pt.matrixTransform(svgRef.current.getScreenCTM().inverse());

    setPoints({
        x: loc.x,
        y: loc.y,
    });
};

const checkTwoRoundIndexes = (index, puzzle_cols) => {
    let d = letters_selected_direction;
    let idx = letters_selected_indexes;

    if(d === 'horizontal'){
        if (idx.indexOf(index+1) > -1 && idx.indexOf(index-1) > -1)
            return true;
    }
    else if(d === 'vertical'){
        if (idx.indexOf(index+puzzle_cols) > -1 && idx.indexOf(index-puzzle_cols) > -1)
            return true;
    }
    else if(d === 'hypotenuse'){
        if (idx.indexOf(index+(puzzle_cols+1)) > -1 && idx.indexOf(index-(puzzle_cols+1)) > -1)
            return true;
    }
    return false;
}

const checkIndexInDirection = (new_index, puzzle_cols) => {
    let d = letters_selected_direction;
    let idx = letters_selected_indexes;
    let in_direction = null;

    for(let i=0; i< idx.length; i++){
        if(d === 'horizontal'){
            if (
                (Math.floor(idx[i]/puzzle_cols) === Math.floor(new_index/puzzle_cols))
                &&
                (idx[i] - new_index === 1 || idx[i] - new_index === -1)
            ){
                in_direction = true;
                break;
            }
        }
        else if(d === 'vertical'){
            if(
                idx[i] + puzzle_cols === new_index || idx[i] - puzzle_cols === new_index
            ){
                in_direction = true;
                break;
            }
        }
        else if(d === 'hypotenuse'){
            if(
                (idx[i] + (puzzle_cols+1) === new_index || idx[i] - (puzzle_cols+1) === new_index)
                &&
                (idx[i]%puzzle_cols - new_index%puzzle_cols === 1 || idx[i]%puzzle_cols - new_index%puzzle_cols === -1)
            ){
                in_direction = true;
                break;
            }
        }
    }

    return in_direction;
}

const getNewDirection = (puzzle, first_index, new_index, puzzle_cols) => {
    if(
        (Math.floor(first_index/puzzle_cols) === Math.floor(new_index/puzzle_cols))
        &&
        (first_index - new_index === 1 || first_index - new_index === -1)
    )
        return 'horizontal';

    if(
        first_index + puzzle_cols === new_index || first_index - puzzle_cols === new_index
    )
        return 'vertical';

    if(
        (first_index + (puzzle_cols+1) === new_index || first_index - (puzzle_cols+1) === new_index)
        &&
        (first_index%puzzle_cols - new_index%puzzle_cols === 1 || first_index%puzzle_cols - new_index%puzzle_cols === -1)
    )
        return 'hypotenuse';

    return null;
}

const getLetterCardByIndex = (index) => {
    return letters_card[index];
}

const getWordInfo = (word) => {
    return words_info[word];
}

const getWordsIndexes = () => {
    return JSON.parse(JSON.stringify(words_indexes));
}

const getIndexesCounter = () => {
    return JSON.parse(JSON.stringify(indexes_counter));
}

const AdminWordsHighlight = (e, word, highlight) => {

    let word_props = getWordInfo(word);

    for(let i=0; i<word_props.length; i++){
        let next_index = word_props.start_index + (word_props.steps === 1 ? i : i*word_props.steps);
        if(highlight)
            $('.puzzle-elem' + next_index)
                .addClass('wp-set-word-selected')
        else
            $('.puzzle-elem' + next_index)
                .removeClass('wp-set-word-selected')

    }
}

let handleCellClick = (e, i, letter_ref, puzzle, removeWordListLeft, word_list_left, selectWord) => {
    let classes = letter_ref.current.className.split(' ');

    if (letters_selected_indexes.indexOf(i) > -1){
        classes = classes.filter(
            m_class => m_class !== 'puzzle-elem-values-selected'
        );

        letters_selected_indexes = letters_selected_indexes.filter(
            ix => ix !== i
        );

        if(letters_selected_indexes.length < 2){
            letters_selected_direction = null;
        }
        else {
            let r = checkTwoRoundIndexes(i, puzzle.puzzle_cols);
            if(r){
                letters_selected_indexes = [];
                letters_selected_direction = null;

                // for(let i=0; i<letters_selected_indexes.length; i++){
                //     if (!$('.puzzle-elem' + letters_selected_indexes[i]).hasClass('puzzle-elem-word-found'))
                //         $('.puzzle-elem' + letters_selected_indexes[i]).css('z-index', 0);
                //     $('.puzzle-elem' + letters_selected_indexes[i]).removeClass('puzzle-elem-values-selected');
                // }
            }
        }

        letter_ref.current.className = classes.join(' ');
    }
    else {
        letters_selected_indexes.push(i);
        let direction = null;

        if(letters_selected_indexes.length === 2){
            let first_index = letters_selected_indexes[0];
            direction = getNewDirection(puzzle, first_index, i, puzzle.puzzle_cols);
            letters_selected_direction = direction;
        }
        else if (letters_selected_indexes.length > 2){
            direction = checkIndexInDirection(i, puzzle.puzzle_cols);
        }


        if(!direction || !letters_selected_indexes.length === 1){
            puzzle_indexes_counter = getIndexesCounter();
            puzzle_words_indexes = getWordsIndexes();
            for (let let_ref in letters_references){
                let let_ref_classes = letters_references[let_ref].current.className.split(' ');
                if (let_ref_classes.indexOf('puzzle-elem-values-selected') > -1){
                    let_ref_classes = let_ref_classes.filter(
                        let_ref_class => let_ref_class !== 'puzzle-elem-values-selected'
                    );
                    letters_references[let_ref].current.className = let_ref_classes.join(' ');
                }
            }

            $('.puzzle-elem-values').removeClass('puzzle-elem-values-selected');
            $('.puzzle-elem-values').css('z-index', 0);

            letters_selected_indexes = [i];
            letters_selected_direction = null;
        }
        classes.push('puzzle-elem-values-selected');

        if(puzzle_indexes_counter[i] && puzzle_indexes_counter[i].count > 0){
            puzzle_indexes_counter[i].words.forEach(
                word => {
                    if (word_list_left.indexOf(word) < 0) return;
                    let word_indexes = puzzle_words_indexes[word];
                    word_indexes = word_indexes.filter(
                        index => index !== i
                    );

                    puzzle_words_indexes[word] = word_indexes;

                    if(word_indexes.length<1){
                        let word_info = getWordInfo(word);
                        for(let k=0; k<word_info.length; k++){
                            let index = word_info.start_index + word_info.steps*k;
                            // $('.puzzle-elem' + index).addClass('puzzle-elem-word-found');
                            if (letters_founded_indexes.indexOf(index) < 0)
                                letters_founded_indexes.push(index);
                        }

                        // $('.puzzle-elem-values').removeClass('puzzle-elem-values-selected');

                        for (let let_ref in letters_references){
                            let let_ref_classes = letters_references[let_ref].current.className.split(' ');
                            if (let_ref_classes.indexOf('puzzle-elem-values-selected') > -1){

                                let_ref_classes = let_ref_classes.filter(
                                    let_ref_class => let_ref_class !== 'puzzle-elem-values-selected'
                                );

                                letters_references[let_ref].current.className = let_ref_classes.join(' ');
                            }
                        }
                        classes = classes.filter(
                            let_ref_class => let_ref_class !== 'puzzle-elem-values-selected'
                        );
                        letters_selected_indexes = [];
                        letters_selected_direction = null;
                        $('.puzzle-elem-values').removeClass('puzzle-elem-values-selected');
                        for (let k=0; k< letters_founded_indexes.length; k++){
                            $('.puzzle-elem' + letters_founded_indexes[k]).addClass('puzzle-elem-word-found');
                        }
                        selectWord('remove',word);
                        removeWordListLeft(word);
                        GAME_POINTS++;
                    }

                }
            );

            puzzle_indexes_counter[i].words = [];
            puzzle_indexes_counter[i].count = 0;
        }

        for (let k=0; k< letters_founded_indexes.length; k++){
            $('.puzzle-elem' + letters_founded_indexes[k]).css('z-index', 999);
        }

        letter_ref.current.className = classes.join(' ');
    }
}

const MakePuzzleElem = ({props, removeWordListLeft, word_list_left, words_selected, selectWord}) => {
    const {i, letter, pe, itsValues, cols_width, mode, puzzle} = props;
    const letterRef = useRef();
    const [zIndex, setZetIndex] = useState(letters_selected_indexes.indexOf(i) > -1 || letters_founded_indexes.indexOf(i) > -1 ? 999 : 0);
    useEffect(() => {

        if (letterRef)
            letters_references[i] = letterRef;
    }, [letterRef]);
    // wp-set-word-selected

    const letterDisplay = useMemo(() => {
        let found_index = false;
        // let arr_from = Array.from(words_indexes_set);

        for (let j=0; j<words_selected.length; j++){
            let indexes = words_indexes[words_selected[j]];

            if (indexes.indexOf(i) > -1)
                found_index = true;
        }

        return (
            <div
                className={'unselectable puzzle-elem puzzle-elem' + i + (itsValues? ' puzzle-elem-values ' : '') + (letters_selected_indexes.indexOf(i) > -1 ? ' puzzle-elem-values-selected ' : '') + (letters_founded_indexes.indexOf(i) > -1 ? ' puzzle-elem-word-found ' : '') + (found_index ? ' wp-set-word-selected ' : '')}
                key={'puzzle-elem'+i}
                ref={letterRef}
                onClick={pe === 'all' ? e => (
                    handleCellClick(e, i, letterRef, puzzle, removeWordListLeft, word_list_left, selectWord)
                ) : e => e.preventDefault()}
                style={{
                    pointerEvents: {pe},
                    zIndex: found_index ? 999 : zIndex,
                    fontSize: mode.toLowerCase() === 'demo' ? 'large' : ((cols_width / 2.6) + 'vw')
                }}
                cell-id={i}

            >
                {letter}
            </div>
        )
    }, [props, zIndex, letters_selected_indexes, letters_founded_indexes, words_selected]);

    useEffect(() => {
        if (letters_selected_indexes.indexOf(i) > -1 || letters_founded_indexes.indexOf(i) > -1){
            if (zIndex !== 999)
                setZetIndex(999);
        }
        else {
            if (zIndex !== 0)
                setZetIndex(0);
        }
    })
    return letterDisplay;
};

const PuzzleBoard = ({puzzle, game_settings, mode, removeWordListLeft, word_list_left, words_selected, selectWord}) => {
    // const [points, setPoints] = useState({x: 0, y: 0});
    const defines = useMemo(() => {
        const items = [], items2 = [];
        let cols_width = 100/puzzle.puzzle_cols;
        let rows_width = 100/puzzle.puzzle_rows;

        for(let i = 0; i < puzzle.puzzle_cols*puzzle.puzzle_rows; i++) {
            items.push({
                i,
                letter: getLetterCardByIndex(i),
                pe: 'all',
                itsValues: true,
                cols_width,
                mode,
                puzzle
            });
            items2.push({
                i,
                letter: '',
                pe: 'none',
                itsValues: false,
                cols_width,
                mode,
                puzzle
            });
            // items.push(MakePuzzleElem(i, getLetterCardByIndex(i), 'all', true, cols_width));
            // items2.push(MakePuzzleElem(i, '', 'none', false, cols_width));
        }

        let gridTemplateColumns = '';
        for(let i = 0; i < puzzle.puzzle_cols; i++) {
            gridTemplateColumns = gridTemplateColumns + ' ' + cols_width + '%';  //' 100px '
            // gridTemplateColumns = gridTemplateColumns + ' ' + cols_width + 'vw';  //' 100px '
        }

        let gridTemplateRows = '';
        for(let i = 0; i < puzzle.puzzle_rows; i++) {
            gridTemplateRows = gridTemplateRows + ' ' + rows_width + '%';  //' 100px '
            // gridTemplateRows = gridTemplateRows + ' ' + rows_width + 'vh';  //' 100px '
        }

        return {items, items2, gridTemplateColumns, gridTemplateRows}
    }, [puzzle, word_list_left, words_selected]);
    const svgRef = useRef();

    const cover = useMemo(() => {
        if (defines.items2)
            return defines.items2.map(
                item => {
                    return (
                        <div
                            className={'unselectable puzzle-elem puzzle-elem' + item.i }
                            key={'puzzle-elem'+item.i}
                            style={{
                                pointerEvents: 'none',
                            }}
                            cell-id={item.i}

                        >

                        </div>
                    )
                }
            )
    }, [puzzle, defines]);

    const setPoints = useCallback(new_points => {
        if (game_settings.magnifer_shape === 'Rect') {
            // for rect
            $(".polygon").attr('x', new_points.x-(game_settings.demo_magnifer_width/2));
            $(".polygon").attr('y', new_points.y-(game_settings.demo_magnifer_height/2));
        }
        else {
            // for circle
            $(".polygon").attr('cx', new_points.x);
            $(".polygon").attr('cy', new_points.y);
        }
    }, [puzzle]);

    return (
        <>
            <div
                className="wp-words-puzzle-values"
                style={{
                    gridTemplateColumns: defines.gridTemplateColumns,
                    gridTemplateRows: defines.gridTemplateRows
                }}
                onMouseMove={e => mouseMove({
                    e, svgRef, mode, game_settings, setPoints
                })}
            >
                {/*{defines.items}*/}
                {
                    defines.items.map(
                        item => (
                            <MakePuzzleElem
                                selectWord={selectWord}
                                words_selected={words_selected}
                                key={'items' + item.i + item.letter + item.itsValues.toString()}
                                props={item}
                                removeWordListLeft={removeWordListLeft}
                                word_list_left={word_list_left}
                            />
                        )
                    )
                }
            </div>

            <div id="box">
                <svg
                    ref={svgRef}
                    height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none" id="innerbox">
                    <defs>
                        <mask id="hole">
                            <rect width="100%" height="100%" fill="white"/>
                            {
                                game_settings.magnifer_shape === 'Rect' ?
                                    <rect
                                        // x={points.x}
                                        // y={points.y}
                                        width={game_settings[mode + '_magnifer_width']}
                                        height={game_settings[mode + '_magnifer_height']}
                                        className='polygon'
                                    />
                                    :
                                    <circle
                                        // cx={points.x}
                                        // cy={points.y}
                                        r={game_settings[mode + '_magnifer_radius']}
                                        className='polygon'
                                    />
                            }
                        </mask>
                    </defs>
                    <rect fill="white" width="100%" height="100%" mask="url(#hole)" />
                </svg>
            </div>

            <div
                className="wp-words-puzzle-cover"
                style={{
                    gridTemplateColumns: defines.gridTemplateColumns,
                    gridTemplateRows: defines.gridTemplateRows
                }}
            >
                {/*{defines.items2}*/}
                {
                    cover
                }
            </div>
        </>
    )
};

const ShowClock = ({mode, words_show_time_out, timeEndCallback, number_of_puzzles, puzzle_number, number_of_words, number_of_words_left}) =>{
    const [minutes, setMinutes] = useState(Math.floor(words_show_time_out / 60));
    const [seconds, setSeconds] = useState(words_show_time_out - 60 * Math.floor(words_show_time_out / 60));
    useEffect(() => {
        let date = Date.now();
        let minutes = Math.floor(words_show_time_out / 60);
        let seconds = words_show_time_out - minutes * 60;
        let clock_interval = setInterval(() => {
            let over = Math.floor((Date.now() - date)/1000);
            over = words_show_time_out - over;
            minutes = Math.floor(over / 60);
            seconds = over - minutes * 60;
            setMinutes(minutes);
            setSeconds(seconds);
            if(over === 0) {
                clearInterval(clock_interval);
                timeEndCallback('TimeEnd');
            };

        }, 1000);

        return () => {
            clearInterval(clock_interval);
        };
    }, []);

    if (mode === 'WordShow')
        return (
            <Fragment>
                <div
                    className='wp-words-show-clock'
                >
                    <div
                        className='wp-words-show-clock-lbl'>
                        <label>{minutes > 9 ? minutes : `0${minutes}`}</label>
                        <label>:</label>
                        <label>{seconds > 9 ? seconds : `0${seconds}`}</label>
                    </div>
                </div>

                <label
                    className='wp-words-show-clock-lbl2'
                >In the next word search puzzle you will be asked to find the words below.</label>
            </Fragment>
        );
    else if (mode === 'Game')
        return (
            <div
                className='wp-game-clock'
            >
                <label>
                    {puzzle_number}
                    /
                    {number_of_puzzles}
                </label>

                <label>
                    {minutes > 9 ? minutes : `0${minutes}`}:{seconds > 9 ? seconds : `0${seconds}`}
                </label>

                <label>
                    {number_of_words - number_of_words_left}
                    /
                    {number_of_words}
                </label>
            </div>
        );
}

class Puzzle extends React.Component{
    constructor(props) {
        super(props);
        this.props = props;

        this.puzzle = props.puzzle;
        this.mode = props.mode;
        this.game_settings = props.game_settings;

        // this.letters_card = [];
        // this.word_list = [];
        // this.word_list_left = [];
        // this.words_info = {};
        // this.words_indexes = {};
        // this.indexes_counter = {};

        this.state = {
            loading: true,
            word_list_left: this.props.word_list_left,
            words_selected: this.props.words_selected,
            // letters_selected_indexes: [],
            // letters_selected_direction: null,
        };

        // this.checkTwoRoundIndexes = this.checkTwoRoundIndexes.bind(this);
        // this.getNewDirection = this.getNewDirection.bind(this);
        // this.getLetterCardByIndex = this.getLetterCardByIndex.bind(this);
        // this.getWordInfo = this.getWordInfo.bind(this);
        // this.getWordsIndexes = this.getWordsIndexes.bind(this);
        // this.getIndexesCounter = this.getIndexesCounter.bind(this);
        // this.removeWordListLeft = this.removeWordListLeft.bind(this);
        this.setNewPuzzle = this.setNewPuzzle.bind(this);
        // handleCellClick = handleCellClick.bind(this);
        // this.handleCellClick = this.handleCellClick.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.word_list_left !== this.props.word_list_left){
            let sc = this.state;
            sc.word_list_left = this.props.word_list_left;
            this.setState(sc);
        }

        if (prevProps.words_selected !== this.props.words_selected){
            let sc = this.state;
            sc.words_selected = this.props.words_selected;
            this.setState(sc);
        }
    }

    componentDidMount() {
        this.setNewPuzzle();
    }

    setNewPuzzle(){
        letters_selected_indexes = [];
        letters_founded_indexes = [];
        letters_selected_direction = null;
        letters_card = [];
        word_list = [];
        // word_list_left = [];
        words_info = {};
        words_indexes = {};
        words_indexes_set = new Set();
        indexes_counter = {};
        puzzle_indexes_counter = {};
        puzzle_words_indexes = {};

        let next_puzzle_name = Object.keys(this.puzzle)[0];

        for (let i=0; i<this.puzzle[next_puzzle_name].puzzle_cols*this.puzzle[next_puzzle_name].puzzle_rows; i++)
            letters_card.push(getRandomLetter());

        // sc.indexes_counter = {};
        // sc.mouse_move_records = [];

        let pm = this.puzzle[next_puzzle_name].puzzle_data;

        let pr = Object.keys(pm);

        // let word_list = [];
        // let words_info = {};
        // let words_indexes = {};

        while (pr.length > 0) {
            let next_index = Math.floor(Math.random() * pr.length);
            let word = pr[next_index];
            pr.splice(next_index, 1);

            word_list.push(word);

            words_info[word] = {
                start_index: pm[word].start_index,
                length: pm[word].length,
                steps: pm[word].steps,
                WordTag: pm[word].WordTag || '',
            };

            let word_indexes = [];
            for(let i=0; i<pm[word].length; i++){
                word_indexes.push(pm[word].start_index + pm[word].steps*i);
                words_indexes_set.add(pm[word].start_index + pm[word].steps*i);
            }
            words_indexes[word] = word_indexes;

            for(let i=0; i< pm[word].length; i++){

                let index = pm[word].start_index+i*pm[word].steps;

                letters_card[index] = word.charAt(i);

                let ww = [];

                if (indexes_counter[index] && indexes_counter[index].words){
                    ww = indexes_counter[index].words;
                    ww.push(word);
                }
                else {
                    ww.push(word)
                }
                indexes_counter[index] = {
                    count: (indexes_counter[index] && indexes_counter[index].count > -1) ? indexes_counter[index].count+1 : 1,
                    words: ww
                };


                // this.setLettersCard(word.charAt(i), pm[word].start_index+i*pm[word].steps, word);
            }
        }

        // words_info = words_info;
        // words_indexes = words_indexes;
        // word_list_left = [...word_list];
        // word_list = word_list;

        this.puzzle = this.puzzle[next_puzzle_name];

        this.setState(() => {
            return {
                loading: false
            }
        });
    }

    render() {
        return (
            <div
                className='wp-words-puzzle'
            >
                <PuzzleBoard
                    removeWordListLeft={this.props.removeWordListLeft}
                    selectWord={this.props.selectWord}
                    word_list_left={this.state.word_list_left}
                    words_selected={this.state.words_selected}
                    puzzle={this.puzzle}
                    game_settings={this.game_settings}
                    mode={this.mode}

                />
            </div>
        );
    }
}

class Game extends React.Component{
    constructor(props) {
        super(props);
        this.props = props;

        this.game_settings = props.game_settings;
        this.isAdminUser = props.isAdminUser;
        this.FinishTask = props.FinishTask;
        //
        this.word_list = null;
        this.current_puzzle = null;

        this.PuzzlesModels = [];
        let temp_arr = [...props.puzzles_models];
        while (temp_arr.length > 0){
            let new_index = Math.floor(Math.random() * temp_arr.length);
            this.PuzzlesModels.push(temp_arr[new_index]);
            temp_arr = temp_arr.filter(
                (val,index) => index !== new_index
            );
        }

        this.state = {
            isLoading: true,
            puzzle_index: null,
            word_list_left: [],
            // words_selected: [],
        };

        this.nextPuzzleWords = this.nextPuzzleWords.bind(this);
        this.addToDB = this.addToDB.bind(this);
        this.Task = this.Task.bind(this);
        this.removeWordListLeft = this.removeWordListLeft.bind(this);
        this.FinishPuzzle = this.FinishPuzzle.bind(this);
        this.ContinueToPuzzleGame = this.ContinueToPuzzleGame.bind(this);
        this.puzzles_time_out = this.game_settings.game.puzzles_time_out;
        // props.SetLimitedTime(true);
        this.elementRef = React.createRef();
        this.checkIfMounted = this.checkIfMounted.bind(this);

        this.RecordsTimeOut = null;
        this.props.SetLimitedTime(false);
    }

    checkIfMounted() {
        return this.elementRef.current != null;
    }

    componentDidMount(){
        NewLogs({
            user_id: UserId,
            exp: ThisExperiment,
            running_name: RunningName,
            action: 'Game starts',
            type: 'LogGameType',
            more_params: {
                puzzle_number: this.state.puzzle_index ? (this.state.puzzle_index+1) : 0,
                game_points: GAME_POINTS,
                local_t: getTimeDate().time,
                local_d: getTimeDate().date,
            },
        }).then((res) => {});
        this.nextPuzzleWords();
    }

    componentWillUnmount() {
        clearInterval(this.RecordsTimeOut);
    }

    nextPuzzleWords(){
        NewLogs({
            user_id: UserId,
            exp: ThisExperiment,
            running_name: RunningName,
            action: 'Game running',
            type: 'LogGameType',
            more_params: {
                puzzle_number: this.state.puzzle_index ? (this.state.puzzle_index+1) : 0,
                game_points: GAME_POINTS,
                stage: 'WordsShow',
                words_founded: '-',
                words_founded_total: FoundedWordsCountTotal,
                local_t: getTimeDate().time,
                local_d: getTimeDate().date,
            },
        }).then((res) => {});
        this.props.SetLimitedTime(true);
        FoundedWordsCountPuzzle = 0;
        NumberOfDiagonalWords = 0;
        NumberOfVerticalWords = 0;
        NumberOfHorizontalWords = 0;
        let sc = this.state;
        sc.mode = 'WordsShow';
        if (sc.puzzle_index === null)
            sc.puzzle_index = 0;
        else
            sc.puzzle_index++;
        let puzzle = this.PuzzlesModels[sc.puzzle_index][Object.keys(this.PuzzlesModels[sc.puzzle_index])[0]];
        this.word_list = Object.keys(puzzle.puzzle_data);
        sc.word_list_left = Object.keys(puzzle.puzzle_data);
        this.current_puzzle = this.PuzzlesModels[sc.puzzle_index];
        this.ContinueMessage = this.ContinueToPuzzleGame;
        // this.ContinueMessage = this.ContinueToPuzzleGame.bind(this);
        sc.isLoading = false;
        this.setState(sc);
    }

    addToDB() {
        let Orientation = '-';
        let puzzle = this.current_puzzle[Object.keys(this.current_puzzle)[0]];

        if( NEXT_WORD && NEXT_WORD !== '') {
            let dir = getWordInfo(NEXT_WORD);
            if(dir){
                dir = dir.steps;
                if(dir === 1) Orientation = 'horizontal';
                else if(dir === puzzle.puzzle_cols) Orientation = 'vertical';
                else if(dir === (puzzle.puzzle_cols+1)) Orientation = 'diagonal';
            }
        }


        return  {
            Condition: puzzle.puzzle_type,
            Order: (this.state.puzzle_index + 1),
            PuzzleName: puzzle.puzzle_id,
            PuzzleLength: puzzle.puzzle_length,
            PuzzleSize: puzzle.puzzle_size,
            Place: COORDINTAES.x + ' | ' + COORDINTAES.y,
            FindWord: NEXT_WORD == '' ? 'false' : 'true',
            TheWord: NEXT_WORD,
            WordTag: getWordInfo(NEXT_WORD) !== undefined ? (getWordInfo(NEXT_WORD).WordTag || '') : '',
            Orientation: Orientation,
            NumberofWords: this.word_list.length - this.state.word_list_left.length,
            NumberofDiagonalWords: NumberOfDiagonalWords,
            NumberofVerticalWords: NumberOfVerticalWords,
            NumberofHorizontalWords: NumberOfHorizontalWords,
            Time: getTimeDate().time,
            Date: getTimeDate().date,
        };

    }

    ContinueToPuzzleGame(){
        NewLogs({
            user_id: UserId,
            exp: ThisExperiment,
            running_name: RunningName,
            action: 'Game running',
            type: 'LogGameType',
            more_params: {
                puzzle_number: this.state.puzzle_index ? (this.state.puzzle_index+1) : 0,
                game_points: GAME_POINTS,
                stage: 'Puzzle',
                words_founded: '-',
                words_founded_total: FoundedWordsCountTotal,
                local_t: getTimeDate().time,
                local_d: getTimeDate().date,
            },
        }).then((res) => {});
        let sc = this.state;
        sc.mode = 'Task';
        this.setState(sc, () => {
            this.RecordsTimeOut = setInterval(() => {
                if (!this.checkIfMounted()){
                    clearInterval(this.RecordsTimeOut);
                    return;
                }
                this.props.insertGameLine(this.addToDB());
                NEXT_WORD = '';

            }, this.game_settings.game.record_move_time_out);
        });
    }

    FinishPuzzle(reason){
        clearInterval(this.RecordsTimeOut);
        this.props.SetLimitedTime(false);
        let sc = this.state;
        let game_end;
        try {
            let puzzle = this.PuzzlesModels[sc.puzzle_index + 1][Object.keys(this.PuzzlesModels[sc.puzzle_index + 1])[0]];
            game_end = false;
        }
        catch (e) {
            game_end = true;
        }

        NewLogs({
            user_id: UserId,
            exp: ThisExperiment,
            running_name: RunningName,
            action: 'Game running',
            type: 'LogGameType',
            more_params: {
                puzzle_number: this.state.puzzle_index ? (this.state.puzzle_index+1) : 0,
                game_points: GAME_POINTS,
                stage: 'FinishPuzzle',
                reason: reason || '-',
                words_founded: FoundedWordsCountPuzzle,
                words_founded_total: FoundedWordsCountTotal,
                game_end,
                local_t: getTimeDate().time,
                local_d: getTimeDate().date,
            },
        }).then((res) => {});

        if (game_end){
            this.page = 'FinishAllPuzzlesPage';
            this.ContinueMessage = this.FinishTask;
        }
        else {
            if(reason === 'TimeEnd')
                this.page = 'PuzzleAllocatedTimePage';
            else if(reason === 'FinishWords')
                this.page = 'FinishPuzzlePage';
            this.ContinueMessage = this.nextPuzzleWords;
        }
        sc.mode = 'GameMessages';
        this.setState(sc);
    }

    removeWordListLeft(word){
        FoundedWordsCountPuzzle++;
        FoundedWordsCountTotal++;
        NEXT_WORD = word;
        let puzzle = this.current_puzzle[Object.keys(this.current_puzzle)[0]];
        let dir = getWordInfo(word);
        if(dir){
            dir = dir.steps;
            if(dir === 1) NumberOfHorizontalWords++;
            else if(dir === puzzle.puzzle_cols) NumberOfVerticalWords++;
            else if(dir === (puzzle.puzzle_cols+1)) NumberOfDiagonalWords++;
        }

        NewLogs({
            user_id: UserId,
            exp: ThisExperiment,
            running_name: RunningName,
            action: 'Game running',
            type: 'LogGameType',
            more_params: {
                puzzle_number: this.state.puzzle_index ? (this.state.puzzle_index+1) : 0,
                game_points: GAME_POINTS,
                stage: 'Puzzle',
                action: 'Found word',
                word,
                words_founded: FoundedWordsCountPuzzle,
                words_founded_total: FoundedWordsCountTotal,
                local_t: getTimeDate().time,
                local_d: getTimeDate().date,
            },
        }).then((res) => {});
        let sc = this.state;
        sc.word_list_left = sc.word_list_left.filter(w => w !== word);
        this.setState(sc, () => {
            if (this.state.word_list_left.length < 1)
                this.FinishPuzzle('FinishWords');
        });
    }

    Task() {
        return (
            <div
                className='wp-game-real'
            >
                <div
                    className='wp-game-real-head'
                >
                    <ShowClock
                        mode='Game'
                        words_show_time_out={this.puzzles_time_out}
                        number_of_puzzles={this.PuzzlesModels.length}
                        puzzle_number={this.state.puzzle_index + 1}
                        number_of_words={this.word_list.length}
                        number_of_words_left={this.state.word_list_left.length}
                        timeEndCallback={this.FinishPuzzle}
                    />
                    <div
                        className='wp-game-real-words-list'
                    >
                        {
                            this.word_list.map(
                                word =>
                                    <label
                                        className={'item-'+word + ( this.state.word_list_left.indexOf(word) < 0 ? ' wp-words-list-item-selected' : '')}
                                        key={word}
                                        onMouseMove={this.isAdminUser ? e => AdminWordsHighlight(e, word, true) : () => {}}
                                        onMouseLeave={this.isAdminUser ? e => AdminWordsHighlight(e, word, false) : () => {}}
                                        // onClick={this.state.word_list_left.indexOf(word) > -1 ? e => this.selectWord('toggle', word) : e => e.preventDefault()}
                                    >{word}</label>
                            )
                        }
                    </div>
                </div>

                <div
                    className='wp-game-real-puzzle'
                >
                    <Puzzle
                        selectWord={() => {}}
                        words_selected={[]}
                        puzzle={this.current_puzzle}
                        game_settings={this.game_settings.game}
                        mode='demo'
                        removeWordListLeft={this.removeWordListLeft}
                        word_list_left={this.state.word_list_left}
                    />
                </div>
            </div>
        )
    }

    render() {
        if (this.state.isLoading)
            return <></>;

        return (
            <div
                className='wps-board'
                ref={this.elementRef}
            >
                {this.state.mode === 'GameMessages' && (
                    <GameMessages
                        page={this.page}
                        game_settings={this.game_settings}
                        Continue={this.ContinueMessage}
                    />
                )}
                {this.state.mode === 'WordsShow' && (
                    <WordShow
                        words_list={this.word_list}
                        game_settings={this.game_settings.game}
                        Continue={this.ContinueMessage}
                    />
                )}
                {this.state.mode === 'Task' && this.Task()}

            </div>
        );
    }
}

class Demo extends React.Component{
    constructor(props) {
        super(props);
        this.props = props;

        this.game_settings = props.game_settings;
        this.puzzles_models = props.puzzles_models;
        this.isAdminUser = props.isAdminUser;
        this.FinishTask = props.FinishTask;

        this.word_list = ['garden', 'porch', 'home'];

        this.puzzle = {
            Demo: {
                puzzle_data: {
                    garden: {
                        start_index: 3,
                        length: 6,
                        steps: 5
                    },
                    porch: {
                        start_index: 15,
                        length: 5,
                        steps: 6
                    },
                    home: {
                        start_index: 20,
                        length: 4,
                        steps: 1
                    }
                },
                puzzle_cols: 5,
                puzzle_id: "Demo",
                puzzle_length: 3,
                puzzle_rows: 8,
                puzzle_size: "8X5",
                puzzle_type: "Scattered",
            }
        }
        this.page = 'DemoPage';
        this.state = {
            word_list_left: ['garden', 'porch', 'home'],
            words_selected: [],
            mode: 'GameMessages',
        };

        // props.SetLimitedTime(true);

        this.removeWordListLeft = this.removeWordListLeft.bind(this);
        this.selectWord = this.selectWord.bind(this);
        this.FinishPuzzle = this.FinishPuzzle.bind(this);
        this.Task = this.Task.bind(this);
        this.ContinueMessage = this.Continue.bind(this);
        this.props.SetLimitedTime(false);
    }

    removeWordListLeft(word){
        // NEXT_WORD = word;
        let sc = this.state;
        sc.word_list_left = sc.word_list_left.filter(w => w !== word);
        this.setState(sc, () => {
            if (this.state.word_list_left.length < 1)
                this.FinishPuzzle();
        });
    }

    componentDidMount(){
        NewLogs({
            user_id: UserId,
            exp: ThisExperiment,
            running_name: RunningName,
            action: 'Demo starts',
            type: 'LogGameType',
            more_params: {
                local_t: getTimeDate().time,
                local_d: getTimeDate().date,
            },
        }).then((res) => {});
    }

    Continue(){
        let sc = this.state;
        if (sc.mode === 'GameMessages') {
            sc.mode = 'WordsShow';
        }
        else {
            this.props.SetLimitedTime(true);
            sc.mode = 'Task';
        }
        this.setState(sc);
    }

    selectWord(option, word){
        let sc = this.state;
        if (option === 'remove'){
            sc.words_selected = sc.words_selected.filter(
                word_ => word_ !== word
            );
        }
        else {
            if (sc.words_selected.indexOf(word) > -1)
                sc.words_selected = sc.words_selected.filter(
                    word_ => word_ !== word
                );
            else
                sc.words_selected = [...sc.words_selected, word];
        }
        this.setState(sc);

    }

    FinishPuzzle(){
        this.props.SetLimitedTime(false);
        let sc = this.state;
        sc.mode = 'GameMessages';
        this.page = 'FinishExamplePage';
        this.ContinueMessage = this.FinishTask;
        NewLogs({
            user_id: UserId,
            exp: ThisExperiment,
            running_name: RunningName,
            action: 'Demo ends',
            type: 'LogGameType',
            more_params: {
                local_t: getTimeDate().time,
                local_d: getTimeDate().date,
            },
        }).then((res) => {});
        this.setState(sc);
    }

    Task() {
        return (
            <div
                className='wp-game-demo'
            >
                <div
                    className='wp-game-demo-header'
                >
                    <label>Practice</label>
                    <label>In order to see the letters you have to move the mouse pointer across the computer screen.</label>
                    <label>When you find a word, mark it by clicking on its letters.</label>
                    <label>Only here, in the practice word search puzzle,</label>
                    <label>you can get a hint if you click on a word in the words list.</label>
                </div>

                <div
                    className='wp-game-demo-header-2'
                >
                    <ul
                        className='wp-game-demo-word-list'
                    >
                        {
                            this.word_list.map(
                                word =>
                                    <li
                                        className={'item-'+word + ( this.state.word_list_left.indexOf(word) < 0 ? ' wp-words-list-item-selected' : '') + (this.state.words_selected.indexOf(word) > -1 ? ' wp-set-selected-word ' : '')}
                                        key={word}
                                        onClick={this.state.word_list_left.indexOf(word) > -1 ? e => this.selectWord('toggle', word) : e => e.preventDefault()}
                                    >{word}</li>
                            )
                        }
                    </ul>

                    <div
                        className='wp-game-demo-puzzle'
                    >
                        <Puzzle
                            selectWord={this.selectWord}
                            words_selected={this.state.words_selected}
                            puzzle={this.puzzle}
                            game_settings={this.game_settings.game}
                            mode='demo'
                            removeWordListLeft={this.removeWordListLeft}
                            word_list_left={this.state.word_list_left}
                        />
                    </div>
                </div>
                {
                    this.isAdminUser && (
                        <div
                            className='unselectable wp-block-task-button wp-demo-admin-btn'
                            // onClick={() => this.finishDemo()}
                        >
                            <button
                                className='unselectable'
                                onClick={this.FinishPuzzle}
                            >
                                Continue
                            </button>
                        </div>
                    )
                }
            </div>
        )
    }

    render() {

        return (
            <>
                {this.state.mode === 'GameMessages' && (
                    <GameMessages
                        page={this.page}
                        game_settings={this.game_settings}
                        Continue={this.ContinueMessage}
                    />
                )}
                {this.state.mode === 'WordsShow' && (
                    <WordShow
                        words_list={this.word_list}
                        game_settings={this.game_settings.game}
                        Continue={this.ContinueMessage}
                    />
                )}
                {this.state.mode === 'Task' && this.Task()}
            </>
        )
    }
}

class WordShow extends React.Component {
    constructor(props){
        super(props);

        this.props = props;

        this.WordsList = this.WordsList.bind(this);

        this.clock_interval = null;
        this.words_show_time_out = this.props.game_settings.words_show_time_out;
        this.words_list = this.props.words_list;
    }

    componentDidMount(){
        let w_count = Math.ceil(this.words_list.length/6);
        let gtc = '';
        for (let i = 0; i < w_count; i++)
            gtc = gtc + ' auto ';

        $('.wp-words-show-words-li').css('grid-template-columns', gtc);
    }

    WordsList(){
        return (
            <div
                className='wp-words-show-words-li'
            >
                {
                    this.words_list.map(
                        word => {
                            return (
                                <label key={word+'words-listwp'}>{word}</label>
                            )
                        }
                    )
                }
            </div>
        )
    };

    render(){
        return (
            <div
                className='wp-words-show-page'
            >
                {this.WordsList()}
                <ShowClock
                    mode='WordShow'
                    words_show_time_out={this.words_show_time_out}
                    timeEndCallback={this.props.Continue}
                />
                <div
                    className='wp-words-show-button'
                >
                    <button
                        onClick={() => {
                            this.props.Continue();
                        }}
                    >START</button>
                </div>
            </div>
        )
    }
}

class GameMessages extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;

        this.next = this.next.bind(this);

        this.forms_arr = {
            DemoPage: {
                pages: ['DemoPage1', 'DemoPage2'],
                btn: ['CONTINUE', 'NEXT']
            },
            FinishExamplePage: {
                pages: ['FinishExamplePage'],
                btn: ['CONTINUE']
            },
            FinishPuzzlePage: {
                pages: ['FinishPuzzlePage'],
                btn: ['NEXT']
            },
            FinishAllPuzzlesPage: {
                pages: ['FinishAllPuzzlesPage', 'FinishGame'],
                btn: ['NEXT', 'CONTINUE']
            },
            PuzzleAllocatedTimePage: {
                pages: ['PuzzleAllocatedTimePage'],
                btn: ['NEXT']
            },
            FinishGame: {
                pages: ['FinishGame'],
                btn: ['CONTINUE']
            },
        };

        this.state = {
            page: props.page,
            form_index: 0,
        };

    }

    componentDidUpdate(prevProps, prevState, c){
        if(prevProps.page !== this.props.page){
            let sc = this.state;
            sc.page = this.props.page;
            this.setState(sc);
        }
    }

    convertTime(time){
        let minutes, seconds, rtnTime = '';

        minutes = Math.floor(time/60);
        seconds = time - minutes*60;

        if(minutes === 0){
            if(seconds === 1)
                rtnTime = seconds + ' second';
            else
                rtnTime = seconds + ' seconds';
        }
        else {
            if(minutes<10 && seconds !== 0)
                rtnTime = '0' + minutes;
            else
                rtnTime = minutes;

            if(seconds !== 0){
                rtnTime = rtnTime + ':';
                if(seconds<10)
                    rtnTime = rtnTime + ('0'+seconds);
                else
                    rtnTime = rtnTime + seconds;
            }
            if (rtnTime == minutes){
                if(minutes === 1)
                    rtnTime = rtnTime + ' minute';
                else
                    rtnTime = rtnTime + ' minutes';
            }
            else
                rtnTime = rtnTime + ' minutes';
        }

        return rtnTime;
    }

    DemoPage1  = (data) => {
        let msg =
            (
                <div
                    className='wp-start-game-messages-cons'
                >
                    In the next task you will be asked to solve {this.props.game_settings.game.number_of_puzzles} word search puzzles.<br/>
                    This word game consists of letters scattered in a square grid.<br/>
                    The target words are organized horizontally, vertically and diagonally.<br/>
                    Your goal is to find and mark letters that compose a word.<br/>
                    In each word search puzzle there are {this.props.game_settings.game.active_length} target words that will appear on the screen before you begin the puzzle.<br/>
                    You do not need to memorize the words because they also appear on the sides of the word search puzzle itself.<br/>
                    Some words and some word search puzzles are more difficult than the others.<br/>
                    You choose letters by clicking on the left mouse button when the mouse pointer is on a specific letter.<br/>
                    After you complete selecting all the letters composing a word, you will see a line crossing the word in the word list.<br/>
                    <br/>
                    <b>Also, please complete this part of study in a sequence, without taking breaks during your participation. Therefore, if there is no response in {this.convertTime(this.props.game_settings.general.action_time)} the experiment screen will close and you will not be compensated.</b>
                    <br/>
                    <br/>
                    Press CONTINUE to move to the next page.<br/>
                </div>
            );

        return msg;
    };

    DemoPage2  = (data) => {
        let msg = (
            <div
                className='wp-start-game-messages-cons'
            >
                To search for letters you have to move the mouse pointer across the computer screen.<br/>
                Each mouse move will reveal a different area of the grid.<br/>
                Once you find the target words you need to mark them.<br/>
                You will have {this.convertTime(this.props.game_settings.game.puzzles_time_out)} for solving each one of the word search puzzles.<br/>
                On the left side of the screen there is a clock which shows the time remaining to complete the specific puzzle.<br/>
                If you finish the puzzle before the allocated time is up, you will be automatically moved to the next puzzle.<br/>
                In the next page you will be asked to solve an example of a word search puzzle with three target words.<br/>
                After you find the three target words you will be able to continue to the word game itself.<br/>
                If you can’t find a target word in the example puzzle, press on the word in the words list and you will get a hint (the hint is given only in the example puzzle, and after you get the hint you have to mark the word by clicking on its letters).<br/>
                <br/>
                If you understand the instructions and you are ready to start solving the example puzzle, please press NEXT.<br/>
            </div>
        );

        return msg;
    };

    FinishExamplePage   = (data) => {
        let msg =
            (
                <div
                    className='absolute-center'
                >
                    You have completed the example of the word search puzzle.<br/>
                    Please press continue to move to the word search puzzle task.<br/>
                </div>
            );
        return msg;
    };

    FinishPuzzlePage  = (data) => {
        let msg =
            (
                <div
                    className='absolute-center'
                >
                    You have found all the target words in the word search puzzle.<br/>
                    To move to the next word search puzzle please press NEXT.<br/>

                </div>
            );

        return msg;
    };

    FinishAllPuzzlesPage  = (data) => {
        let msg =
            (
                <div
                    className='absolute-center'
                >
                    You have completed solving all the word search puzzles.<br/>
                    To move to the next part of the study, please press NEXT.<br/>
                </div>
            );

        return msg;
    };

    PuzzleAllocatedTimePage  = (data) => {
        let msg =
            (
                <div
                    className='absolute-center'
                >
                    The allocated time for solving the word search puzzle is up.<br/>
                    To move to the next word search puzzle please press NEXT.<br/>
                </div>
            );
        return msg;
    };

    FinishGame = (data) => {
        let msg =
            (
                <div
                    className='absolute-center'
                >

                    You have completed the second part of the study.<br/>
                    To proceed to the last part, click continue.
                </div>
            );

        return msg;
    };

    next(e) {
        e.preventDefault();
        let stateCopy = this.state;
        stateCopy['form_index']++;
        if(stateCopy['form_index'] === this.forms_arr[stateCopy.page].pages.length){
            this.props.Continue();
        }
        else{
            this.setState(stateCopy);
        }
    }

    render() {

        return (
            <div
                className='wp-game-intro'
            >
                <div className="wp-gi-message-box">
                    {
                        this[this.forms_arr[this.state.page].pages[this.state.form_index]]()
                        // this.state.forms[this.state.forms_arr[this.state.form_index]]()
                    }
                </div>

                <div
                    className="wp-gi-btn"
                >
                    <div
                        className='wp-block-task-button'
                        onClick={e => this.next(e)}
                    >
                        <button>
                            {this.forms_arr[this.state.page].btn[this.state.form_index]}
                        </button>
                    </div>
                </div>
            </div>
        );

    }
}

class Start extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        ResetAll();

        this.game_settings = props.game_settings;
        this.puzzles_models = props.more.puzzles_models;

        UserId = props.user_id;
        RunningName = props.running_name;

        this.Continue = this.Continue.bind(this);


        this.state = {
            tasks_index: 0,
            isa: props.isa,
        };

        this.tasks = ['Demo', 'Game'];

        props.SetLimitedTime(false);

    }

    componentDidMount(){
        // this.props.setWaitForAction(true);
        // setTimeout(() => this.props.setWaitForAction(false), 3000);
        NewLogs({
            user_id: UserId,
            exp: ThisExperiment,
            running_name: RunningName,
            action: 'Game loaded',
            type: 'LogGameType',
            more_params: {
                local_t: getTimeDate().time,
                local_d: getTimeDate().date,
            },
        }).then((res) => {});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isa !== this.props.isa){
            let sc = this.state;
            sc.isa = this.props.isa;
            this.setState(sc);
        }
    }

    Continue(){
        let sc = this.state;
        if (sc.tasks_index === (this.tasks.length - 1)){
            const current_time = getTimeDate();
            NewLogs({
                user_id: UserId,
                exp: ThisExperiment,
                running_name: RunningName,
                action: 'Game ends',
                type: 'LogGameType',
                more_params: {
                    game_points: GAME_POINTS,
                    local_t: current_time.time,
                    local_d: current_time.date,
                },
            }).then((res) => {});
            const {payments} = this.game_settings;

            let bonus = Math.floor((GAME_POINTS/payments.exchange_ratio)*100)/100;

            this.props.insertPayment({
                game_points: GAME_POINTS,
                sign_of_reward: payments.sign_of_reward,
                show_up_fee: payments.show_up_fee,
                exchange_ratio: payments.exchange_ratio,
                bonus_endowment: payments.bonus_endowment,
                bonus: bonus,
                total_payment: Math.floor((bonus + payments.show_up_fee)*100)/100,
                Time: current_time.time,
                Date: current_time.date
            });
            // Logs({
            //     info:
            //         ('id=' + CONSTANT_DETAILS['Id'] +
            //             ' | action=EndApp | points=' + GAME_POINTS +
            //             ' | bonus=' + bonus + ' | total_pay=' + total_payment
            //         )}, 'ONLY_WP_YUVAL').then(
            //     (res) => {
            //     }
            // );

            NewLogs({
                user_id: UserId,
                exp: ThisExperiment,
                running_name: RunningName,
                action: 'Game ends',
                type: 'LogGameType',
                more_params: {
                    game_points: GAME_POINTS,
                    bonus: bonus,
                    total_payment: Math.floor((bonus + payments.show_up_fee)*100)/100,
                    local_t: current_time.time,
                    local_d: current_time.date,
                },
            }).then((res) => {});

            this.props.callbackFunction('FinishGame', {need_summary: false, args: {game_points: GAME_POINTS}});
        }
        else {
            sc.tasks_index++;
            this.setState(sc);
        }
    }

    render() {

        return (
            <div
                className='wps-handle'
                onMouseMove={e => CoordinatesMouseMove(e)}
            >
                {
                    this.tasks[this.state.tasks_index] === 'Demo' ? (
                        <Demo
                            game_settings={this.game_settings}
                            isAdminUser={this.state.isa}
                            SetLimitedTime={this.props.SetLimitedTime}
                            FinishTask={this.Continue}
                        />
                    ) : (
                        <Game
                            game_settings={this.game_settings}
                            isAdminUser={this.state.isa}
                            puzzles_models={this.puzzles_models}
                            SetLimitedTime={this.props.SetLimitedTime}
                            FinishTask={this.Continue}
                            insertGameLine={this.props.insertGameLine}
                        />
                    )
                }
            </div>
        );
    }
}

Start.propTypes = {
    game_settings: PropTypes.object,
    more: PropTypes.object
};

export default Start;
