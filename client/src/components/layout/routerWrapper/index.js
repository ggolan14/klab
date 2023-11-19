import React from "react";
import {useLocation} from "react-router-dom";

const RouterWrapper = ({Component}) => {
    const location = useLocation();
    return <Component location={location}/> // your component
}
export default RouterWrapper;
