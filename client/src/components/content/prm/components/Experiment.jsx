import React, {useState} from 'react';
import experimentData from "../experiment.json"
import ItemRenderer from "./ItemRender/ItemRenderer";
import "./Styling/usefulClasses.css"
import Error from "./Ui/Error/Error";

function Experiment() {
    const items = getItemsInOrder(experimentData);
    const [currentItemIndex, setCurrentItemIndex] = useState(0);

    if (currentItemIndex >= items.length) {
        return <div className={"w-full h-full justify-center flex items-center"}>
             <h1 className={"text-clamping-lg text-center m-1"}>Thank you for participating</h1>
        </div>
    }
    return (
        <div className={"flex justify-center item-center border flex-col"} style={{width: "100dvw", height: "100dvh"}}>
            <h1 className={"text-clamping-mid text-center m-1"}>{experimentData.name}</h1>
            {items.map((item, index) => {
                if (index === currentItemIndex) {

                    if (!item.uiData) {
                        return <Error error={ {errorMessage:"Error No UiData in json" , isError: true}} key={`item-index-${index}`}/>
                    }
                    return <ItemRenderer item={item} uiData={item.uiData} key={`item-index-${index}`}
                                         startTime={Date.now()} setCurrentItemIndex={setCurrentItemIndex}/>;
                }
            })}
        </div>
    );
}

function getItemsInOrder(experimentData) {
    return experimentData.items;
}

export default Experiment;