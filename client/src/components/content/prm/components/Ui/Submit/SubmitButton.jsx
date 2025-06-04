import React from 'react';
import {getCurrentIndex, getIsSubmitDisabled} from "../../../utils/helperMethods.js";
import "../../Styling/usefulClasses.css"

/**
 * The submit button ui element fit that page flow mechanism
 * @param currentObj {UiObjects}
 * @param pageFlow {PageFlowOutput[]}
 * @param onClickMethod {() => void}
 * @constructor
 */

function SubmitButton({currentObj, pageFlow, onClickMethod}) {
    const buttonCSSActions = `bg-white transition-all duration-500 hover:bg-buttons-blue`;
    const buttonCSSLocation = `mt-10`;
    const currentIndex = getCurrentIndex(pageFlow, currentObj);
    const isDisabled = getIsSubmitDisabled(pageFlow, currentIndex);
    const Shape = "border border-gray-300 p-5 drop-shadow-xl rounded-3xl  "

    return (
        <div className={"w-full flex justify-center item-center max-h-[40px] mb-2"}>
            <button onClick={onClickMethod} disabled={isDisabled}
                    className={`flex items-center gap-0 justify-center max-h-[40px] 
                ${buttonCSSLocation} 
                ${isDisabled ? "opacity-30" : buttonCSSActions} 
                ${Shape} w-[40%] text-wrap`}>
                <h2 className={`font-exo text-clamping-sm`}>{currentObj.text}</h2>
            </button>
        </div>
    )
        ;

}

export default SubmitButton;