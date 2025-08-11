import {memo, useEffect, useMemo, useState} from "react";
import ImagesContainer from "../Images/ImagesContainer";
import {useConditions} from "../../Condition/ConditionsContext";

export function test() {
    return <h1>this is text</h1>
}

/**
 * Todo : add option to recive when to set the disable button is disabled to control the page flow
 * @param {obj:UiObjects ,pageFlow:PageFlowOutput[]}
 * @returns {JSX.Element}
 */
export function TrailTypeXrayAi({obj, pageFlow, setPageFlow}) {
    const [isClicked, setIsClicked] = useState(false);
    const imageAfter = useMemo(() => {
        return getRandomBoolean() ? obj.data.imageAi : obj.data.imageDoctor;
    }, []);
    const consultant = useMemo(() => {
        return getRandomBoolean()
    }, []);

    useEffect(() => {
        const id = "Icon-button";
        if (pageFlow === null || !isIdInPageFlow(id, pageFlow)) {
            return;
        }
        const pageFlowItem = pageFlow.find(item => item.id === id);
        if (pageFlowItem.output) {
            setIsClicked(true);
        }
    }, [pageFlow])
    if (!obj) {
        return <h1>Missing Object</h1>
    }
    if (!obj.data) {
        return <h1>Missing data</h1>
    }
    const imageBeforeSetting = {
        id: "before_custom",
        type: "images",
        style: {width: "50%"},
        urls: [obj.data.imageBefore]
    }
    // Memoize the choice between AI or Doctor image

    const generalStyleBox = {
        borderRadius: "10px",
        color: "white",
        textAlign: "center"
    }
    return <div>
        {isClicked ?
            <div className={"w-full flex justify-center items-center flex-col gap-1"}>
                <img src={imageAfter} className={"w-[50%]"}/>
                {consultant ?
                    <h2 className={"w-[50%] p-2"} style={{...generalStyleBox , backgroundColor: "red"}}>consolidation not found</h2> :
                    <h2 className={"w-[50%] p-2"} style={{...generalStyleBox , backgroundColor: "green"}}>consolidation found</h2>
                }

            </div> :
            <ImagesContainer setCurrentImageZoom={null} images={imageBeforeSetting}/>
        }
    </div>

}

function getRandomBoolean() {
    return Math.random() < 0.5;
}

function isIdInPageFlow(id, pageFlow) {
    return pageFlow.find(item => item.id === id) !== undefined;
}

export function AiOrDoctorIcon({obj, pageFlow, setPageFlow}) {
    const [isDisabled, setDisabled] = useState(true);
    const {chosenValues} = useConditions();
    useEffect(() => {
        if (pageFlow.length <= 1) {
            return;
        }
        if ((pageFlow[1].output) && (!pageFlow[2].output)) {
            setDisabled(false);
        }

    }, [pageFlow]);

    useEffect(() => {
        if (pageFlow === null || isIdInPageFlow(obj.id, pageFlow)) {
            return;
        }
        const currentElement = {
            id: obj.id,
            type: obj.type,
            responseTimeFirst: null,
            output: null
        };

        setPageFlow(prev => {
            const newFlow = [...prev];
            newFlow.splice(2, 0, currentElement); // insert at index 2
            return newFlow;
        });
    }, [pageFlow]);

    if (!obj.data) {
        return <h1>Missing data</h1>
    }
    if (!"isAi" in chosenValues) {
        return <h1>Missing "isAi" in conditions</h1>
    }
    const isAi = chosenValues["isAi"];

    function onClick() {
        if (isDisabled) {
            return;
        }
        setDisabled(true);
        setPageFlow(prev => {
            return prev.map(item => {
                if (item.id === obj.id) {
                    return {
                        ...item,
                        output: {Ai: isAi, Doctor: !isAi},
                        responseTimeFirst: Date.now()
                    };
                }
                return item;
            });
        });
    }

    const {data} = obj;
    if (!data.iconAi || !data.iconDoctor) {
        return <h1>Missing iconAi or iconDoctor</h1>
    }
    // console.log(pageFlow)
    return <div className={"w-full flex align-items-start "}>
        <img src={isAi ? data.iconAi : data.iconDoctor}
             onClick={onClick}
             alt="icon"
             className={`icon-xray ${isDisabled ? "opacity-50" : "opacity-100 active:scale-110"} `}/>
    </div>
}