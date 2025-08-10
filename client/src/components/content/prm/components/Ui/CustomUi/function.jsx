import {useEffect, useState} from "react";
import ImagesContainer from "../Images/ImagesContainer";

export function test() {
    return <h1>this is text</h1>
}

/**
 * Todo : add option to recive when to set the disable button is disabled to control the page flow
 * @param {obj:UiObjects ,pageFlow:PageFlowOutput[]}
 * @returns {JSX.Element}
 */
export function TrailTypeXrayAi({obj, pageFlow, setPageFlow}) {
    const [consultant, setConsultant] = useState(false);
    if (!obj) {
        return <h1>Missing Object</h1>
    }
    if (!obj.data) {
        return <h1>Missing data</h1>
    }
    const imageBeforeSetting = {
        id: 1,
        type: "images",
        style: {width: "50%"},
        urls: [
            obj.data.imageBefore
        ]
    }
    const imageAfter = getRandomBoolean() ? obj.data.imageAi : obj.data.imageDoctor;
    const imageAfterSetting = {
        id: 1,
        type: "images",
        style: {width: "50%"},
        urls: [imageAfter]
    }

    return <div onClick={() => setConsultant(true)}>
        <ImagesContainer setCurrentImageZoom={null} images={consultant ? imageBeforeSetting : imageAfterSetting}/>
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
    useEffect(() => {
        if (pageFlow.length <= 1) {
            return;
        }
        if ((pageFlow[1].output) && (!pageFlow[2].output)) {
            setDisabled(false);
        }

        console.log(pageFlow)
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
    const isAi = getRandomBoolean();

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