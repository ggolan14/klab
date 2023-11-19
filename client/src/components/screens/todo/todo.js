import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {setGameMode, setWaitForAction} from "../../../actions/app_actions";
import './todo.css';
import { toggleOpen} from "../dropdown/dropdown";
import { addExpTodo, uploadTodoFiles} from "../../../actions/exp_actions";
import {setAlert} from "../../../actions/alert";
import {Header} from "../../layout/header/header";
import {NewUpdateToDoItem} from "./new_update";
import ToDoList from "./todo_lists";
import {preventPageGoBack, setCurrentExp} from "../../../utils/helpers";
import CodeError from "../../layout/error";
// import {SetQueueTurns} from "./queue_turns";

export const InputError = ({todoError, setToDoError}) => {

    if (todoError.length === 0)
        return <></>;

    return (
        <div className='todo_error'>
            <label>The following fields cannot be empty:</label>
            {
                todoError.map(
                    todo_err => (
                        <label style={{color: 'red'}} key={todo_err}>
                            {todo_err}
                        </label>
                    )
                )
            }
            <button onClick={() => setToDoError([])}>OK</button>
        </div>
    )
};

const ExpPosition = ({exp, todo_queue}) => {

    const [expTurn, setExpTurn] = useState(null);
    useEffect(() => {
        let todo_index = todo_queue.indexOf(exp);
        if (todo_index > -1)
            setExpTurn(todo_index+1);
    }, [todo_queue, exp]);

    if (expTurn === null) return <></>;

    return (
        <div
            className='admin-todo-exp_turn'
        >
            Experiment turn: <span>{expTurn}</span>
        </div>
    )
}

class Todo extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;

        let exp = undefined;
        try {
            exp = this.props.location.state.exp;
        }
        catch (e){
        }

        setCurrentExp(exp);

        this.state = {
            auth: props.auth,
            isAuthenticated: props.isAuthenticated,
            isLoading: false,
            exp_selected: exp,
            experiment_list_dropdown: false,
            todo_list: props.todo.todo_list,
            todo_queue: props.todo.todo_queue,
            AllExperiments: this.props.auth.user.Experiments,
            new_todo: false
        };

        this.select_drop_item = this.select_drop_item.bind(this);
        this.onClickOnForm = this.onClickOnForm.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.todo !== this.props.todo){
            this.setState({
                todo_list: this.props.todo.todo_list,
                todo_queue: this.props.todo.todo_queue,
            });
        }
    }

    componentDidMount() {
        this.props.setGameMode(false);
        preventPageGoBack();
    }

    select_drop_item(item, tag) {
        if (tag === 'EXP'){
            let sc = this.state;
            sc.exp_selected = item;
            setCurrentExp(item);
            this.setState(sc);
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

    loadFiles(files){
        // uploadExpFiles({
        //     exp: this.state.exp_details.exp,
        //     data
        // }).then(
        //     res => {
        //         try {
        //             if (res.data.error ){
        //                 this.props.setWaitForAction(false);
        //                 this.props.setAlert(res.data.error, 'danger');
        //             }
        //             else {
        //                 let sc = this.state;
        //                 sc.exp_details.files = res.data.all_files;
        //                 this.setState(sc, () => {
        //                     this.props.setWaitForAction(false);
        //                     this.props.setAlert(res.data.msg, 'success');
        //                 });
        //             }
        //         }
        //         catch (e) {
        //             this.props.setWaitForAction(false);
        //             this.props.setAlert('Some error happened, please try later', 'danger');
        //         }
        //     }
        // );
    }

    newToDoCB = (action, todo_in) => {
        let sc = this.state;
        sc.new_todo = action === 'New';

        if (action === 'Save'){
            this.props.setWaitForAction(true);

            let file_size = 0;
            for (const value of todo_in.files.values()) {
                file_size++;
            }

            let item = {
                exp: todo_in.exp,
                open_by: todo_in.open_by,
                subject: todo_in.subject,
                description: todo_in.description,
                direction: todo_in.direction,
                status: todo_in.status,
                no_files:  file_size === 0
            };

            addExpTodo(item).then(
                res => {
                    try {
                        const {error, todo_item} = res.data;
                        if (error)
                            throw new CodeError('err', 404);

                        if (!file_size){
                            this.props.setAlert('Todo item add successfully', 'success');
                            this.props.setWaitForAction(false);
                            this.setState(sc);
                            return;
                        }
                        const todo_id = todo_item._id;

                        uploadTodoFiles({
                            exp: todo_item.exp,
                            todo_id,
                            is_new: 'YES',
                            data: todo_in.files
                        }).then(
                            res2 => {
                                try {
                                    const {error, files_error} = res2.data;

                                    if (error)
                                        throw new CodeError('err', 404);

                                    let msg = '';
                                    if (files_error.length > 0)
                                        msg = 'Some file not added ' + files_error.join(', ');
                                    else
                                        msg = 'Todo item add successfully'
                                    this.props.setAlert(msg, 'success');
                                    this.props.setWaitForAction(false);
                                    this.setState(sc);

                                }
                                catch (e) {
                                    this.props.setAlert('Upload error', 'danger');
                                    this.props.setWaitForAction(false);
                                    this.setState(sc);
                                }
                            }
                        )
                    }
                    catch (e) {
                        this.props.setAlert('Error #1', 'danger');
                        this.props.setWaitForAction(false);
                        this.setState(sc);
                    }
                }
            )
        }
        else {
            this.setState(sc);
        }
    }

    render() {
        return (
            <div
                className='admin-todo-panel'
                onClick={this.onClickOnForm}
            >
                <Header
                    item_selected={this.state.exp_selected}
                    list_open={this.state.experiment_list_dropdown}
                    optionsList={this.state.AllExperiments.sort()}
                    select_item={this.select_drop_item}
                    reference={this}
                />

                {/*{isSuperAdminUser() && (*/}
                {/*    <SetQueueTurns*/}
                {/*        todo_queue={this.state.todo_queue}*/}
                {/*    />*/}
                {/*)}*/}

                {/*<ExpPosition exp={this.state.exp_selected} todo_queue={this.state.todo_queue} />*/}

                {
                    this.state.exp_selected && !this.state.new_todo && (
                        <label className='admin-todo-panel-add_new_todo' onClick={() => this.newToDoCB('New')}>Add new ToDo</label>
                    )
                }

                {
                    this.state.exp_selected && this.state.new_todo && (
                        <NewUpdateToDoItem
                          newToDoCB={this.newToDoCB}
                          exp={this.state.exp_selected}
                          user_email={this.state.auth.user.email}
                        />
                    )
                }
                {
                    this.state.exp_selected? (
                        <ToDoList
                            todo_list={this.state.todo_list[this.state.exp_selected]}
                        />
                    ) : (
                        <label>Select experiment</label>
                    )
                }
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
    todo: PropTypes.object,
};

const mapStateToProps = state => ({
    auth: state.auth,
    isAuthenticated: state.auth.isAuthenticated,
    todo: state.todo,
});

export default connect(mapStateToProps, {setGameMode, setWaitForAction, setAlert})(Todo);

/// ADD URL FOR NON ADMIN USERS
