import {
	SET_REQUEST_LIMIT_REACHED,
	SET_REQUEST_FAILED,
	SET_REQUEST_STARTED,
	SET_REQUEST_SUCCEEDED, SET_REQUEST_COUNTRY
} from "../actions/SEMrushRequest";

const INITIAL_STATE = null;

/**
 * A reducer for the SEMrush request.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The received action.
 *
 * @returns {Object} The state.
 */
function SEMrushRequestReducer( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case SET_REQUEST_STARTED:
			// We set the state to 0 here because the request has not been completed yet.
			state = 0;
			return {
				state,
		};
		case SET_REQUEST_SUCCEEDED:
			// The status code should be 200 OK here.
			state = action.response.status;
			return {
				state,
		};
		case SET_REQUEST_FAILED:
			// The status code should be an error code here.
			state = action.response.status;
			return {
				state,
		};
		case SET_REQUEST_LIMIT_REACHED:
			// The status is a negative number which represents the amount of requests made today.
			state = (action.countedRequests * -1);
			return {
				state,
		};
		case SET_REQUEST_COUNTRY:
			// Here the state and the set country is returned.
			let country = action.country;
			return {
				state,
				country,
		};
		default:
			return {
				state,
		};
	}
}

export default SEMrushRequestReducer;
