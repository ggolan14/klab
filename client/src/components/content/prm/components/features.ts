import {MouseTrackingObject} from "../features/MouseTracking/types.js";
import {ItemTypeEditor, TrialTypeType} from "../features/ItemRender/types.js";
import {ZoomElementType} from "../features/Zoom/types.js";
import {UiObjects} from "./types/experimentTypes/experimentsTypes.ts";
import {ElementsKeys} from "./constants.ts";

export type Features = {
    idle?: boolean,
    zoom?: boolean,
    focus?: boolean,
    mouseTracking?: boolean,
}

/**
 * Test which features are true and which are false and returns it;
 * @param trialType the current trial type
 */
function getFeatures(trialType: TrialTypeType | undefined | ItemTypeEditor): Features {

    const features: Features = {
        zoom: false,
        idle: false,
        focus: false,
        mouseTracking: false,
    };
    if (!trialType) {
        return features;
    }
    if (!('features' in trialType.objectDetails) ||
        typeof trialType.objectDetails.features !== 'object' ||
        trialType.objectDetails.features === null) {
        return features;
    }

    const objectFeatures = trialType.objectDetails.features as Record<string, unknown>;

    // Check for every element in the Features type
    (Object.keys(features) as Array<keyof Features>).forEach(key => {
        if (key in objectFeatures && typeof objectFeatures[key] === 'boolean') {
            features[key] = objectFeatures[key] as boolean;
        }
    });

    return features;
}

/**
 * updating the state the output object with the idle time
 * @param output the output object. Insure it isn't a state object!
 * @param totalTimeIdle the total time the user was in idle.
 */
export function updateIdle(output :object , totalTimeIdle:number) {
    return {...output, Idle: totalTimeIdle};
}

/**
 * updating the responseTimeLast
 * @param output the output object. Insure it isn't a state object!
 * @param responseTimeLast the last time the user interacted with the trail
 */
export function updateResponseTimeLast(output :object , responseTimeLast:number) {
    return {...output, ResponseTimeLast: responseTimeLast};
}
/**
 * updating the responseTimeFirst
 * @param output the output object. Insure it isn't a state object!
 * @param responseTimeFirst the first time the user interacted with the trail
 */
export function updateResponseTimeFirst(output :object , responseTimeFirst:number|null) {
    return {...output, ResponseTimeFirst: responseTimeFirst};
}


/**
 * updating the responseTimeLast
 * @param output the output object. Insure it isn't a state object!
 * @param UiElements the trialTypeObjects
 */
export function updateImages(output :object , UiElements:UiObjects[]) {
    const images:string[] = [];
    for (const uiObject of UiElements) {
        if (uiObject.type === ElementsKeys.IMAGES){
            uiObject.urls!.forEach((url) => {images.push(url)})
        }
    }
    if (images.length > 0) {
        return {...output,images:images }
    }
    return {...output };
}
/**
 * updating the Focus element in an object.
 * @param output the object.
 * @param responseTimeLast the response time last.
 * @param unFocusTime the amount of time the user was not focused
 * @return a new object with the same data as output but with the Focus element in it.
 */
export function updateFocus(output :object , responseTimeLast:number , unFocusTime:number) {
    let outOfFocusPercentage =  0
    if (unFocusTime > 0){
        outOfFocusPercentage = (100 *(unFocusTime/responseTimeLast));
    }
    const focus = {
        unFocusTime: unFocusTime,
        outOfFocusPercentage: outOfFocusPercentage,
        inFocusPercentage: 100 - outOfFocusPercentage,
    }
    return {...output, Focus: focus};
}

/**
 * TODO ADD DOCUMENTATION
 * @param output
 * @param zoomOutput
 */
export function updateZoom(output :object  , zoomOutput:ZoomElementType[]) {
    return {...output, Zoom: zoomOutput};
}

/**
 * TODO ADD DOCUMENTATION
 * @param output
 * @param mouseTracking
 */
export function updateMouseTracking(output :object  , mouseTracking:MouseTrackingObject[]) {
    return {...output, MouseTracking: mouseTracking};
}

export type FeaturesDataType = {
    totalIdleTime: number,
    unFocusTime:number,
    responseTimeLast:number,
}

/**
 * TODO ADD DOCUMENTATION
 * @param features
 * @param featuresData
 * @param newOutput
 * @param zoomOutput
 * @param mouseTracking
 */
export function updateByFeatures(features: Features, featuresData: FeaturesDataType, newOutput: object , zoomOutput:ZoomElementType[] , mouseTracking:MouseTrackingObject[]) :object{
    if (features.idle){
        newOutput = updateIdle(newOutput , featuresData.totalIdleTime);
    }
    if (features.mouseTracking){
        newOutput = updateMouseTracking(newOutput,mouseTracking);
    }
    if(features.focus){
        newOutput = updateFocus(newOutput , featuresData.responseTimeLast , featuresData.unFocusTime)
    }
    if (features.zoom){
        newOutput = updateZoom(newOutput ,zoomOutput)
    }
    return newOutput;
}



export default getFeatures;