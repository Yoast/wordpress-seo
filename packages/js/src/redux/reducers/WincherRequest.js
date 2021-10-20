/* eslint-disable complexity */

import {
	WINCHER_SET_REQUEST_LIMIT_REACHED,
	WINCHER_SET_REQUEST_FAILED,
	WINCHER_SET_REQUEST_SUCCEEDED,
	WINCHER_NEW_REQUEST,
	WINCHER_SET_LOGIN_STATUS,
	WINCHER_SET_TRACK_ALL_REQUEST,
	WINCHER_SET_AUTOMATICALLY_TRACK_ALL_REQUEST,
} from "../actions";

const INITIAL_STATE = {
	isSuccess: false,
	response: null,
	limitReached: false,
	isLoggedIn: false,
	isNewlyAuthenticated: false,
	limit: 10,
	trackAll: false,
	automaticallyTrack: false,
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
			    limitReached: false,
				isSuccess: false,
				response: null,
				isNewlyAuthenticated: false,
			};
		case WINCHER_SET_REQUEST_SUCCEEDED:
			// The status code should be 200 OK here.
			return {
				...state,
				isSuccess: true,
				response: action.response,
				trackAll: false,
			};
		case WINCHER_SET_REQUEST_FAILED:
			// The status code should be an error code here.
			return {
				...state,
				isSuccess: false,
				response: action.response,
				trackAll: false,
			};
		case WINCHER_SET_REQUEST_LIMIT_REACHED:
			return {
				...state,
				limitReached: true,
				limit: action.limit,
				trackAll: false,
			};
		case WINCHER_SET_LOGIN_STATUS:
			return {
				...state,
				isLoggedIn: action.loginStatus,
				isNewlyAuthenticated: action.newlyAuthenticated,
			};
		case WINCHER_SET_TRACK_ALL_REQUEST:
			return {
				...state,
				trackAll: true,
			};
		case WINCHER_SET_AUTOMATICALLY_TRACK_ALL_REQUEST:
			return {
				...state,
				automaticallyTrack: action.automaticallyTrack,
			};
		default:
			return state;
	}
}

export default WincherRequestReducer;
