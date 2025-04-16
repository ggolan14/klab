/**
 *
 * @param id
 * @param text
 * @return {{{errorMessage:string , isError: boolean}}}
 */
export function handleHeadLineError({id, text}) {
    if (!id) {
        return {isError: true, errorMessage: "No ID specified for HeadLine object"};
    }

    if (!text) {
        return {isError: true, errorMessage: "No text specified for HeadLine object"};
    }
    return {isError: false, errorMessage: ""}
}