import {handleUnderstandingInstructionError} from "./errors.js";
import {useEffect, useState} from "react";
import {getCurrentIndex} from "../../../utils/helperMethods.js";
import {getIsVerifyDisabled} from "../../MouseTracking/helpers.js";
import Error from "../Error/Error";
import "./../../Styling/usefulClasses.css"


/**
 * Props: understandingInstructionProps = {
 *     uiObject: UiObjects
 *     setPageFlow: Dispatch<SetStateAction<PageFlowOutput[]>>,
 *     pageFlow: PageFlowOutput[],
 *     startTime: number;
 * }
 * @param uiObject
 * @param startTime
 * @param setPageFlow
 * @param pageFlow
 * @returns {JSX.Element}
 * @constructor
 */
function UnderstandingInstruction({uiObject, startTime, setPageFlow, pageFlow}) {
    const error = handleUnderstandingInstructionError(uiObject);
    const [id, setId] = useState(uiObject.understandingInstructionChildes ? uiObject.understandingInstructionChildes[0].id : "");
    const [isError, setIsError] = useState(false);
    const currentIndex = getCurrentIndex(pageFlow, uiObject);
    const [isVerify, setIsVerify] = useState(false);
    const [isVerifyDisabled, setIsVerifyDisabled] = useState(getIsVerifyDisabled(pageFlow, currentIndex));
    const [output, setOutput] = useState([]);
    const [shakeEffect, setShakeEffect] = useState(false);

    useEffect(() => {
        if (isError) {
            setShakeEffect(true);
            const timeout = setTimeout(() => {
                setIsError(false)
                setShakeEffect(false)
            }, 400);
            return () => clearTimeout(timeout);
        }
    }, [isError]);

    useEffect(() => {
        if (!currentIndex) {
            return;
        }
        if (output.length > 0) {
            return;
        }
        setIsVerifyDisabled(getIsVerifyDisabled(pageFlow, currentIndex));
    }, [pageFlow]);

    if (error.isError) {
        return <Error error={error}/>;
    }


    if (!isVerify) {
        const disableCSS = isVerifyDisabled ? "opacity-30" : "active:scale-110 hover:bg-buttons-blue opacity-100";
        return <button
            onClick={() => {
                setIsVerify(true);
                const currentOutput = {
                    id: uiObject.id,
                    responseTimeFirstInstruction: Date.now() - startTime,
                    buttonType: "Start instruction",
                }
                setOutput(prevState => [...prevState, currentOutput])
            }}
            disabled={isVerifyDisabled}
            className={`${disableCSS} text-clamping-sm p-4 border border-gray-300 drop-shadow-xl transition-all duration-300 rounded-xl`}>
            {uiObject.verifyButtonText}
        </button>
    }

    function handleClick(child, value) {
        const isCorrect = child.correct === value;
        const currentOutput = {
            id: child.id,
            outputEntered: value,
            responseTimeFirstInstruction: Date.now() - startTime,
            correct: child.correct,
            accuracy: isCorrect ? 100 : 0,
        }
        console.log({isCorrect, child})

        if (isCorrect && !child.nextIfCorrect) {
            setIsVerify(false);
            setIsVerifyDisabled(true);
            setPageFlow(prevState => {
                let updatedElement = prevState[currentIndex];
                updatedElement = {...updatedElement, output: "answered", flowInstruction: [...output, currentOutput]}
                return prevState.map((item, index) =>
                    index === currentIndex ? updatedElement : item
                );
            })
            return;
        }

        if (isCorrect) {
            setId(child.nextIfCorrect);
            setOutput(prevState => [...prevState, currentOutput])
            return;
        }

        if (!isCorrect && child.nextIfWrong === child.id) {
            setIsError(true);
        }

        if (!isCorrect && !child.nextIfWrong) {
            setIsVerify(false);
            setIsVerifyDisabled(true);
            setPageFlow(prevState => {
                let updatedElement = prevState[currentIndex];
                updatedElement = {...updatedElement, output: "answered", flowInstruction: output}
                return prevState.map((item, index) =>
                    index === currentIndex ? updatedElement : item
                );
            })
            return;
        }

        if (!isCorrect) {
            setId(child.nextIfWrong);
            setOutput(prevState => [...prevState, currentOutput])
            return;
        }
    }

    const ElementExpended = ({child}) => {
        return (
            <>
                <h2 className={"font-exo text-clamping-sm  text-pretty max-w-full mb-10"}> {child.question}</h2>
                {child.buttons?.map((button, index) => (
                    <button
                        key={`${button}-${index}`}
                        className={`bg-white active:scale-110 hover:bg-buttons-blue text-clamping-sm p-4 min-w-[300px] mt-2 border border-gray-300 drop-shadow-xl transition-all duration-300 rounded-xl`}
                        onClick={() => handleClick(child, button)}
                    >
                        {button}
                    </button>
                ))}
            </>
        )

    }
    return (
        <div className={"fixed w-full h-full bg-black-op65 top-0 left-0 flex items-center justify-center"}
             style={{zIndex: 9999}}>
            <div
                className={`flex flex-col transition-all duration-1000 items-center p-10
                 max-w-[85%] min-h-300 max-h-90p rounded-3xl bg-gray-100
                  overflow-y-scroll z-10 border-4 border ${shakeEffect ? "shake-red" : ""} `}>
                {
                    uiObject.understandingInstructionChildes?.map((child, index) => {
                        return id === child.id ?
                            <ElementExpended key={`${child.id}-${index}`} child={child}/> : undefined;
                    })

                }

            </div>
        </div>
    );
}

export default UnderstandingInstruction;