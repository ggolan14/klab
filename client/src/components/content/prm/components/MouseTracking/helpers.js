/**
 *
 * @param pageFlow type PageFlow
 * @param currentIndex type number
 */
export  function getIsVerifyDisabled(pageFlow,currentIndex){
    if (!currentIndex || currentIndex === 0) {
        return false;
    }
    return !(pageFlow[currentIndex - 1].output);
}