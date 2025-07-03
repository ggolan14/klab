import {useEffect, useState} from "react";
import {getCurrentIndex} from "../../../utils/helperMethods.js";
import {getIsButtonDisabled} from "./helperMethods.js";
import "../../Styling/usefulClasses.css"
import Error from "../Error/Error";
import {handleButtonsError} from "./errors";
import {UiObjects} from "../types/typsT.ts"
/**
 * Buttons element widget allow the experiment conductor to create multiple buttons
 * @param uiObject {UiObjects}- the ui widget
 * @param setPageFlow - the React setter method for page flow
 * @param pageFlow - the page flow
 * @param startTime - the start time to calculate the response time first for this item
 * @returns {JSX.Element} - the buttons element
 * @constructor
 */
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
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            // Generate a random index from 0 to i
            const j = Math.floor(Math.random() * (i + 1));
            // Swap elements at indices i and j
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    if (uiObject.shuffle){
        uiObject.buttons = shuffleArray(uiObject.buttons);
    }

    const style = uiObject.style ? uiObject.style  : {};
    const containerStyle = uiObject.styleContainer ? uiObject.styleContainer  : {};

    return (
        <div id={"buttons_container"} style={containerStyle}
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
                    style={style}
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