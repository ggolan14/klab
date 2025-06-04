// import {PageFlowOutput} from "../../../utils/types/experimentTypes/experimentsTypes.ts";
/**
 * retrieve is the text input disabled according to text flow
 * @param pageFlow {PageFlowOutput[]}
 * @param currentIndex { number | null}
 * @returns {boolean}
 */
export function getIsTextInputDisabled(pageFlow , currentIndex) {
    if (!currentIndex || currentIndex === 0) {
        return false;
    }
    return !(pageFlow[currentIndex - 1].output);
}
