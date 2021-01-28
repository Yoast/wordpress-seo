import {
	LOAD_DISMISSED_ALERTS,
	DISMISS_ALERT,
} from "../actions/persistentDismissableAlert";

const INITIAL_STATE = {
	dismissedAlerts: {},
};

/**
 * A reducer for the dismissedAlerts.
 *
 * @param {Object} state  The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The state.
 */
function dismissedAlertsReducer( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case LOAD_DISMISSED_ALERTS:
			return {
				...state,
				dismissedAlerts: action.dismissedAlerts,
			};
		case DISMISS_ALERT:
			return {
				... state,
				dismissedAlerts: {
					...state.dismissedAlerts,
					[ action.alertKey ]: true,
				},
			};
		default:
			return state;
	}
}

export default dismissedAlertsReducer;
