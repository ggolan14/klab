const checkDigit = (i) => {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
};

const getTimeDate = () => {
    let cur_date = new Date();
    let date = checkDigit(cur_date.getDate()) + "-" + checkDigit(cur_date.getMonth() + 1) + "-" + cur_date.getFullYear();
    let time = checkDigit(cur_date.getHours()) + ':' + checkDigit(cur_date.getMinutes()) + ':' + checkDigit(cur_date.getSeconds());

    return {
        time, date
    }
}



exports.getTimeDate = getTimeDate;
exports.checkDigit = checkDigit;
