import {
	SET_REQUEST_LIMIT_REACHED,
	SET_REQUEST_FAILED,
	SET_REQUEST_SUCCEEDED,
	NEW_REQUEST,
	CHANGE_COUNTRY,
} from "../actions/SEMrushRequest";

const INITIAL_STATE = {
	isRequestPending: false,
	OAuthToken: "",
	keyphrase: "",
	countryCode: "us",
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
				...state,
				isRequestPending: true,
				OAuthToken: action.OAuthToken,
				keyphrase: action.keyphrase,
				countryCode: action.countryCode,
				isSuccess: false,
				response: null,
			};
		case SET_REQUEST_SUCCEEDED:
			// The status code should be 200 OK here.
			return {
				...state,
				isRequestPending: false,
				isSuccess: true,
				response: action.response,
			};
		case SET_REQUEST_FAILED:
			// The status code should be an error code here.
			return {
				...state,
				isRequestPending: false,
				isSuccess: false,
				response: action.response,
			};
		case SET_REQUEST_LIMIT_REACHED:
			return {
				...state,
				limitReached: true,
			};
		case CHANGE_COUNTRY:
			return {
				...state,
				countryCode: action.countryCode,
			};
		default:
			return state;
	}
}

export default SEMrushRequestReducer;
