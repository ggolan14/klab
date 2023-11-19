import {getExperimentPaths} from "../data/experiments";

export const preventPageGoBack = () => {
    window.history.pushState(null, null, document.URL);
    window.addEventListener('popstate', function () {
        window.history.pushState(null, null, document.URL);
    });
}

export const GoBack = (redirect_to) => {
    window.location.replace(redirect_to || '/');
}

export const setCurrentExp = (exp) => {
    localStorage.setItem('exp', exp);
}

export const getCurrentExp = () => {
    const exp = localStorage.getItem('exp');
    if ([undefined, 'undefined'].indexOf(exp) === -1)
        return exp;
    return null;
}

export const getRedirectBackUrl = () => {
    let exp = localStorage.getItem('exp');
    let path = '/';
    if ([undefined,'undefined'].indexOf(exp) === -1 ) path = getExperimentPaths(exp).main_pathname;
    return {
        to: path,
        state: exp?{exp}:undefined
    };
}
