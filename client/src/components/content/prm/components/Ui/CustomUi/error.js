import {isString} from "../../validateTypes";
import * as logicFunctions from "./function";

/**
 *
 * @param id
 * @param logic
 * @return {{{errorMessage:string , isError: boolean}}}
 * */
export function handleCustomWidgetErrors({id, logic}) {
    if (!id) {
        return {isError: true, errorMessage: "No ID specified for ToggleSwitch"};
    }
    if (!logic) {
        return {isError: true, errorMessage: "ToggleSwitch 'logic' must be included"};
    }
    //from here logic must exist
    if (!isString(logic)) {
        return {isError: true, errorMessage: "ToggleSwitch 'logic' must be a string (function name)"};
    }
    const availableFunctionNames = Object.keys(logicFunctions);
    if (!(logic in logicFunctions)) {
        return {
            isError: true,
            errorMessage: `Logic function '${logic}' does not exist. Available: ${availableFunctionNames.join(", ")}`
        };
    }

    const fn = logicFunctions[logic];
    if (typeof fn !== "function") {
        return {
            isError: true,
            errorMessage: `Logic '${logic}' exists but is not a function.`
        };
    }
    return {isError: false, errorMessage: ""};
}
