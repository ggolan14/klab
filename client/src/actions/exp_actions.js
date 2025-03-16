import axios from 'axios';
import api from "../utils/api";
import api_download from "../utils/api_download";
import api_upload from "../utils/api_upload";
const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};
const download_config = {
    headers: {
        'Content-Type': 'application/json'
    },
    responseType: 'blob',
};

/* ################## Lists ####################### */

export const getUsersAndExpsList = async () => {
    try {
        const res = await api.get('/exps_actions/exps_users_list');
        return res;
    } catch (err) {
    }
}

export const getExpsList = async () => {
    try {
        const res = await api.get('/exps_actions/exps_list');
        return res;
    } catch (err) {
    }
}

export const getExpVerList = async (exp) => {
    try {
        const res = await api.get(`/exps_actions/exp_ver_list/${exp}`);
        return res;
    } catch (err) {
    }
}

/* ################## Lists ####################### */




/* ################## ActiveSettings ####################### */

export const getActiveSettings = async ({exp}) => {
    try {
        const res = await api.get(`/exps_actions/active_settings/${exp}`);
        return res;
    } catch (err) {
        return {error: true};
    }
};

export const saveActiveSettings = async ({user_id, active_settings}) => {
    try {
        const res = await api.put('/exps_actions/active_settings', {user_id, active_settings});
        return res;
    } catch (err) {
    }
};

/* ################## ActiveSettings ####################### */




/* ################## Version ####################### */

export const getGameVersion = async (exp, user, chk, ng) => {
    try {
        const res = await api.get(`/exps_actions/ver/${exp}&${user}&${chk}&${ng}`);
        return res;
    } catch (err) {
    }
};

export const getVersion = async (exp) => {
    try {
        const res = await api.get(`/exps_actions/admin_version/${exp}`);
        return res;
    } catch (err) {
    }
};

export const getSpecificSettings = async ({exp, version}) => {
    try {
        const res = await api.get(`/exps_actions/specific_version/${exp}&${version}`);
        return res;
    } catch (err) {
    }
};

export const saveSettings = async ({exp, version, user_id, version_before}) => {

    const body = {exp, version, user_id, version_before};

    try {
        const res = await api.put('/exps_actions/version', body);
        return res;
    } catch (err) {
    }
};

export const newSettings = async ({exp, action, version, user_id}) => {

    const body = {exp, action, version, user_id};

    try {
        const res = await api.post('/exps_actions/new_version', body);
        return res;
    } catch (err) {
    }
};

export const deleteSettings = async ({exp, version, user_id}) => {

    try {
        const res = await api.delete(`/exps_actions/version/${exp}&${version}&${user_id}`);
        return res;
    } catch (err) {
    }
};

/* ################## Version ####################### */





/* ################## Counter ####################### */

export const addNewRunning = async ({exp, running_name}) => {

    try {
        const res = await api.post('/exps_actions/running/', {exp, running_name});
        return res;
    } catch (err) {
    }
};

export const modifyCounter = async ({exp, running_name, action, user_id}) => {
    const body = { exp, running_name, user_id};

    try {
        let res;
        if (action === 'reset'){
            res = await api.put('/exps_actions/running', body);
        }
        else if (action === 'remove') {
            res = await api.delete(`/exps_actions/running/${exp}&${running_name}&${user_id}`);
        }
        return res.data;

    } catch (err) {
    }
}

// export const increaseCounter = async ({exp, running_name, user_id}) => {
//     const body = { exp, running_name, user_id};
//
//     try {
//         const res = await api.put('/exps_actions/i_running', body);
//         return res.data;
//
//     } catch (err) {
//     }
// }

/* ################## Counter ####################### */






/* ################## ConsentForm ####################### */

export const getConsentForm = async ({exp, version}) => {

    try {
        const res = await api.get(`/exps_actions/consent_form/${exp}&${version}`);
        return res;
    } catch (err) {
    }
};

export const getGameConsentForm = async (exp) => {

    try {
        const res = await api.get(`/exps_actions/cf/${exp}`);
        return res;
    } catch (err) {
    }
};

