import {useEffect} from "react";


/**
 expected type props: type hookProps = {
 pageFlow: PageFlowOutput[],
 setPageFlow: Dispatch<SetStateAction<PageFlowOutput[]>>,
 }
 **/

/**
 * The hook is to prevent when one element output is set to false while the page flow already moved forward more than one element
 * @param pageFlow the page flow array
 * @param setPageFlow the setter method from React.
 */
const useHandlePageFlow = ({pageFlow, setPageFlow}) => {
    useEffect(() => {
        const indexToRemoveFrom = isElementAlreadyAnswered(pageFlow);

        if (indexToRemoveFrom === -1) {
            return
        }

        setPageFlow(prevState => {
            const newPageFlow = [...prevState];
            for (let i = indexToRemoveFrom; i < newPageFlow.length; i++) {
                newPageFlow[i] = {...newPageFlow[i], output: null}
            }
            return newPageFlow;
        });

    }, [pageFlow]);
}
export default useHandlePageFlow;


/**
 * Checks if there is an unanswered element in the pageFlow array that has an answered element following it.
 * @param pageFlow - Array of PageFlowOutput elements, where each element can have an `output` property.
 * @returns The index of the first unanswered element with an answered element later in the array, or -1 if not found.
 */
function isElementAlreadyAnswered(pageFlow){
    for (let i = 0; i < pageFlow.length; i++) {
        const currentElementI = pageFlow[i];
        if (currentElementI.output != null) {
            continue;
        }
        for (let j = i + 1; j < pageFlow.length; j++) {
            const currentElementJ = pageFlow[j];
            if (currentElementJ.output != null) {
                console.log({currentElementI, currentElementJ, i})
                return i;
            }
        }
    }

    return -1;
}
