import {ElementsKeys} from "../constants";

/**
 * expected types of input:
 * type {
 *     uiObjects:  UiObjects[] | undefined
 *     }
 * return type PageFlowOutput[]
 *
 * @param uiObjects UiObjects[] | undefined
 * @returns page flow array
 */
export function getPageFlowOutput(uiObjects) {
    const output= [];
    if (!uiObjects){
        return [];
    }
    uiObjects.forEach((value) => {
        if (value.type === ElementsKeys.SLIDER || value.type === ElementsKeys.LIKERT || value.type === ElementsKeys.BUTTONS || value.type === ElementsKeys.SUBMIT
            || value.type === ElementsKeys.UNDERSTANDING_INSTRUCTION || value.type === ElementsKeys.TEXT_INPUT) {
            const currentElement = {
                id: value.id,
                type: value.type,
                responseTimeFirst: null,
                output: null
            };
            output.push(currentElement);
        }
    })
    return output;
}

/**
 *
 * @param updatedOutput type:object
 * @param currentElement type:PageFlowOutput
 * @returns {{[p: string]: {Response: *, ResponseTimeFirst: *, Accuracy: *}}}
 */
function updateOutputForButton(updatedOutput, currentElement) {
    return {
        ...updatedOutput,
        [`Response-${currentElement.id}`]: {
            Response: currentElement.output,
            ResponseTimeFirst: currentElement.responseTimeFirst,
            Accuracy: currentElement.accuracy
        }
    }
}

/**
 *
 * @param updatedOutput type:object
 * @param currentElement type:PageFlowOutput
 * @returns {{[p: string]: {Judgment: *, ResponseTimeFirstJudgment: *}}}
 */
function updateOutputForSlider(updatedOutput, currentElement) {
    return {
        ...updatedOutput,
        [`Judgment-${currentElement.id}`]: {
            Judgment: currentElement.output,
            ResponseTimeFirstJudgment: currentElement.responseTimeFirst,
        }
    }
}

/**
 *
 * @param updatedOutput type:object
 * @param currentElement type:PageFlowOutput
 * @returns {{[p: string]: {Value: *, ResponseTimeFirstLikert: * , ScalePoint: *}}}
 */
function updateOutputForLikert(updatedOutput, currentElement ) {
    return {
        ...updatedOutput,
        [`Likert-${currentElement.id}`]: {
            Value: currentElement.output,
            ResponseTimeFirstLikert: currentElement.responseTimeFirst,
            ScalePoint: currentElement.scalePoints
        }
    }
}

/**
 *
 * @param updatedOutput type:object
 * @param currentElement type:PageFlowOutput
 * @returns {{[VerifyUnderstanding-id: string]: value}
 */
function updateOutputForVerifyInstruction(updatedOutput, currentElement) {
    return {
        ...updatedOutput,
        [`VerifyUnderstanding-${currentElement.id}`]: currentElement.flowInstruction,
    }
}

/**
 *
 * @param output
 * @param pageFlow type:PageFlowOutput[]
 * @returns {object}
 */
export function updateOutputFromPageFlow(output, pageFlow) {
    let updatedOutput = {...output};
    for (let i = 0; i < pageFlow.length; i++) {
        const currentElement = pageFlow[i];
        if (currentElement.type === ElementsKeys.BUTTONS) {
            updatedOutput = updateOutputForButton(updatedOutput, currentElement);
        }
        if (currentElement.type === ElementsKeys.SLIDER) {
            updatedOutput = updateOutputForSlider(updatedOutput, currentElement);
        }
        if (currentElement.type === ElementsKeys.LIKERT) {
            updatedOutput = updateOutputForLikert(updatedOutput, currentElement);
        }
        if (currentElement.type === ElementsKeys.UNDERSTANDING_INSTRUCTION) {
            updatedOutput = updateOutputForVerifyInstruction(updatedOutput, currentElement);
        }
    }
    return updatedOutput;
}
