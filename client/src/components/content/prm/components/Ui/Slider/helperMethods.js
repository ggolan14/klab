import {PageFlowOutput, UiObjects} from "../types/types";

/**
 *
 * @param uiObject {UiObjects}
 * @param value {number}
 * @param KNOB_SIZE {number}
 * @returns {{drift: number, percentage: number, min: number, max: number}}
 */
export function getCalcForSliderAnimation(uiObject, value, KNOB_SIZE) {
    const min = uiObject.min;
    const max = uiObject.max;

    const total_range = max - min;
    const value_position = value - min;
    const percentage = (value_position / total_range) * 100;
    const drift = (-KNOB_SIZE / 100) * percentage + KNOB_SIZE / 2;
    return {drift, percentage, min, max}
}

/**
 * input should be uiObject
 * @param min
 * @param max
 * @returns {number|null}
 */
export function average({min, max}) {
    if (!min || !max) {
        return null;
    }
    return Math.floor((min + max) / 2)
}

/**
 * function to know if a slider should be disabled by page flow
 * @param pageFlow {PageFlowOutput[]}
 * @param currentIndex {number | null}
 * @returns {boolean}
 */
export function getIsSliderDisabled(pageFlow, currentIndex) {
    if (!currentIndex || currentIndex === 0) {
        return false;
    }
    return !(pageFlow[currentIndex - 1].output);
}
