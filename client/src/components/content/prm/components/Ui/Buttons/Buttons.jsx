import {useEffect, useState} from "react";
import {getCurrentIndex} from "../../../utils/helperMethods.js";
import {getIsButtonDisabled} from "./helperMethods.js";
import "../../Styling/usefulClasses.css"
import Error from "../Error/Error";

import {handleButtonsError} from "./errors";
function Buttons({uiObject, setPageFlow, pageFlow, startTime}) {
    const [isDisabled, setIsDisabled] = useState(false);
    const [elementOutput, setElementOutput] = useState(null);
    const currentIndex = getCurrentIndex(pageFlow, uiObject);
    const [isContainerDisabled, setIsContainerDisabled] = useState(getIsButtonDisabled(pageFlow, currentIndex));
    const error = handleButtonsError(uiObject, currentIndex);

    // Updating the Disable state if the value of the other confidence in the page changed.
    useEffect(() => {
        if (!currentIndex) {
            return;
        }
        setIsContainerDisabled(getIsButtonDisabled(pageFlow, currentIndex));

    }, [pageFlow])
    useEffect(() => {
        setIsContainerDisabled(getIsButtonDisabled(pageFlow, currentIndex));
        setElementOutput(null);
        setIsDisabled(false);
    }, [uiObject]);
    //Showing Error if needed
    if (error.isError){
        return <Error error={error}/>;
    }
    function handleClick(index, value) {
        setElementOutput({index, value});
        setIsDisabled(true);
        // Updating the state of the response
        setPageFlow((prevState) => {
            let updatedElement = prevState[currentIndex];
            if (!updatedElement.responseTimeFirst) {
                updatedElement = {...updatedElement, responseTimeFirst: Date.now() - startTime}
            }
            updatedElement = {
                ...updatedElement,
                output: value,
                accuracy: value === uiObject.correct ? 100 : 0
            }
            return prevState.map((item, index) =>
                index === currentIndex ? updatedElement : item
            );
        })
    }

    return (
        <div id={"buttons_container"}
             className={`w-full flex gap-4 justify-center flex-row flex-wrap ${isContainerDisabled ? "opacity-30" : "opacity-100"} p-4 `}>
            {uiObject.buttons.map((value, index) => {
                const sizeAndShape = "max-w-[300px] rounded-xl"
                const marginAndPadding = "p-4 flex-1 "
                const borderAndShadow = "border border-gray-300 drop-shadow-xl "
                const animation = "transition-all duration-300 "
                const hover = elementOutput ? "" : "hover:bg-buttons-blue"
                const backgroundColor = (index === elementOutput?.index) ? "bg-buttons-blue" : ""
                const Disabled = elementOutput && isDisabled && (index !== elementOutput?.index) ? "opacity-30" : "opacity-100";
                return <button
                    className={`active:scale-110  text-clamping-sm flex-1 hover:bg-buttons-blue drop-shadow-xl ${Disabled} ${backgroundColor} ${hover} ${sizeAndShape} ${marginAndPadding} ${borderAndShadow} ${animation}`}
                    onClick={() => handleClick(index, value)}
                    key={"buttons_element" + index}
                    disabled={isDisabled || isContainerDisabled}
                >{value}</button>
            })}
        </div>
    );
}

export default Buttons;