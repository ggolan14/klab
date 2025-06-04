import {Dispatch, SetStateAction, useEffect, useState} from "react";

/**
 * type MouseTrackingObject = {
 *     x: number,
 *     y: number,
 *     action: string,
 *     time: number,
 * }
 */

/**
 *
 * @param setMouseTracking  type: Dispatch<SetStateAction<MouseTrackingObject[]>>
 * @param currentObj type:MouseTrackingObject
 * @param inputInterval type:number
 */
function updateMouseTrackingObject(setMouseTracking,currentObj, inputInterval) {
    setMouseTracking(prevState => {
        const newObj = [...prevState]
        if (newObj.length === 0){
            newObj.push(currentObj)
            return newObj;
        }

        if (inputInterval > currentObj.time - newObj[newObj.length - 1].time) {
            return prevState;
        }
        newObj.push(currentObj)
        return newObj;
    })
}
const useMouseTracking = (startTime, inputInterval) => {
    const [mouseTracking, setMouseTracking] = useState([]);

    const handleMouseMove = (event) => {
        const currentObj = {
            x: event.clientX,
            y: event.clientY,
            action: "mousemove",
            time: Date.now() - startTime
        }
        updateMouseTrackingObject(setMouseTracking , currentObj , inputInterval);
    };
    const handleMouseClick = (event) => {
        const currentObj = {
            x: event.clientX,
            y: event.clientY,
            action: "click",
            time: Date.now() - startTime
        }
        updateMouseTrackingObject(setMouseTracking , currentObj , inputInterval);
    }
    const handleMouseWheel = (event) => {
        const currentObj = {
            x: event.clientX,
            y: event.clientY,
            action: "wheel",
            time: Date.now() - startTime
        }
        updateMouseTrackingObject(setMouseTracking , currentObj , inputInterval);
    }

    useEffect(() => {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("click", handleMouseClick);
        document.addEventListener("wheel", handleMouseWheel);


        return () => {
            document.removeEventListener('click', handleMouseClick);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener("wheel", handleMouseWheel);
        };

    }, [])
    return {mouseTracking}

}

export default useMouseTracking;