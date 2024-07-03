import {GetStoreState} from "../store";

export const checkDigit = (i) => {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
};

export const getTimeDate = (input_date) => {
    let cur_date = input_date? new Date(input_date) : new Date();
    let now = Date.now();
    let date = checkDigit(cur_date.getDate()) + "-" + checkDigit(cur_date.getMonth() + 1) + "-" + cur_date.getFullYear();
    let time = checkDigit(cur_date.getHours()) + ':' + checkDigit(cur_date.getMinutes()) + ':' + checkDigit(cur_date.getSeconds());

    return {
        time, date, now
    }
}

export const getMyExps = () => {
    let myExps;
    try {
        const allExperiments = GetStoreState().app.allExperiments;
        const user_experiments = GetStoreState().auth.user_permissions.experiments;
        myExps = allExperiments.filter(
            exp => user_experiments.indexOf(exp) > -1
        );

        myExps = myExps.sort();
    }
    catch (e) {
        myExps = [];
    }
    return myExps;
}

export const isAdminUser = () => {
    try {
        const permission = GetStoreState().auth.user.permission;
        return permission.includes('Admin');
    }
    catch (e) {
        return false;
    }
}

export const isSuperAdminUser = () => {
    try {
        const permission = GetStoreState().auth.user.permission;
        return permission === 'SuperAdmin';
    }
    catch (e) {
        return false;
    }
}

export const isDevUser = () => {
    try {
        const {email, permission} = GetStoreState().auth.user;
        return permission === 'SuperAdmin' && email === 'ggolan@technion.ac.il';
    }
    catch (e) {
        return false;
    }
}

export const isValidExperiment = experiment => {
    try {
        const allExperiments = GetStoreState().app.allExperiments;
        if (allExperiments.indexOf(experiment) !== -1)
            return true;
        return false;
    }
    catch (e) {
        return false
    }
}

export const getFormatDate = (date) => {
    let new_date = new Date(date);
    let format_date = checkDigit(new_date.getDate()) + '-' + checkDigit(new_date.getMonth() + 1) + '-' + checkDigit(new_date.getFullYear());
    return format_date;
}

export const getFormatTime = (date) => {
    let new_date = new Date(date);
    let format_time = checkDigit(new_date.getHours()) + ':' + checkDigit(new_date.getMinutes()) + ':' + checkDigit(new_date.getSeconds());
    return format_time;
}

export const getDataDatesArray = (data_array, data_obj) => {
    let DATA = [];
    let dates = {};
    for (let i=0; i<data_array.length; i++){
        let full_date = getFormatDate(data_array[i].date);
        let time = getFormatTime(data_array[i].date);
        if (dates[full_date] === undefined)
            dates[full_date] = [];

        let new_data = {};
        for (let key in data_obj){
            new_data[key] = data_array[i][key];
        }

        dates[full_date].push(Object.assign({}, new_data, {time}));

    }

    for (let date_sec in dates){
        DATA.push({
            title: date_sec,
            data: dates[date_sec]
        });
    }

    return DATA;
}

export const copyToClipboard = (text) => {
    if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        return window.clipboardData.setData("Text", text);

    }
    else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        }
        catch (ex) {
            // console.warn("Copy to clipboard failed.", ex);
            return false;
        }
        finally {
            document.body.removeChild(textarea);
        }
    }
};

export const adjustFont = (textRef) => {
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

export const adjustFont2 = (textRef, minus) => {
    let clientWidth, scrollWidth;

    try{
        textRef.current.style.fontSize = '50px';

        do {
            clientWidth = textRef.current.clientWidth;
            scrollWidth = textRef.current.scrollWidth;
            // pageYOffset
            if (scrollWidth>clientWidth) {
                let current_font_size = Number(textRef.current.style.fontSize.replace('px', ''));
                let new_size = (current_font_size - 0.5);
                if (new_size <= 0) break;
                textRef.current.style.fontSize = new_size + 'px';
            }

        }
        while (scrollWidth>clientWidth);

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
