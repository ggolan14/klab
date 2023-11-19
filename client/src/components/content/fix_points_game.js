import React from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import {setGameMode, setWaitForAction} from "../../actions/app_actions";
import '../screens/todo/todo.css';
import {getMyExps, isValidExperiment} from "../../utils/app_utils";
import {DropDown, toggleOpen} from "../screens/dropdown/dropdown";
import {getExpTodo, addExpTodo} from "../../actions/exp_actions";
import {setAlert} from "../../actions/alert";

let LOADING_TIMEOUT = null;
let RedirectBack;
const FileDownload = require('js-file-download');

const Header = ({item_selected, list_open, optionsList, select_item, reference, goBack}) => {
    return (
        <div
            className='exp-details-panel-h'
        >
            <button
                onClick={() => {
                    goBack();
                }}
            >
                Back
            </button>

            <DropDown
                label='Experiment'
                tag='EXP'
                dropdown_item='experiment_list'
                item_selected={item_selected}
                list_open={list_open}
                optionsList={optionsList.sort()}
                select_item={select_item}
                reference={reference}
            />
        </div>
    )
};

class Todo extends React.Component {

    constructor(props) {
        super(props);
        this.elementRef = React.createRef();

        this.state = {
            auth: props.auth,
            isAuthenticated: props.isAuthenticated,
            isLoading: true,
            myExps: getMyExps(),
            exp_selected: undefined,
            experiment_list_dropdown: false,
            exp_todo: []
        };

        this.checkIfMounted = this.checkIfMounted.bind(this);
        this.isAuth = this.isAuth.bind(this);
        this.isExps = this.isExps.bind(this);
        this.select_drop_item = this.select_drop_item.bind(this);
        this.getExpTodoList = this.getExpTodoList.bind(this);
        this.onClickOnForm = this.onClickOnForm.bind(this);
    }

    getExpTodoList(exp) {
        let _this = this;
        _this.props.setWaitForAction(true);
        getExpTodo({
            exp
        }).then(
            res => {
                let msg = '';
                let sc = _this.state;
                sc.isLoading = false;
                try {
                    if (res.data.msg !== 'NOT_FOUND'){
                        sc.exp_todo = res.data.exp_todo;
                        sc.exp_selected = exp;
                    }
                    else {
                        msg = 'Todo list not founded for this experiment';
                    }
                }
                catch (e) {
                    msg = 'Some error was happened try later';
                }
                _this.setState(sc, () => {
                    _this.props.setWaitForAction(false);
                    if (msg)
                        _this.props.setAlert(msg, 'danger');
                });
            }
        )
    }

    select_drop_item(item, tag) {
        if (tag === 'EXP')
            this.getExpTodoList(item);
    }

    checkIfMounted() {
        return this.elementRef.current != null;
    }

    isAuth(){
        let exp;

        try {
            exp = this.props.location.state.exp;
        }
        catch (e){
            exp = undefined;
        }

        RedirectBack = exp ? (exp + '/main') : '/';

        let sc = this.state;
        sc.isAuthenticated = this.props.isAuthenticated;
        sc.auth = this.props.auth;
        sc.authLoading = false;
        sc.exp_selected = exp;
        this.setState(sc);
    }

    isExps(){
        let sc = this.state;
        sc.allExperiments = this.props.allExperiments;
        sc.myExps = getMyExps();
        sc.expListLoading = false;
        this.setState(sc);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isAuthenticated !== this.props.isAuthenticated || prevProps.auth !== this.props.auth){
            this.isAuth();
        }
        if (prevProps.allExperiments !== this.props.allExperiments){
            this.isExps();
        }

