import {useEffect, useState} from "react";
import {getCurrentIndex} from "../../../utils/helperMethods.js";
import {handleLikertError} from "./errors.js";
import {getIsLikertDisabled} from "./helperMethods.js";
import Error from "../Error/Error";


/**
 * Likert Element for trail type.
 * Prop:{
 *      uiObject: UiObjects,
 *     setPageFlow: Dispatch<SetStateAction<PageFlowOutput[]>>,
 *     pageFlow: PageFlowOutput[],
 *     startTime: number;
 * }
 * @param uiObject the likert object to render.
 * @param pageFlow the page flow output.
 * @param setPageFlow the react set method for pageFlow.
 * @param startTime the start time of the current trail type to calculate the response time first.
 * @constructor
 */
function Likert({uiObject, pageFlow, setPageFlow, startTime}) {
    const error = handleLikertError(uiObject);
    const arrayOfNums = Array.from({length: uiObject.scalePoints}, (_, index) => index + 1);
    const [likertInput, setLikertInput] = useState(null);
    const currentIndex = getCurrentIndex(pageFlow, uiObject);
    const [isDisabled, setIsDisabled] = useState(getIsLikertDisabled(pageFlow, currentIndex));

    useEffect(() => {
        if (!currentIndex) {
            return;
        }
        setIsDisabled(getIsLikertDisabled(pageFlow, currentIndex));
    }, [pageFlow])

    if (error.isError) {
        return <Error error={error}/>;
    }

    /**
     *
     * @param value {number}
     */
    function handleClick(value) {
        setLikertInput(value);
        // Updating the state of the response
        setPageFlow((prevState) => {
            let updatedElement = prevState[currentIndex];
            if (!updatedElement.responseTimeFirst) {
                updatedElement = {...updatedElement, responseTimeFirst: Date.now() - startTime}
            }
            updatedElement = {...updatedElement, output: value, scalePoints: uiObject.scalePoints}
            return prevState.map((item, index) =>
                index === currentIndex ? updatedElement : item
            );
        })
    }

    return (
        <div
            className={`bg-white w-full p-10 flex flex-col justify-center items-center ${isDisabled ? "opacity-30" : "opacity-100"}`}>
            <h2 className={"font-exo text-center text-clamping-mid  text-pretty max-w-full]"}> {uiObject.headline}</h2>
            <div className={"w-full flex justify-between mt-10 max-w-4xl"}>
                {uiObject.semiHeadlines.map((value, index) => (
                    <h2 key={`${uiObject.headline}-${uiObject.id}-${index}`}
                        className={"text-clamping-sm font-exo font-light text-gray-700"}>{value}</h2>
                ))}
            </div>
            <div
                className={`flex flex-row justify-center items-center shadow-md w-full flex-wrap rounded-3xl max-w-4xl border border-gray-300 ${uiObject.scalePoints > 30 ? "overflow-y-scroll" : "overflow-hidden"} mt-5`}>
                {
                    arrayOfNums.map((value, index) =>
                        <button
                            className={`duration-300 transition-all text-clamping-mid font-light font-exo text-center flex-1
                             p-2 ${likertInput === value ? "bg-blue-300" : `${isDisabled ? "" : "hover:bg-blue-100"}`}`}
                            key={`index-${index}`}
                            onClick={() => {
                                handleClick(value)
                            }}
                            disabled={isDisabled}
                        >{value}</button>)
                }
            </div>
        </div>
    );
}

export default Likert;