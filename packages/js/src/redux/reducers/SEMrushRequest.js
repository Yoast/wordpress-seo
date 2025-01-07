/* eslint-disable complexity */

import {
	SET_REQUEST_LIMIT_REACHED,
	SET_REQUEST_FAILED,
	SET_REQUEST_SUCCEEDED,
	SET_REQUEST_PENDING,
	NEW_REQUEST,
	CHANGE_COUNTRY,
	NO_DATA_FOUND,
	SET_LOGIN_STATUS,
} from "../actions/SEMrushRequest";

const INITIAL_STATE = {
	isRequestPending: false,
	keyphrase: "",
	countryCode: "us",
	isSuccess: false,
	response: null,
	limitReached: false,
	hasData: true,
	isLoggedIn: false,
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
		case SET_REQUEST_PENDING:
			return {
				...state,
				isRequestPending: true,
			};
		case NEW_REQUEST:
			return {
				...state,
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
		case CHANGE_COUNTRY:
			return {
				...state,
				countryCode: action.countryCode,
			};
		case NO_DATA_FOUND:
			return {
				...state,
				isSuccess: true,
				isRequestPending: false,
				hasData: false,
				response: null,
			};
		case SET_LOGIN_STATUS:
			return {
				...state,
				isLoggedIn: action.loginStatus,
			};
		default:
			return state;
	}
}

export default SEMrushRequestReducer;
