import { ASYNC_STATUS } from "@yoast/admin-ui-toolkit/constants";

import {
	HANDLE_SAVE_REQUEST,
	HANDLE_SAVE_SUCCESS,
	HANDLE_SAVE_ERROR,
} from "../constants.js";

/**
 * Reducer for the handle save async status and result.
 * @param {Object} state The current state.
 * @param {Action} action The action object.
 * @returns {Object} The new state.
 */
const saveReducer = ( state, { type, payload } ) => {
	switch ( type ) {
		case HANDLE_SAVE_REQUEST:
			return {
				...state,
				status: ASYNC_STATUS.loading,
				isRedirected: false,
				errors: {},
			};
		case HANDLE_SAVE_SUCCESS:
			return {
				...state,
				status: ASYNC_STATUS.success,
				isRedirected: payload.isRedirected,
			};
		case HANDLE_SAVE_ERROR:
			return {
				...state,
				status: ASYNC_STATUS.error,
				error: payload.error,
			};

		default:
			return state;
	}
};

export default saveReducer;
