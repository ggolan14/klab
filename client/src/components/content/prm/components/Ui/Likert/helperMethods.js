/**
 * retrieve should the likert be disabled according to the page flow
 * @param pageFlow {PageFlowOutput[]}
 * @param currentIndex {number | null}
 * @returns {boolean}
 */
export function getIsLikertDisabled(pageFlow , currentIndex) {
    if (!currentIndex || currentIndex === 0) {
        return false;
    }
    return !(pageFlow[currentIndex - 1].output);
}