export const saveConsentForm = async ({id, consent_form, user_id}) => {

    const body = {id, consent_form, user_id};

    try {
        const res = await api.put('/exps_actions/consent_form/', body);
        return res;
    } catch (err) {
    }
};

/* ################## ConsentForm ####################### */






/* ################## ExpDev ####################### */

export const getExpDevDetails = async ({exp}) => {
    try {
        const res = await api.get(`/exps_actions/exp_dev/${exp}`);
        return res;

    } catch (err) {

    }
};

export const AddNewExp = async ({NewExp}) => {
    const body = {NewExp};

    try {
        const res = await api.post(`/exps_actions/new_exp/`, body);
        return res;
    } catch (err) {
    }
};

export const saveExpDevDetails = async ({id, user_id, description, version_of, status}) => {

    const body = {id, user_id, description, version_of, status};

    try {
        const res = await api.put('/exps_actions/exp_dev', body);
        return res;
    } catch (err) {
    }
};

/* ################## ExpDev ####################### */





/* ################## FILES ####################### */

export const uploadExpFiles = async ({exp, from, action, data}) => {

    try {
        const res = await api.post(`/exps_actions/file/${exp}&${from}&${action}`, data);
        // const res = await api.post('/exps_actions/file/'+exp, data);
        return res;
    } catch (err) {
    }
};

export const downloadFile = async (exp, file_name, action) => {
    try {
        // const res = await api.get(`/exps_actions/file/${exp}&${file_name}`);
        // const res = await axios.get('/api/exps_actions/file', Object.assign({}, download_config, {
        //     params: {
        //         exp, file_name, action
        //     }
        // }));

        // return res;
    } catch (err) {
    }
};

export const deleteUploadExpFile = async ({exp, file_name, user_id}) => {

    try {
        const res = await api.delete(`/exps_actions/file/${exp}&${file_name}&${user_id}`);

        return res;
    } catch (err) {
    }
};

/* ################## FILES ####################### */





/* ################## CHAT ####################### */

// export const getExpChat = async ({exp}) => {
//     try {
//         const res = await api.get(`/exps_actions/chat/${exp}`);
//         return res;
//     } catch (err) {
//     }
// };

export const addExpChat = async ({exp, from, message, m_type, direction}) => {
    const body = {exp, from, message, m_type, direction};

    try {
        const res = await api.post('/exps_actions/chat', body);
        return res;
    } catch (err) {
    }
};

/* ################## CHAT ####################### */



/* ################## REPORTS ####################### */


export const getExpRuns = async (exp) => {

    try {
        const res = await api.get(`/exps_actions/exp_runs/${exp}`);
        return res;
    } catch (err) {
    }
};

export const getRunVers = async (exp, run) => {

    const body = JSON.stringify({exp, run});

    try {
        const res = await api.post(`/exps_actions/run_vers/`, body);
        return res;
    } catch (err) {
    }
};

export const getRunVerUsers = async (exp, run, ver) => {
    const body = JSON.stringify({exp, run, ver});

    try {
        const res = await api.post(`/exps_actions/run_ver_users/`, body);
        return res;
    } catch (err) {
    }
};


export const getFilters = async (exp, filters) => {
    const body = JSON.stringify({
        exp, filters
    });

    try {
        const res = await api.post(`/exps_actions/get_filters`, body);
        return res;
    } catch (err) {
    }
};

export const downloadUserData = async (exp, filters) => {
    const body = {exp, filters};

    try {
        // const res = await api.post('/exps_actions/download_data', Object.assign({}, download_config, {
        //     params: {
        //         exp, filters, tables
        //     }
        // }));
        const res = await api.get(`/exps_actions/download_data/`, {
            ...download_config,
            params: body
        });
        // const blob = await res.data.blob();

        return res;
    } catch (err) {
        return err;
    }
};

export const downloadWpImages = async (exp, filters) => {

    try {
        // const res = await axios.get('/api/exps_actions/wp_images', Object.assign({}, download_config, {
        //     params: {
        //         exp, filters
        //     }
        // }));
        // return res;
    } catch (err) {
    }
};

