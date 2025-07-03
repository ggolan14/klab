import type {UiObjects} from "../../Types/experimentsTypes.ts";
import Error from "../Error/Error.tsx";
import {handleCustomWidgetErrors} from "./error.ts";
import * as logicFunctions from "../../Functions/dynamicFunctions.tsx";
import type {FC} from "react";

type Props = {
    uiObject: UiObjects;
};

function CustomWidget({uiObject}: Props) {
    const error = handleCustomWidgetErrors(uiObject);
    if (error.isError) return <Error error={error} />;

    const Component = logicFunctions[uiObject.logic as keyof typeof logicFunctions] as FC;

    if (!Component || typeof Component !== "function") {
        return <Error error={{ errorMessage: "No valid component found", isError: true }} />;
    }

    return <Component />;
}

export default CustomWidget;
