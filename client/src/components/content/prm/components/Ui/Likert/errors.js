/**
 * Param = {UiObjects}
 * @param id deconstruct from UiObjects
 * @param headline deconstruct from UiObjects
 * @param semiHeadlines deconstruct from UiObjects
 * @param scalePoints deconstruct from UiObjects
 * @returns {{isError: boolean, errorMessage: string}}
 */
export function handleLikertError({id, headline, semiHeadlines, scalePoints}) {
    if (!id) {
        return {isError: true, errorMessage: "No ID specified for Likert"};
    }
    if (!headline && headline !== "") {
        return {isError: true, errorMessage: "No Headline specified for Likert"};
    }
    if (!semiHeadlines) {
        return {isError: true, errorMessage: "No Semi Headline specified for Likert"};
    }
    if (!scalePoints && scalePoints !== 0) {
        return {isError: true, errorMessage: "No Scale Points specified for Likert"};
    }
    if (scalePoints > 100) {
        return {isError: true, errorMessage: "Scale Points can't be larger then 100"};
    }

    return {isError: false, errorMessage: ""}
}