/* eslint-disable complexity */

import {
	WINCHER_SET_REQUEST_LIMIT_REACHED,
	WINCHER_SET_REQUEST_FAILED,
	WINCHER_SET_REQUEST_SUCCEEDED,
	WINCHER_NEW_REQUEST,
	WINCHER_NO_DATA_FOUND,
	WINCHER_SET_LOGIN_STATUS,
	WINCHER_TOGGLE_KEYPHRASE_TRACKING,
} from "../actions";

const INITIAL_STATE = {
	isRequestPending: false,
	keyphrase: "",
	isSuccess: false,
	response: null,
	limitReached: false,
	hasData: true,
	isLoggedIn: false,
};
/**
 * A reducer for the Wincher request.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The received action.
 *
 * @returns {Object} The state.
 */
function WincherRequestReducer( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case WINCHER_NEW_REQUEST:
			return {
				...state,
				isRequestPending: true,
				keyphrase: action.keyphrase,
				isSuccess: false,
				response: null,
			};
		case WINCHER_SET_REQUEST_SUCCEEDED:
			// The status code should be 200 OK here.
			return {
				...state,
				isRequestPending: false,
				isSuccess: true,
				response: action.response,
				hasData: true,
			};
		case WINCHER_SET_REQUEST_FAILED:
			// The status code should be an error code here.
			return {
				...state,
				isRequestPending: false,
				isSuccess: false,
				response: action.response,
				hasData: false,
			};
		case WINCHER_SET_REQUEST_LIMIT_REACHED:
			return {
				...state,
				isRequestPending: false,
				limitReached: true,
				hasData: false,
			};
		case WINCHER_NO_DATA_FOUND:
			return {
				...state,
				isSuccess: true,
				isRequestPending: false,
				hasData: false,
				response: null,
			};
		case WINCHER_SET_LOGIN_STATUS:
			return {
				...state,
				isLoggedIn: action.loginStatus,
			};
		case WINCHER_TOGGLE_KEYPHRASE_TRACKING:
			return {
				...state,
				trackedKeyphrase: action.trackedKeyphrase,
			};
		default:
			return state;
	}
}

export default WincherRequestReducer;
