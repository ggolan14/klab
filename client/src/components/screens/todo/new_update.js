import React, {useEffect, useState} from "react";
import './new_todo.css';
import {InputError} from "./todo";

const FileItem = ({exp, file, removeFile, setAlert}) => {
    return (
        <div
            className='admin-todo_new_todo_file'
        >
            <label
                onClick={() => removeFile(file)}
            >X</label>
            <label
                // onClick={() => downloadFile(exp, file).then(
                //     res => {
                //         try {
                //             FileDownload(res.data, file);
                //         }
                //         catch (e) {
                //             setAlert('download_failed', 'danger');
                //         }
                //
                //     })
                // }
            >{file}</label>
        </div>
    )
};

const FilesList = ({all_files, exp, removeFile}) => {

    const [allFiles, setAllFiles] = useState(all_files);
    useEffect(() => {
        setAllFiles(all_files);
    }, [all_files]);

    let files_list = [];
    try {
        if (allFiles instanceof FormData) {
            for (const value of allFiles.values()) {
                files_list.push(value.name)
            }
        }
    }
    catch (e) {

    }

    return files_list.map(
        file => {
            return (
                <FileItem
                    exp={exp}
                    key={'exp-details-general-files_list_'  + file}
                    file={file}
                    removeFile={removeFile}
                />
            )
        }
    )
};

const Files = ({newToDo, onChange}) => {

    // const [files, setFiles] = useState(new FormData());

    // useEffect(() => {
    //     if (files) {
    //         onChange('files', files);
    //     }
    // }, [files, onChange]);

    const loadFiles = (add_files) => {
        if (add_files.length > 0) {

            const data = new FormData();

            for (const value of newToDo.files.values()) {
                data.append('file', value);
            }

            for (let x = 0; x < add_files.length; x++) {
                data.append('file', add_files[x]);
            }

            // setFiles(data);
            onChange('files', data);
        }
    }

    const removeFile = (file_name) => {
        const data = new FormData();

        for (const value of newToDo.files.values()) {
            if (value.name.localeCompare(file_name))
                data.append('file', value);
        }

        // setFiles(data);
        onChange('files', data);
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
                <FilesList removeFile={removeFile} exp={newToDo.exp} all_files={newToDo.files}/>
            </div>
        </>
    )
};

const Direction = ({newToDo, onChange}) => {
    return (
        <>
            <label>Direction</label>
            <select
                onChange={e => onChange('direction', e.target.value)}
                value={newToDo.direction}
            >
                <option value='ltr'>ltr</option>
                <option value='rtl'>rtl</option>
            </select>
        </>
    )
};

const Subject = ({newToDo, onChange}) => {
    return (
        <>
            <label>Subject</label>
            <input
                style={{
                    direction: newToDo.direction,
                    // textAlign: direction === 'rtl'? 'right' : 'left'
                }}
                onChange={e => onChange('subject', e.target.value)}
                value={newToDo.subject}
            />
        </>
    )
};

const Description = ({newToDo, onChange}) => {
    return (
        <>
            <label>Description</label>
            <textarea
                style={{
                    direction: newToDo.direction,
                    // textAlign: direction === 'rtl'? 'right' : 'left'
                }}
                onChange={e => onChange('description', e.target.value)}
                value={newToDo.description}
            />
        </>
    )
};

export const NewUpdateToDoItem = ({exp, user_email, newToDoCB}) => {
    const [newToDo, setNewToDo] = useState({
        exp,
        open_by: user_email,
        subject: '',
        description: '',
        direction: 'ltr',
        files: [],
        status: 'SENT',
    });

    const [todoError, setToDoError] = useState([]);

    const onChange = (attr, value) => {
        let new_todo = {...newToDo};
        new_todo[attr] = value;
        setNewToDo(new_todo);
    }

    const onClick = (action) => () => {
        if (action === 'Save'){
            const {subject, description} = newToDo;
            let errors = [];
            if (subject === '')
                errors.push('Subject');
            if (description === '')
                errors.push('Description');

            if (errors.length > 0)
                return setToDoError(errors);


            newToDoCB('Save', newToDo);
        }
        else {
            newToDoCB('Cancel', null);
        }
    }

    return (
        <div
            className='admin-todo_new_todo'
        >
            <InputError setToDoError={setToDoError} todoError={todoError} />

            <div className={'admin-todo_new_todo_w ' + (todoError.length > 0 ? 'dimming-page' : '')}>
                <label>New ToDo:</label>

                <div
                    className='admin-todo_new_todo_body'
                >

                    <Direction onChange={onChange} newToDo={newToDo} />

                    <Subject onChange={onChange} newToDo={newToDo} />

                    <Description onChange={onChange} newToDo={newToDo} />

                    <Files onChange={onChange} newToDo={newToDo} />
                </div>

                <div className='admin-todo_new_todo_btn'>
                    <button className='save' onClick={onClick('Save')}>Save</button>
                    <button className='cancel' onClick={onClick('Cancel')}>Cancel</button>
                </div>
            </div>

        </div>
    )
}
