import {handleHeadLineError} from "./errors";
import Error from "../Error/Error";



/**
 *
 * type HeadLineProps = {
 *     currentObj: UiObjects
 * }
 * @param currentObj
 * @returns {JSX.Element}
 * @constructor
 */
function HeadLine({currentObj}) {
    const error = handleHeadLineError(currentObj);
    if (error.isError) {
        return <Error error={error}/>;
    }
    return <h2 className={"font-exo text-center text-clamping-mid max-w-[90%]"}> {currentObj.text}</h2>
}

export default HeadLine;