        if (prevState.exp_selected !== this.state.exp_selected && this.state.exp_selected && this.props.isAuthenticated){
            this.getExpTodoList(this.state.exp_selected);
        }
    }

    componentDidMount() {
        this.props.setGameMode(false);

        let _this = this;

        _this.props.setWaitForAction(true);

        if (this.props.isAuthenticated)
            this.isAuth();

        if (this.props.allExperiments)
            this.isExps();

        if (!this.props.isAuthenticated){
            let interval_counter = Date.now();
            LOADING_TIMEOUT = setInterval(() => {
                let elapsed_time = Date.now() - interval_counter;
                if (_this.props.isAuthenticated || elapsed_time > 500){
                    clearInterval(LOADING_TIMEOUT);
                    _this.props.setWaitForAction(false);
                    let is_still_mount = _this.checkIfMounted();
                    if (is_still_mount)
                        _this.setState({
                            isLoading: false
                        });
                }
            }, 100);
        }
        else {
            _this.setState({
                isLoading: false
            }, () => _this.props.setWaitForAction(false));
        }
    }

    onClickOnForm(e) {
        try {
            let tag = e.target.attributes.group.value;
            if (tag !== 'DROPDOWN_TAG')
                toggleOpen.bind(this)('ALL');
        }
        catch (e) {
            toggleOpen.bind(this)('ALL');
        }
    }

    handleFileUpload = e => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (evt) => {
            /* Parse data */
            const bstr = evt.target.result;

            let lines = bstr.split('\n');
/*
Online Pilot 3
user_id	age	gender	attention1	attention2	block_number trial_number trial_type conditions p_inspection inspection
fine_size profitable_side points_right points_left exchange_ratio basic_payment true_side choice trial_payoff
alternative_payoff choice_correct rt_choice block_errors final_errors block_payoff final_payoff bonus
final_payment	date	time

rows_export_3a,  rows_export_3b_final
user_id	age	gender	attention1	attention2	TrueFalse1	TrueFalse2	block_number	trial_number	trial_type	conditions	p_inspection	inspection	fine_size	profitable_side	points_right	points_left	exchange_ratio	basic_payment	true_side	choice	trial_payoff	alternative_payoff	choice_correct	rt_choice	block_errors	final_errors	block_payoff	final_payoff	bonus	final_payment	date	time

Online Pilot 1,  Online Pilot 2
user_id	age	gender attention block_number trial_number trial_type conditions p_inspection inspection
fine_size profitable_side points_right points_left exchange_ratio basic_payment true_side choice trial_payoff
alternative_payoff choice_correct rt_choice block_errors final_errors block_payoff final_payoff
bonus final_payment date time

Main Study 1,  Main Study 2
user_id age gender attention1 attention2 block_number trial_number trial_type conditions p_inspection
inspection fine_size profitable_side points_right points_left exchange_ratio basic_payment true_side
choice trial_payoff alternative_payoff choice_correct rt_choice block_errors final_errors block_payoff
final_payoff bonus final_payment date time
 */

            // rows_export_3a,  rows_export_3b_final
            let keys1 = [
                "user_id", "age", "gender", "attention1", "attention2", "TrueFalse1", "TrueFalse2", "block_number",
                "trial_number", "trial_type", "conditions", "p_inspection", "inspection", "fine_size", "profitable_side",
                "points_right", "points_left", "exchange_ratio", "basic_payment", "true_side", "choice",
                "trial_payoff", "alternative_payoff", "choice_correct", "rt_choice",
                "block_errors", "final_errors", "block_payoff", "final_payoff", "bonus", "final_payment", "date", "time"
            ];

            // Online Pilot 3
            let keys2 = [
                "user_id", "age", "gender", "attention1", "attention2", "block_number", "trial_number", "trial_type", "conditions", "p_inspection", "inspection",
                "fine_size", "profitable_side", "points_right", "points_left", "exchange_ratio", "basic_payment", "true_side", "choice",
                "trial_payoff", "alternative_payoff", "choice_correct", "rt_choice",
                "block_errors", "final_errors", "block_payoff", "final_payoff", "bonus", "final_payment", "date", "time"
            ];

            // Online Pilot 1,  Online Pilot 2
            let keys3 = [
                "user_id", "age", "gender", "attention", "block_number", "trial_number", "trial_type", "conditions",
                "p_inspection", "inspection", "fine_size", "profitable_side", "points_right", "points_left",
                "exchange_ratio", "basic_payment", "true_side", "choice", "trial_payoff", "alternative_payoff",
                "choice_correct", "rt_choice", "block_errors", "final_errors", "block_payoff", "final_payoff",
                "bonus", "final_payment", "date", "time"
            ];

            // Main Study 1,  Main Study 2
            let keys4 = [
                "user_id", "age", "gender", "attention1", "attention2", "block_number",
                "trial_number", "trial_type", "conditions", "p_inspection", "inspection", "fine_size", "profitable_side",
                "points_right", "points_left", "exchange_ratio", "basic_payment", "true_side", "choice",
                "trial_payoff", "alternative_payoff", "choice_correct", "rt_choice",
                "block_errors", "final_errors", "block_payoff", "final_payoff", "bonus", "final_payment", "date", "time"
            ];
            let keys = lines[0].split(',');

            let new_reports = [];

            lines = lines.filter((line,index) => index !== 0);

            if (lines[lines.length-1] === ''){
                lines = lines.filter((line,index) => index !== (lines.length-1));

            }

            let all_users = {};
            for (let i=0; i<lines.length; i++){
                let line = lines[i].split(',');
                let new_obj = {};
                if (all_users[line[0]] === undefined)
                    all_users[line[0]] = [];

                for (let j=0; j<keys.length; j++){
                    try {
                        if (keys[j] === 'block_number' && line[j] == 2) {
                            // block_number index 7
                            // trial_number index 8
                            let trial_number_index = keys.indexOf('trial_number');
                            let trial_number = Number(line[trial_number_index]);
                            if (trial_number === 1) {
                                trial_number = 120;
                            } else
                                trial_number--;
                            line[trial_number_index] = trial_number;
                        }
                            // inspection index 12
                            // choice_correct index 23
                            // alternative_payoff index 22
                            // im cheat, busted, wrong_answer
                            // choice_correct=0 , inspection=1 => alternative_payoff = 0
                            let inspection_index = keys.indexOf('inspection');
                            let choice_correct_index = keys.indexOf('choice_correct');
                            let alternative_payoff_index = keys.indexOf('alternative_payoff');
                            let profitable_side_index = keys.indexOf('profitable_side');
                            let choice_index = keys.indexOf('choice');
                            let true_side_index = keys.indexOf('true_side');

                            if (line[inspection_index] == 1 && line[choice_correct_index] == 0){
                                line[alternative_payoff_index] = 0;
                            }

                            if (line[profitable_side_index] === line[choice_index]  && line[profitable_side_index] !== line[true_side_index]){
                                line[alternative_payoff_index] = 0;
                            }

                            if (line[profitable_side_index] === line[true_side_index]  && line[profitable_side_index] !== line[choice_index]){
                                line[alternative_payoff_index] = 10;
                            }


                        // }
                        new_obj[keys[j]] = line[j];
                    }
                    catch (e) {
                        new_obj[keys[j]] = '';
                    }
                }

                all_users[line[0]].push(new_obj);
                // new_reports.push(new_obj);
            }

            for (let user in all_users){
                all_users[user] = all_users[user].sort(function(a, b) {
                    let a_num = (Number(a.block_number) -1) * 120 + Number(a.trial_number);
                    let b_num = (Number(b.block_number) -1) * 120 + Number(b.trial_number);
                    return a_num - b_num;
                });
            }

            for (let user in all_users){
                new_reports = [
                    ...new_reports,
                    ...all_users[user]
                ]
            }

            this.downloadCSV(file.name, new_reports);
            // var csv = new_reports.map(function(d){
            //     return JSON.stringify(Object.values(d));
            // }).join('\n');
            // var numbers = [4, 2, 5, 1, 3];
            // new_reports = new_reports.sort(function(a, b) {
            //     var nameA = a.user_id.toUpperCase(); // ignore upper and lowercase
            //     var nameB = b.user_id.toUpperCase(); // ignore upper and lowercase
            //     if (nameA < nameB) {
            //         return -1;
            //     }
            //     if (nameA > nameB) {
            //         return 1;
            //     }
            //
            //     // names must be equal
            //     return 0;
            // });
        };
        reader.readAsBinaryString(file);
    }

    convertArrayOfObjectsToCSV(args) {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;
        data = args.data || null;
        if (data === null || !data.length) {
            return null;
        }


        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function (item) {

            ctr = 0;
            keys.forEach(function (key) {
                if (ctr > 0) result += columnDelimiter;
                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }

    downloadCSV(filename, object) {

        // 'trials_data.csv' ,this.parent.state.data.rows

        let file_name;
        let csv = this.convertArrayOfObjectsToCSV({
            data: object
        });
        if (csv === null) return;

        file_name = filename ? filename : 'export.csv';

        FileDownload(csv, file_name);
    }

    render() {
        if (!this.state || this.state.isLoading || this.state.expListLoading || this.state.authLoading)
            return <div ref={this.elementRef}></div>;

        if (!this.state.isAuthenticated || !this.state.auth.user.permission.includes('Admin')) {
            return <Redirect to='/login'/>;
        }

        // if (!this.exp) {
        //     return <Redirect to='/not_found'/>;
        // }
        //
        // if (this.state.auth.user_permissions.experiments.indexOf(this.exp) < 0){
        //     return <Redirect to='/dashboard' />;
        // }

        return (
            <div
                className='admin-todo-panel'
                ref={this.elementRef}
                onClick={this.onClickOnForm}
            >
                <div>
                    <Header
                        item_selected={this.state.exp_selected}
                        list_open={this.state.experiment_list_dropdown}
                        optionsList={this.state.myExps.sort()}
                        select_item={this.select_drop_item}
                        goBack={() => {
                            return this.props.history.push(RedirectBack);
                        }}
                        reference={this}
                    />
                    <hr/>
                </div>

                <div>
                    <h3>Read CSV file in React - <a href="https://www.cluemediator.com" target="_blank" rel="noopener noreferrer">Clue Mediator</a></h3>
                    <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={this.handleFileUpload}
                    />
                </div>
            </div>
        );
    };
}

Todo.propTypes = {
    isAuthenticated: PropTypes.bool,
    setGameMode: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
    setWaitForAction: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    allExperiments: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    isAuthenticated: state.auth.isAuthenticated,
    allExperiments: state.app.allExperiments,
});

export default connect(mapStateToProps, {setGameMode, setWaitForAction, setAlert})(Todo);

/// ADD URL FOR NON ADMIN USERS
