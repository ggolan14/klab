/**
 *
 * Error testing for text input
 * Param={UiObject element}
 * @param id
 * @param hint
 * @param min
 * @param index {number|null}
 * @returns {{isError: boolean, errorMessage: string}}
 */
export function handleTextInputErrors({id, hint , min} , index) {
    if (!id) {
        return {isError: true, errorMessage: "No ID specified for TextInput"};
    }
    if (!hint && hint !== "") {
        return {isError: true, errorMessage: "No Hint specified for TextInput"};
    }
    if (!min && min !== 0){
        return {isError: true, errorMessage: "No min specified for TextInput"};
    }
    if (!index && index !== 0){
        return {isError: true, errorMessage: "Page Flow Error for TextInput"};
    }

    return {isError: false, errorMessage: ""}
}