import {
	SET_REQUEST_LIMIT_REACHED,
	SET_REQUEST_FAILED,
	SET_REQUEST_SUCCEEDED,
	NEW_REQUEST,
} from "../actions/SEMrushRequest";

const INITIAL_STATE = {
	isRequestPending: false,
	OAuthToken: null,
	keyphrase: "",
	country: "us",
	isSuccess: false,
	response: null,
	limitReached: false,
};
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
		case NEW_REQUEST:
			return {
				isRequestPending: true,
				OAuthToken: action.OAuthToken,
				keyphrase: action.keyphrase,
				country: action.country,
				isSuccess: false,
				response: null,
				limitReached: state.limitReached,
			};
		case SET_REQUEST_SUCCEEDED:
			// The status code should be 200 OK here.
			return {
				isRequestPending: false,
				OAuthToken: null,
				keyphrase: state.keyphrase,
				country: state.country,
				isSuccess: true,
				response: action.response,
				limitReached: state.limitReached,
			};
		case SET_REQUEST_FAILED:
			// The status code should be an error code here.
			return {
				isRequestPending: false,
				OAuthToken: null,
				keyphrase: state.keyphrase,
				country: state.country,
				isSuccess: false,
				response: action.response,
				limitReached: state.limitReached,
			};
		case SET_REQUEST_LIMIT_REACHED:
			return {
				isRequestPending: false,
				OAuthToken: null,
				keyphrase: state.keyphrase,
				country: action.country,
				isSuccess: false,
				response: null,
				limitReached: true,
			};
		default:
			return {
				state,
			};
	}
}

export default SEMrushRequestReducer;
