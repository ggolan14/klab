import {handleCustomWidgetErrors} from "./error";
import * as logicFunctions from "./function";
import Error from "../Error/Error";

/**
 *
 * @param uiObject{UiObjects}
 * @param setPageFlow
 * @param pageFlow
 * @returns {JSX.Element}
 * @constructor
 */
function CustomWidget({uiObject,pageFlow,setPageFlow }) {
    const error = handleCustomWidgetErrors(uiObject);
    if (error.isError) return <Error error={error} />;

    const Component = logicFunctions[uiObject.logic];

    if (!Component || typeof Component !== "function") {
        return <Error error={{ errorMessage: "No valid component found", isError: true }} />;
    }
    return <Component obj={uiObject} pageFlow={pageFlow} setPageFlow={setPageFlow} />;
}

export default CustomWidget;
