/**
 * Validate that a given ui object with type images is structured correctly
 * @param object {object}
 * @returns {{errorMessage: string, isError: boolean}}
 */
export function handleImageContainerError(object){
    if (!object.id) {
        return {errorMessage: "NO ID SPECIFIED FOR THE IMAGES", isError: true};
    }
    if (!object.urls) {
        return {errorMessage: "NO URLS SPECIFIED FOR THE IMAGES", isError: true};
    }
    if (!isArrayOfStrings(object.urls)) {
        return {errorMessage: "URLS MUST BE AN ARRAY OF STRINGS", isError: true};
    }
    return {isError: false , errorMessage: ""};
}

function isArrayOfStrings(value) {
    return Array.isArray(value) && value.every(item => typeof item === 'string');
}