

/**
 *
 * @param id
 * @param verifyButtonText
 * @param understandingInstructionChildes
 * @returns {{isError: boolean, errorMessage: string}}
 */
export function handleUnderstandingInstructionError({id, verifyButtonText,understandingInstructionChildes }) {
    if (!id) {
        return {isError: true, errorMessage: "No ID specified for Understanding Instruction object"};
    }
    if (!understandingInstructionChildes) {
        return {isError: true, errorMessage: "No questions specified for Understanding Instruction object"};
    }
    if (understandingInstructionChildes.length === 0) {
        return {isError: true, errorMessage: "Children must include at list 1 element for Understanding Instruction object"};
    }
    if (!verifyButtonText){
        return {isError: true, errorMessage: "No verifyButtonText array specified for Understanding Instruction object"};
    }
    for (const child of understandingInstructionChildes) {
        if (!child.id) {
            return {isError: true, errorMessage: "Children element of Understanding Instruction object must include id "};
        }
        if (child.type !== "understandingInstructionQuestion") {
            return {isError: true, errorMessage: "Children element of Understanding Instruction object must be of type understanding Instruction Question"};
        }
        if (!idIsOnlySpecifiedOnce(understandingInstructionChildes , child.id)){
            return {isError: true, errorMessage: `Understanding Instruction: Children elements with the same ids`};
        }
        if (!child.correct) {
            return {isError: true, errorMessage: "Children element of Understanding Instruction object must include correct"};
        }
        if (!child.question) {
            return {isError: true, errorMessage: "Children element of Understanding Instruction object must include question"};
        }
        if (!child.buttons) {
            return {isError: true, errorMessage: "Children element of Understanding Instruction object must include buttons"};
        }
        if (child.nextIfCorrect !== "" && !child.nextIfCorrect) {
            return {isError: true, errorMessage: "Children element of Understanding Instruction object must include nextIfCorrect"};
        }
        if (!haveChildrenWithId(understandingInstructionChildes , child.nextIfCorrect)){
            return {isError: true, errorMessage: `Children element [id:${child.id}]: id specified in nextIfCorrect is not the id of any child element`};
        }
        if (child.nextIfWrong !== "" && !child.nextIfWrong) {
            return {isError: true, errorMessage: "Children element of Understanding Instruction object must include nextIfWrong"};
        }
        if (!haveChildrenWithId(understandingInstructionChildes , child.nextIfWrong)){
            return {isError: true, errorMessage: `Children element [id:${child.id}]: id specified in nextIfWrong is not the id of any child element`};
        }

    }

    return {isError: false, errorMessage: ""}
}

/**
 *
 * @param children {UiObjects[]}
 * @param id {string}
 * @returns {boolean}
 */
function haveChildrenWithId(children, id){
    if (id === ""){
        return true;
    }
    for (const child of children) {
        if (child.id === id) {
            return true;
        }
    }
    return false;
}

/**
 *
 * @param children {UiObjects[]}
 * @param id {string}
 * @returns {boolean}
 */
function idIsOnlySpecifiedOnce(children , id){
    let counter = 0;
    for (const child of children) {
       if (child.id === id){
           counter++;
       }
    }
    return counter <= 1;
}