import { ASYNC_STATUS } from "@yoast/admin-ui-toolkit/constants";

import { HANDLE_ROUTE_CHANGED_REQUEST, HANDLE_SAVE_ERROR, HANDLE_SAVE_REQUEST, HANDLE_SAVE_SUCCESS } from "../constants.js";

/**
 * Reducer for the handle save async status and result
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
				errors: {},
			};
		case HANDLE_SAVE_SUCCESS:
			return {
				...state,
				status: ASYNC_STATUS.success,
			};
		case HANDLE_SAVE_ERROR:
			return {
				...state,
				status: ASYNC_STATUS.error,
				errors: payload.errors,
			};

		case HANDLE_ROUTE_CHANGED_REQUEST:
			return {
				...state,
				status: ASYNC_STATUS.idle,
				errors: {},
			};

		default:
			return state;
	}
};

export default saveReducer;
