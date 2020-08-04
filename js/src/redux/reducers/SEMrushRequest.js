import {
	SET_REQUEST_LIMIT_REACHED,
	SET_REQUEST_FAILED,
	SET_REQUEST_SUCCEEDED,
	NEW_REQUEST,
	CHANGE_DATABASE,
	NO_DATA_FOUND,
} from "../actions/SEMrushRequest";

const INITIAL_STATE = {
	isRequestPending: false,
	keyphrase: "",
	database: "us",
	isSuccess: false,
	response: null,
	limitReached: false,
	hasData: true,
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
				keyphrase: action.keyphrase,
				database: action.database,
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
				hasData: true,
			};
		case SET_REQUEST_FAILED:
			// The status code should be an error code here.
			return {
				...state,
				isRequestPending: false,
				isSuccess: false,
				response: action.response,
				hasData: false,
			};
		case SET_REQUEST_LIMIT_REACHED:
			return {
				...state,
				isRequestPending: false,
				limitReached: true,
				hasData: false,
			};
		case CHANGE_DATABASE:
			return {
				...state,
				database: action.database,
			};
		case NO_DATA_FOUND:
			return {
				...state,
				isSuccess: true,
				isRequestPending: false,
				hasData: false,
				response: null,
			};
		default:
			return state;
	}
}

export default SEMrushRequestReducer;
