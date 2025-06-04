/**
 *
 * @param id
 * @param buttons
 * @param correct
 * @param currentIndex
 * @returns {{isError: boolean, errorMessage: string}}
 */
export function handleButtonsError({id, buttons , correct}, currentIndex) {
    if (!id) {
        return {isError: true, errorMessage: "No ID specified for buttons object"};
    }
    if (!currentIndex && currentIndex !== 0) {
        return {isError: true, errorMessage: "Buttons error in the page flow"};
    }
    if (!buttons) {
        return {isError: true, errorMessage: "No Buttons array specified for buttons object"};
    }
    if (buttons.length === 0) {
        return {isError: true, errorMessage: "Buttons array must include at list one string"};
    }
    if (buttons.length > 100) {
        return {isError: true, errorMessage: "Buttons array must be smaller then 100 buttons"};
    }
    return {isError: false, errorMessage: ""}
}