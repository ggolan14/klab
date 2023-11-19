import React, {useEffect, useState} from "react";
import {
    deleteTodoFile,
    downloadToDoFile,
    removeExpTodo,
    updateExpTodo,
    uploadTodoFiles
} from "../../../actions/exp_actions";
import './todo_list.css';
import {useDispatch} from "react-redux";
import {getFormatDate, isDevUser} from "../../../utils/app_utils";
import FileDownload from "js-file-download";
import {setWaitForAction} from "../../../actions/app_actions";
import {setAlert} from "../../../actions/alert";

const LabelValue = ({label_}) => {
    return (
        <>
            <label>{label_.title}</label>
            <label>{label_.value}</label>
        </>
    )
};

const Description = ({todo_item, onChange}) => {
    return (
        <>
            <label>Description</label>
            <textarea
                style={{
                    direction: todo_item.direction,
                    // textAlign: direction === 'rtl'? 'right' : 'left'
                }}
                onChange={e => onChange('description', e.target.value)}
                value={todo_item.description}
            />
        </>
    )
};

const Subject = ({todo_item, onChange}) => {
    return (
        <>
            <label>Subject</label>
            <input
                style={{
                    direction: todo_item.direction,
                    textAlign: todo_item.direction === 'rtl'? 'right' : 'left'
                }}
                onChange={e => onChange('subject', e.target.value)}
                value={todo_item.subject}
            />
        </>
    )
};

const RemoveWarning = ({remove, removeCB}) => {

    return (
        <div className='remove_warning'>
            <div>
                <label>Remove <span>{remove}</span>?</label>
                <div>
                    <button onClick={() => removeCB('Yes')}>Yes</button>
                    <button onClick={() => removeCB('No')}>No</button>
                </div>
            </div>
        </div>
    )
};

const Status = ({todo_item, onChange}) => {

    const is_dev_user = isDevUser();
    let user_options = ['SENT', 'FREEZE', 'CANCELED'];
    if (is_dev_user){
        user_options = [...user_options, ...['ACCEPT', 'DEV', 'DONE']]
    }
    // if (!is_dev_user)
    //     return (
    //         <>
    //             <label className='status'>Status:</label>
    //             <label className='status'>{todo_item.status}</label>
    //         </>
    //     );
    return (
        <>
            <label className='status'>Status:</label>
            <select
                onChange={e => onChange('status', e.target.value)}
                value={todo_item.status}
            >
                {
                    user_options.map(
                        status => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        )
                    )
                }
            </select>
        </>
    )
};

const FileItem = ({exp, todo_id, file}) => {
    const [removeWar, setRemoveWar] = useState(null);
    const dispatch = useDispatch();

    const remove_file = remove => {

        if (remove === 'Yes'){
            dispatch(setWaitForAction(true));
            deleteTodoFile({
                exp, file_name: file, todo_id
            }).then(
                res => {
                    dispatch(setWaitForAction(false));

                    try {
                        const {msg, error} = res.data;
                        dispatch(setAlert(msg || error, error?'danger':'success'));
                    }
                    catch (e) {
                        dispatch(setAlert('Error', 'danger'));
                    }

                }
            )
        }
        setRemoveWar(null);
    }

    const download_file = () => {
        dispatch(setWaitForAction(true));

        downloadToDoFile(exp, todo_id, file).then(
            res => {
                dispatch(setWaitForAction(false));

                try {
                    FileDownload(res.data, file);
                }
                catch (e) {
                    dispatch(setAlert('Error', 'danger'));
                }


            }
        )
    }
    return (
        <>
            {
                removeWar !== null && (
                    <RemoveWarning remove={removeWar} removeCB={remove_file} />
                )
            }
            <div
                className='admin-todo_new_todo_file'
            >
                <label
                    onClick={() => setRemoveWar(file)}
                >X</label>
                <label
                    onClick={download_file}
                >{file}</label>
            </div>
        </>
    )
};

const Files = ({todoItem}) => {

    const dispatch = useDispatch();

    const loadFiles = (files) => {
        if (files.length > 0){
            dispatch(setWaitForAction(true));

            const data = new FormData();

            for(let x=0; x<files.length; x++) {
                data.append('file', files[x]);
            }

            uploadTodoFiles({
                exp: todoItem.exp,
                todo_id: todoItem._id,
                is_new: 'NO',
                data
            }).then(
                res => {
                    dispatch(setWaitForAction(false));
                    try {
                        const {msg, error} = res.data;
                        dispatch(setAlert(msg || error, error?'danger':'success'));
                    }
                    catch (e) {
                        dispatch(setAlert('Error', 'danger'));
                    }
                }
            );
        }

        // let sc = this.state;
        // sc.selectedFiles = [...sc.selectedFiles, ...files];
        // this.setState(sc, () => this.props.setAlert('Files will complete upload after saving', 'attention'));
    }
    return (
        <>
            <div
                className='admin-todo_new_todo_choose-file'
            >
                <input
                    type="file"
                    multiple
                    onChange={event => loadFiles(event.target.files)}
                    name="file_chosen"
                    id="file_chosen"
                    style={{display: "none"}}
                />
                <label className="choose-file" htmlFor="file_chosen">Add files</label>
            </div>

            <div className='admin-todo_new_todo_files'>
                {
                    todoItem.files.map(
                        (file, f_i) => {
                            return (
                                <FileItem
                                    key={f_i  + file}
                                    exp={todoItem.exp}
                                    todo_id={todoItem._id}
                                    file={file}
                                />
                            )
                        })
                }
            </div>
        </>
    )
};

