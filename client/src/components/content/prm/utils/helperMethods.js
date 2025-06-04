/**
 * get the current index of a uiObject in the page flow
 * @param pageFlow
 * @param uiObjects
 * @returns {number|null}
 */
export function getCurrentIndex(pageFlow, uiObjects){
    for (let i = 0; i < pageFlow.length; i++) {
        if (uiObjects.id === pageFlow[i].id) {
            return i;
        }
    }
    return null;
}
/**
 * Checks if submit button should be disabled
 * type PageFlowOutput = {
 *     id: string,
 *     type: string,
 *     output: string | number | null,
 *     responseTimeFirst: number | null,
 *     accuracy?: number | null, //only for buttons
 *     scalePoints?: number | null, //only for likert
 *     flowInstruction?: understandingInstructionOutput[] //only for Understanding Instruction
 * }
 * @param pageFlow type:PageFlowOutput[]
 * @param currentIndex type:number|null
 * @returns {boolean}
 */
export function getIsSubmitDisabled(pageFlow, currentIndex) {
    if (!currentIndex || currentIndex === 0) {
        return false;
    }
    return !(pageFlow[currentIndex - 1].output);
}
