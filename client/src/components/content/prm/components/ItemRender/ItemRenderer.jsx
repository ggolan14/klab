import {
    ElementsKeys,
} from "../constants";
import {useEffect, useState} from "react";
import ZoomElement from "../Zoom/componennts/ZoomElement";
import {getPageFlowOutput, updateOutputFromPageFlow} from "../PageFlow/pageFlow.js";
import {getInitialZoom} from "../Zoom/helpers.ts";
import "../Styling/usefulClasses.css"
import useHandlePageFlow from "../PageFlow/usePageFlow.js";
import useHandleFirstInteraction from "../FirstInteraction/useHandleFirstInteraction";
import Buttons from "../Ui/Buttons/Buttons";
import SubmitButton from "../Ui/Submit/SubmitButton";
import Slider from "../Ui/Slider/Slider";
import Text from "../Ui/Text/Text";
import HeadLine from "../Ui/HeadLine/HeadLine";
import Likert from "../Ui/Likert/Likert";
import TextInput from "../Ui/TextInput/TextInput";
import ImagesContainer from "../Ui/Images/ImagesContainer";
import UnderstandingInstruction from "../Ui/UnderstandingInstruction/UnderstandingInstruction";
import {useFocus} from "../Focus/useFocus";
import CustomWidget from "../Ui/CustomUi/CustomWidget";


/**
 * A single Item Element renderer - A single way to render every Item.
 * Features to add to page:
 * Expected Props including types: TrialTypeProps = {
 *     startTime: number,
 *     Item: ItemType
 *     uiData: uiObject
 *     setCurrentItemIndex: setter react method
 * }
 * @param startTime the time the that the trial type started at.
 * @param item the current item
 * @param uiData {uiObject[]} the uiData of each item
 * @param setCurrentItemIndex {Dispatch<SetStateAction<number>>}
 * @param insertToDbArray {(object)=>void}
 * @param sendToDB {()=>Promise}
 */
function ItemRenderer({startTime, item, uiData, setCurrentItemIndex, insertToDbArray , sendToDB}) {
    // // Page Flow (Output for each Ui element):
    const [pageFlow, setPageFlow] = useState(getPageFlowOutput(uiData));
    // For Focus
    const { current: focusStats } = useFocus();
    // For Zoom
    const [currentImageZoom, setCurrentImageZoom] = useState(getInitialZoom(startTime));
    // For Mouse Tracking feature
    // TODO SHOULD ADD THIS LINE IF WANT MOUSE TRACKING ALSO HERE const {mouseTracking} = useMouseTracking(startTime, 350);

    useEffect(() => {
        if (!item) {
            return;
        }
        setPageFlow(getPageFlowOutput(uiData))
    }, [item]);
    // Updating the First Reaction time
    const {responseTimeFirst} = useHandleFirstInteraction(startTime, item);
    useHandlePageFlow({pageFlow, setPageFlow});

    /**
     * The Method update the output and set the next slide to move forward to the next element.
     * @constructor
     */
    async function UpdateOutputAncContinueToNextTrialType() {
        const responseTimeLast = Date.now() - startTime;
        let newOutput = {};
        if (!("ResponseTimeLast" in newOutput)) {
            // // Updating the output with the necessary features for the current trial type
            // newOutput = updateResponseTimeFirst(newOutput, responseTimeFirst);
            // newOutput = updateImages(newOutput, item.children);
            //Setting the output to fit each ui element criteria
            newOutput = updateOutputFromPageFlow(newOutput, pageFlow);
            if (item.addToOutput) {
                newOutput = {...newOutput, addToOutput: item.addToOutput}
            }
            newOutput = {...newOutput, focus: focusStats};
            newOutput = {...newOutput, responseTimeFirst: responseTimeFirst};
            newOutput = {...newOutput, responseTimeLast: responseTimeLast};
            newOutput = {...newOutput, condition: item.condition};
            newOutput = {...newOutput, itemID: item.id, trialType: item.trialType};
        }
        console.log(newOutput)
        setCurrentItemIndex(prevIndex => prevIndex + 1);
        insertToDbArray(newOutput);
        await sendToDB();
    }


    /**
     *
     * @param currentObj Should be type of UiObject
     * @param index the element Index
     * @returns JSX.Element
     */
    function renderUi(currentObj, index) {
        const key = `${currentObj.id}-${currentObj.type}-${index}`;
        switch (currentObj.type) {
            case ElementsKeys.IMAGES:
                return <ImagesContainer setCurrentImageZoom={setCurrentImageZoom} images={currentObj} key={index}/>
            case ElementsKeys.HEADLINE:
                return <HeadLine key={key} currentObj={currentObj}/>
            case ElementsKeys.TEXT:
                return <Text key={key} currentObj={currentObj}/>
            case ElementsKeys.BUTTONS:
                return <Buttons key={key} startTime={startTime} pageFlow={pageFlow}
                                setPageFlow={setPageFlow} uiObject={currentObj}/>;
            case ElementsKeys.SLIDER:
                return <Slider key={key} startTime={startTime} pageFlow={pageFlow}
                               setPageFlow={setPageFlow} uiObject={currentObj}/>
            case ElementsKeys.LIKERT:
                return <Likert key={key} startTime={startTime} pageFlow={pageFlow} setPageFlow={setPageFlow}
                               uiObject={currentObj}/>
            case ElementsKeys.UNDERSTANDING_INSTRUCTION:
                return <UnderstandingInstruction startTime={startTime} pageFlow={pageFlow} setPageFlow={setPageFlow}
                                                 uiObject={currentObj} key={key}/>
            case ElementsKeys.TEXT_INPUT:
                return <TextInput key={key} startTime={startTime} pageFlow={pageFlow} setPageFlow={setPageFlow}
                                  uiObject={currentObj}/>
            case ElementsKeys.CUSTOM:
                return <CustomWidget uiObject={currentObj}/>
            case ElementsKeys.SUBMIT:
                return <SubmitButton key={key} currentObj={currentObj} pageFlow={pageFlow}
                                     onClickMethod={UpdateOutputAncContinueToNextTrialType}/>
        }

        return undefined;
    }

    const trialTypeCss = "flex flex-auto flex-col items-center justify-start gap-8 w-full h-full overflow-x-hidden relative m-2"

    if (!item) {
        return <div className={trialTypeCss}>
            <h1>ERROR! NO ITEM RECEIVED AS PROP</h1>
        </div>
    }
    const Style = item.style ? item.style : {};
    return (
        <>
            {currentImageZoom.isOpen &&
                <ZoomElement setCurrentImageZoom={setCurrentImageZoom} currentImageZoom={currentImageZoom}/>}
            <div
                className={`w-[95%] h-[95%] bg-white rounded-3xl p-10 pt-16  drop-shadow-xl overflow-y-hidden overflow-x-hidden `}>
                <div
                    className={`${trialTypeCss} transition-all ease-in`} style={Style}>
                    {uiData.map((uiObject, index) => renderUi(uiObject, index))}
                </div>
            </div>
        </>
    );
}

export default ItemRenderer;