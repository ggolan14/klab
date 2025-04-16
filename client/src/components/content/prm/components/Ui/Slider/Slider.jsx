import "./slider.css"
import "./../../Styling/usefulClasses.css"
import {useEffect, useState} from "react";
import {getCurrentIndex} from "../../../utils/helperMethods.js";
import {handleSliderError} from "./errors.js";
import {average, getCalcForSliderAnimation, getIsSliderDisabled} from "./helperMethods.js";
import Error from "../Error/Error.jsx";


/**
 * type SliderProps = {
 *     uiObject: UiObjects,
 *     setPageFlow: Dispatch<SetStateAction<PageFlowOutput[]>>,
 *     pageFlow: PageFlowOutput[],
 *     startTime: number;
 * }
 * @param uiObject
 * @param setPageFlow
 * @param pageFlow
 * @param startTime
 * @returns {JSX.Element}
 * @constructor
 */
function Slider({uiObject, setPageFlow, pageFlow, startTime}) {
    const error = handleSliderError(uiObject);
    const [value, setValue] = useState(average(uiObject));
    const currentIndex = getCurrentIndex(pageFlow, uiObject);
    const [defaultValueEntered, setDefaultValueEntered] = useState("");
    // Disable State
    const [isDisabled, setIsDisabled] = useState(getIsSliderDisabled(pageFlow, currentIndex));
    // Updating the Disable state if the value of the other confidence in the page changed.
    useEffect(() => {
        if (!currentIndex) {
            return;
        }
        setIsDisabled(getIsSliderDisabled(pageFlow, currentIndex));
    }, [pageFlow])

    //Showing Error if needed
    if (error.isError) {
        return <Error error={error}/>;
    }
    //Constants and drift calculations
    const THUMB_SIZE = 64;
    const KNOB_SIZE = 22;
    const {drift, percentage, min, max} = getCalcForSliderAnimation(uiObject, value, KNOB_SIZE);


    function handleChange(e) {
        const currentValue = Number(e.target.value);
        setValue(currentValue);
        if (currentValue === average(uiObject)) {
            setDefaultValueEntered("text-red-500 bg-red-100");
        } else {
            setDefaultValueEntered("bg-white text-black");
        }

        // Updating the state of the response
        setPageFlow((prevState) => {
            let updatedElement = prevState[currentIndex];
            if (!updatedElement.responseTimeFirst) {
                updatedElement = {...updatedElement, responseTimeFirst: Date.now() - startTime}
            }
            updatedElement = {
                ...updatedElement,
                output: (currentValue === average(uiObject)) ? null : currentValue
            }
            return prevState.map((item, index) =>
                index === currentIndex ? updatedElement : item
            );
        })
    }

    return (

        <div className={"w-full flex item-center justify-center"}>

            <div className={"w-[80%] h-full relative"}>
                <h2 className={`${isDisabled ? "opacity-30" : "opacity-100"} mb-3 font-exo text-clamping-sm max-w-[100%%] mt-[40px] text-center`}> {uiObject.textCenter}</h2>
                <div
                    className={`${isDisabled ? "opacity-30" : "opacity-100"} gap-8 flex-col items-center justify-center w-[100%] relative mb-[80px]`}>
                    <input
                        type="range"
                        min={min}
                        max={max}
                        value={value}
                        onChange={(e) => handleChange(e)}
                        className={`w-full cursor-pointer rs-range`}
                        disabled={isDisabled}
                    />
                    <div
                        id="thumb_value"
                        className={`${isDisabled ? "opacity-15" : "opacity-100"} ${defaultValueEntered} rounded-3xl mt-2 absolute flex justify-center items-center border-gray-200  drop-shadow-lg border-2`}
                        style={{
                            width: `${THUMB_SIZE}px`,
                            height: `${THUMB_SIZE}px`,
                            left: `calc(${percentage}% - ${THUMB_SIZE / 2}px + ${drift}px)`,
                        }}
                    >
                        <h2 className="text-clamping-mid">{value}</h2>
                    </div>
                    <h2 className={"absolute -top-[150%] left-0 font-exo text-clamping-sm max-w-[80%] opacity-50"}> {uiObject.textLeft}</h2>
                    <h2 className={"absolute -top-[150%] right-0 font-exo text-clamping-sm max-w-[80%] opacity-50"}> {uiObject.textRight}</h2>
                </div>
            </div>
        </div>
    );
}

export default Slider;