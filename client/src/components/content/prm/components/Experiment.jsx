import React, {useMemo, useState} from 'react';
// import experimentData from "../experiment.json"
import experimentData from "../uiTesting/experiment_xray_ai.json"
// import experimentData from "../uiTesting/experiment.json"
import ItemRenderer from "./ItemRender/ItemRenderer";
import "./Styling/usefulClasses.css"
import Error from "./Ui/Error/Error";
import {ExperimentType, ItemType, ErrorType} from "./Ui/types/typsT.ts";


/**
 * The experiment renderer
 * @param insertToDbArray - the insert to db function
 * @param sendToDB - the data to send to db
 * @returns {JSX.Element} - the React component of the experiment
 * @constructor
 */
function Experiment({insertToDbArray, sendToDB}) {
    const error = useMemo(() => validateExperiment(experimentData), []);
    const items = useMemo(() => getItemsInOrder(experimentData), []);
    const [currentItemIndex, setCurrentItemIndex] = useState(0);

    if (error.isError) {
        return <div className={"w-full h-full flex justify-center items-center"}>
            <Error error={error} />;
        </div>
    }

    if (currentItemIndex >= items.length) {
        return <div className={"w-full h-full justify-center flex items-center"}>
            <h1 className={"text-clamping-lg text-center m-1"}>Thank you for participating</h1>
        </div>
    }

    return (
        <div className={"flex justify-center item-center border flex-col"} style={{width: "100dvw", height: "100dvh"}}>
            {/*<h1 className={"text-clamping-mid text-center m-1"}>{experimentData.name}</h1>*/}
            {items.map((item, index) => {
                if (index === currentItemIndex) {
                    if (!item.uiData) {
                        return <Error error={{errorMessage: "Error No UiData in json", isError: true}}
                                      key={`item-index-${index}`}/>
                    }
                    return <ItemRenderer item={item} uiData={item.uiData} key={`item-index-${index}`}
                                         startTime={Date.now()} setCurrentItemIndex={setCurrentItemIndex}
                                         sendToDB={sendToDB} insertToDbArray={insertToDbArray}/>;
                }
            })}
        </div>
    );
}

/**
 * The randomize element - reads the randomize object from the experiment and create the flow of the experiment
 * @param experimentData{ExperimentType}
 * @returns {ItemType[]}
 */
function getItemsInOrder(experimentData) {
    const items = [...experimentData.items]; // clone to avoid mutation

    for (const {start, end} of experimentData.randomize) {
        const slice = items.slice(start, end + 1);
        // Fisher-Yates shuffle
        for (let i = slice.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [slice[i], slice[j]] = [slice[j], slice[i]];
        }

        // Replace the original range with the shuffled one
        for (let i = start; i <= end; i++) {
            items[i] = slice[i - start];
        }
    }

    return items;
}


/**
 * Validate the general data of the experiment data - not testing individual ui object layer - this layer is handeled by the item itself
 * @param experimentData{ExperimentType}
 * @return {ErrorType}
 */
function validateExperiment(experimentData){
    const error= { errorMessage: "", isError: false };

    // Validate experiment name
    if (typeof experimentData.name !== "string" || experimentData.name.trim() === "") {
        error.isError = true;
        error.errorMessage += "Experiment must have a valid name.\n";
    }

    // Validate items array
    if (!Array.isArray(experimentData.items) || experimentData.items.length === 0) {
        error.isError = true;
        error.errorMessage += "Experiment must have a non-empty items array.\n";
    } else {
        experimentData.items.forEach((item, index) => {
            if (!item || typeof item.id !== "string" || item.id.trim() === "") {
                error.isError = true;
                error.errorMessage += `Item at index ${index} is missing a valid id.\n`;
            }
        });
    }

    // Validate randomize ranges
    experimentData.randomize.forEach(({ start, end }, index) => {
        if (
            typeof start !== "number" || typeof end !== "number" ||
            start < 0 || end >= experimentData.items.length || start > end
        ) {
            error.isError = true;
            error.errorMessage += `Error at index ${index} of random element (start: ${start}, end: ${end})\n`;
        }
    });

    return error;
}

export default Experiment;