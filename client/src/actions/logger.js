import api from "../utils/api";

export const NewLogs = async (logs) => {

    const body = JSON.stringify({logs});

    try {
        const res = await api.post('/logger', body);
        return res;
    } catch (err) {
    }
};

export const getLogsRuns = async (exp) => {

    try {
        const res = await api.get(`/logger/logs_runs/${exp}`);
        return res;
    } catch (err) {
    }
};

export const getUsersOfRunnerList = async (exp, run) => {
    try {
        const res = await api.get(`/logger/users_of_run/${exp}&${run}`);
        return res;
    } catch (err) {
    }
}

export const getLogsOfUser = async (exp, run, user_id) => {
    const body = JSON.stringify({exp, run, user_id});

    try {
        const res = await api.post(`/logger/logs_of_users/`, body);
        return res;
    } catch (err) {
    }
}

export const getOutSourceIPLogs = async (exp, ip, user_id) => {
    const body = JSON.stringify({exp, ip, user_id});

    try {
        const res = await api.post(`/logger/outs_ip_logs/`, body);
        return res;
    } catch (err) {
    }
}
