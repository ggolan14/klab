import {handleHeadLineError} from "../HeadLine/errors";
import Error from "../Error/Error";
/**
 * type TextProps = {
 *     currentObj: UiObjects
 * }
 * @param currentObj
 * @returns {JSX.Element}
 * @constructor
 */
function Text({currentObj}) {
    const error = handleHeadLineError(currentObj);
    if (error.isError) {
        return <Error error={error}/>;
    }
    return <h2 className={"font-exo text-clamping-sm max-w-[80%]"} > {currentObj.text}</h2>
}

export default Text;