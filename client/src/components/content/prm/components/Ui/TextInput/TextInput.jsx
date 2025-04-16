import React, {useEffect, useState} from 'react';
import "./textinput.css"
import {handleTextInputErrors} from "./errors.js";
import {getCurrentIndex} from "../../../utils/helperMethods.js";
import {getIsTextInputDisabled} from "./helperMethods.js";
import Error from "../Error/Error";
import "./../../Styling/usefulClasses.css"

/**
 *
 * Props: TextInputProps = {
 *     uiObject: UiObjects
 *     setPageFlow: Dispatch<SetStateAction<PageFlowOutput[]>>,
 *     pageFlow: PageFlowOutput[],
 *     startTime: number;
 * }
 * @param uiObject
 * @param setPageFlow
 * @param pageFlow
 * @param startTime
 * @constructor
 */
function TextInput({uiObject, setPageFlow, pageFlow, startTime}) {
    const currentIndex = getCurrentIndex(pageFlow, uiObject);
    const error = handleTextInputErrors(uiObject, currentIndex);
    const [isDisabled, setIsDisabled] = useState(getIsTextInputDisabled(pageFlow, currentIndex));
    const [isTextValid, setIsTextValid] = useState(2);
    // Updating the Disable state if the value of the other confidence in the page changed.
    useEffect(() => {
        if (!currentIndex) {
            return;
        }
        setIsDisabled(getIsTextInputDisabled(pageFlow, currentIndex));
    }, [pageFlow]);

    if (error.isError) {
        return <Error error={error}/>;
    }

    function textChanged(event) {
        // Updating the state of the response
        setPageFlow((prevState) => {
            let updatedElement = prevState[currentIndex];
            if (!updatedElement.responseTimeFirst) {
                updatedElement = {...updatedElement, responseTimeFirst: Date.now() - startTime}
            }
            if (uiObject.min < event.target.value.length) {
                setIsTextValid(1);
                updatedElement = {
                    ...updatedElement,
                    output: event.target.value
                }
            }
            if (uiObject.min > event.target.value.length) {
                setIsTextValid(0);
                updatedElement = {
                    ...updatedElement,
                    output: null
                }
            }
            if (event.target.value.length === 0) {
                setIsTextValid(2);
            }
            return prevState.map((item, index) =>
                index === currentIndex ? updatedElement : item
            );
        })
    }

    const borderColor = () => {
        if (isTextValid === 0) {
            return "border-red";
        }
        if (isTextValid === 1) {
            return "border-green";
        }
        return "border-gray-300";
    }
    return (
        <div className={`inputGroup ${isDisabled ? "opacity-30" : "opacity-100"} rounded-3 border ${borderColor()}`}>
            <input className={"font-exo text-clamping-sm border-2 border-gray-200"} required={true} type="text"
                   autoComplete="off" onChange={(e) => textChanged(e)} disabled={isDisabled}/>
            <label className={"font-exo"}>{uiObject.hint}</label>
        </div>
    );
}

export default TextInput;