// export const deleteDataDB = async (data_to_delete) => {
//
//     const body = JSON.stringify({data_to_delete: data_to_delete});
//
//     try {
//         const res = await axios.post('/api/exps_actions/delete_data', body, config);
//         return res;
//     } catch (err) {
//     }
// };

/* ################## REPORTS ####################### */




/* ################## GAME ####################### */

export const getEndCode = async ({ex, ve, ex_id, user_id}) => {
    try {
        const res = await api.get(`/exps_actions/rdc/${ex}&${ve}&${ex_id}&${user_id}`);
        return res;
    } catch (err) {
    }
}

export const getExpState = async (exp) => {

    try {
        const res = await api.get('/exps_actions/st_ex/' + exp);

        return res;
    } catch (err) {
    }
};

export const OpenNewRecord = async ({Exp, UserId, Records, RunningName, Date, ISA, Mode, Version}) => {

    const body = {Exp, UserId, Records, RunningName, cDate: Date, ISA, Mode, Version};

    try {
        const res = await api.post('/exps_actions/new_game', body);
        return res;
    } catch (err) {
    }
};

export const RecordGame = async ({Exp, ExpID, Records}) => {

    const body = {Exp, ExpID, Records};

    try {
        const res = await api.post('/exps_actions/record_game', body);
        return res;
    } catch (err) {
    }
};

export const FinishRecordGame = async ({Exp, ExpID, Records, Date}) => {

    const body = {Exp, ExpID, Records, Date};

    try {
        const res = await api.post('/exps_actions/finish_game', body);
        return res;
    } catch (err) {
    }
};

/* ################## GAME ####################### */





/* ################## ExpTodo ####################### */

export const getExpTodo = async ({exp}) => {

    try {
        const res = await axios.get('/api/exps_actions/exp_todo', Object.assign({}, config, {
            params: {exp}
        }));
        return res;
    } catch (err) {

    }
};

export const addExpTodo = async (todo_item) => {

    const body = JSON.stringify(todo_item);

    try {
        const res = await api.post('/exps_actions/todo', body);
        return res;
    } catch (err) {

    }

};

export const updateExpTodo = async ({id, subject, description, direction, status}) => {

    const body = JSON.stringify({id, subject, description, direction, status});

    try {
        const res = await api.put('/exps_actions/todo', body);

        return res;
    } catch (err) {

    }

};

export const removeExpTodo = async (id) => {
    try {
        const res = await api.delete(`/exps_actions/todo/${id}`);

        return res;
    } catch (err) {

    }

};

export const deleteTodoFile = async ({exp, file_name, todo_id}) => {

    try {
        const res = await api.delete(`/exps_actions/todo/file/${exp}&${file_name}&${todo_id}`);

        return res;
    } catch (err) {
    }
};

export const uploadTodoFiles = async ({exp, todo_id, is_new, data}) => {

    try {
        const res = await api_upload.post(`/exps_actions/todo/file/${exp}&${todo_id}&${is_new}`, data);
        // const res = await api.post('/exps_actions/file/'+exp, data);

        return res;
    } catch (err) {
        return err;
    }
};

export const updateTodoQueue = async (todo_queue) => {

    const body = JSON.stringify(todo_queue);

    try {
        const res = await api.post('/exps_actions/todo/queue', body);

        return res;
    } catch (err) {

    }

};

export const downloadToDoFile = async (exp, todo_id, file_name) => {
    try {
        const res = await api_download.get('/exps_actions/todo/file', {
            params: {
                exp, todo_id, file_name
            }
        });
        return res;
    } catch (err) {
    }
};

/* ################## ExpTodo ####################### */




/* ################## ExpVerChanges ####################### */

export const getExpVerChanges = async ({exp}) => {
    try {
        const res = await axios.get('/api/exps_actions/exp_ver_changes', Object.assign({}, config, {
            params: {exp}
        }));
        return res;
    } catch (err) {
    }
};
export const addExpVerChanges = async ({request_by, header, description}) => {

    const body = JSON.stringify({request_by, header, description});

    try {
        const res = await axios.post('/api/exps_actions/exp_ver_changes', body, config);
        return res;
    } catch (err) {
    }
};

/* ################## ExpVerChanges ####################### */
