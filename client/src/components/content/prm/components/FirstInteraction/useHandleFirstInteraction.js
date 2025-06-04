import {useEffect, useState} from "react";
import {number} from "prop-types";

/**
 *
 * @param startTime type: number
 * @param item type: ItemType
 * @returns {{responseTimeFirst: *}}
 */
const useHandleFirstInteraction = (startTime, item) => {

    const [responseTimeFirst, setResponseTimeFirst] = useState(null);

    useEffect(() => {
        const handleInteraction = () => {
            setResponseTimeFirst(Date.now() - startTime);
            // Remove both event listeners after the first interaction
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('mousemove', handleInteraction);
        };

        // Add the event listeners
        document.addEventListener('click', handleInteraction);
        document.addEventListener('mousemove', handleInteraction);

        // Cleanup function to remove the event listeners if the component unmounts
        return () => {
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('mousemove', handleInteraction);
        };
    }, [item]);
    return {responseTimeFirst}
};

export default useHandleFirstInteraction;