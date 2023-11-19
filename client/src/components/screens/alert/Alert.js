import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Alert = ({ alerts }) =>
  alerts !== null &&
    <div
        className={`alert alert-${alerts.alertType}`}
    >
        {alerts.msg}
    </div>

Alert.propTypes = {
    alerts: PropTypes.object
};

const mapStateToProps = state => ({
  alerts: state.alert
});

export default connect(mapStateToProps)(Alert);
