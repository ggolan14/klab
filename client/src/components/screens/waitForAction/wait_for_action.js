import React from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {setGameMode} from "../../../actions/app_actions";

const WaitForAction = ({waitForAction}) => {

    if (!waitForAction)
        return <></>;

    return (
        <div
            className='wait_for_action'
        >
            <div className='wait_for_action-back'/>

            <div
                className='wait_for_action-msg'
            >
                <label>Please wait a moment..</label>
                <div className="wait_for_action-sk-chase">
                    <div className="wait_for_action-sk-chase-dot"/>
                    <div className="wait_for_action-sk-chase-dot"/>
                    <div className="wait_for_action-sk-chase-dot"/>
                    <div className="wait_for_action-sk-chase-dot"/>
                    <div className="wait_for_action-sk-chase-dot"/>
                    <div className="wait_for_action-sk-chase-dot"/>
                </div>
            </div>
        </div>
    );
};

WaitForAction.propTypes = {
    waitForAction: PropTypes.bool,
};

const mapStateToProps = state => ({
    waitForAction: state.app.waitForAction,
});

export default connect(mapStateToProps, {setGameMode})(WaitForAction);