const ToDoItemInfo = ({todo_item}) => {

    const [todoItem, setTodoItem] = useState(null);
    const [removeWar, setRemoveWar] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        setTodoItem({...todo_item});
    }, [todo_item]);

    const remove_todo = remove => {

        if (remove === 'Yes'){
            dispatch(setWaitForAction(true));

            removeExpTodo(todo_item._id).then(
                res => {
                    dispatch(setWaitForAction(false));

                    try {
                        const {msg, error} = res.data;
                        dispatch(setAlert(msg || error, error?'danger':'success'));
                    }
                    catch (e) {
                        dispatch(setAlert('Error', 'danger'));
                    }

                }
            )
        }
        setRemoveWar(null);
    }

    const update_todo = () => {
        dispatch(setWaitForAction(true));

        updateExpTodo({
            id: todoItem._id,
            subject: todoItem.subject,
            description: todoItem.description,
            direction: todoItem.direction,
            status: todoItem.status,
        }).then(
            res => {
                dispatch(setWaitForAction(false));

                try {
                    const {msg, error} = res.data;
                    dispatch(setAlert(msg || error, error?'danger':'success'));
                }
                catch (e) {
                    dispatch(setAlert('Error', 'danger'));
                }


            }
        )
    }

    const onChange = (attr, value) => {
        let update_todo = {...todoItem};
        update_todo[attr] = value;
        setTodoItem(update_todo);
    }

    if (!todoItem)
        return <></>;

    const {open_by, createdAt, updatedAt} = todoItem;

    const labels = [
        {title: 'Open:', value: open_by},
        {title: 'Created at:', value: getFormatDate(createdAt)},
        {title: 'Last updated at:', value: getFormatDate(updatedAt)},
    ];

    return (
        <>
            {
                removeWar !== null && (
                    <RemoveWarning remove={removeWar} removeCB={remove_todo} />
                )
            }
            <div className={'admin-todo-item_info ' + (removeWar !== null ? 'disabledElem' : '')}>
                <div className='admin-todo-item_info_b'>
                    <Subject todo_item={todoItem} onChange={onChange} />
                    <Status todo_item={todoItem} onChange={onChange}/>
                    <label>Direction:</label>
                    <select
                        value={todoItem.direction}
                        onChange={e => onChange('direction', e.target.value)}
                    >
                        <option value='rtl'>rtl</option>
                        <option value='ltr'>ltr</option>
                    </select>
                    {
                        labels.map(
                            label_ => (
                                <LabelValue key={label_.title} label_={label_}/>
                            )
                        )
                    }

                    <Description todo_item={todoItem} onChange={onChange} />
                    <Files todoItem={todoItem}/>
                </div>

                <div className='admin-todo-item_info_btn'>
                    <button className='update' onClick={update_todo}>Update</button>
                    <button className='remove' onClick={() => setRemoveWar('todo')}>Remove</button>
                </div>
            </div>
        </>
    )
};

const ToDoItem = ({todo_item}) => {

    const [expand, setExpand] = useState(false);
    return (
        <div
            className='admin-todo-todo_item'
        >
            <div
                className={'admin-todo-todo_item_h ' + (expand?'expand':'')}
                onClick={() => setExpand(!expand)}
            >
                <label className='plus'>{expand?'-':'+'}</label>
                <label className='update_at'>{getFormatDate(todo_item.updatedAt)}</label>
                <label className='status'>{todo_item.status}</label>
                <label
                    className='subject'
                    style={{
                        direction: todo_item.direction,
                        textAlign: todo_item.direction === 'rtl'? 'right' : 'left'
                    }}
                >{todo_item.subject}</label>
            </div>
            {expand && <ToDoItemInfo todo_item={todo_item}/>}
        </div>
    )
};

const TodoFilter = ({all_status, todoFilter, setToDoFilter}) => {

    return (
        <div
            className='admin-todo-filter'
        >
            <label>Filter</label>
            <select
                value={todoFilter}
                onChange={e => setToDoFilter(e.target.value)}
            >
                {
                    all_status.map(
                        status => (
                            <option
                                key={status}
                            >
                                {status}
                            </option>
                        )
                    )
                }
            </select>
        </div>
    )
};

const ToDoList = ({todo_list}) => {

    const [todoList, setToDoList] = useState( []);
    const [todoFilter, setToDoFilter] = useState( 'All');

    useEffect(() => {
        setToDoList(todo_list);
    }, [todo_list]);

    const all_status = Array.from((new Set(todoList.map(t => t.status))));
    all_status.push('All');

    const filtered_list = todoList.filter(t => (todoFilter === 'All' || t.status === todoFilter));

    return (
        <div
            className='admin-todo-todo_list'
        >
            <TodoFilter
                todoFilter={todoFilter}
                setToDoFilter={setToDoFilter}
                all_status={all_status}
            />

            {
                filtered_list.map(
                    (todo_item, todo_item_index) => (
                        <ToDoItem key={todo_item_index+todo_item._id} todo_item={todo_item} />
                    )
                )
            }
        </div>
    )
};

export default ToDoList;
