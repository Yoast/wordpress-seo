import { ASYNC_STATUS } from "@yoast/admin-ui-toolkit/constants";
import { mergePathToState } from "@yoast/admin-ui-toolkit/helpers";

import {
	HANDLE_MORE_RESULTS_QUERY_ERROR,
	HANDLE_MORE_RESULTS_QUERY_REQUEST,
	HANDLE_MORE_RESULTS_QUERY_SUCCESS,
	HANDLE_QUERY_ERROR,
	HANDLE_QUERY_REQUEST,
	HANDLE_QUERY_SUCCESS,
	SET_ALL_QUERY_DATA,
	SET_QUERY_DATA,
} from "../constants";

/**
 * Reducer for the handle query status and data.
 * @param {Object} state The current state.
 * @param {Action} action The action object.
 * @returns {Object} The new state.
 */
const queryReducer = ( state, { type, payload } ) => {
	switch ( type ) {
		case HANDLE_QUERY_REQUEST:
			return {
				...state,
				status: ASYNC_STATUS.loading,
				error: {},
			};
		case HANDLE_QUERY_SUCCESS:
			return {
				...state,
				status: ASYNC_STATUS.success,
			};
		case HANDLE_QUERY_ERROR:
			return {
				...state,
				status: ASYNC_STATUS.error,
				error: payload.error,
			};

		case HANDLE_MORE_RESULTS_QUERY_REQUEST:
			return {
				...state,
				moreResultsStatus: ASYNC_STATUS.loading,
				moreResultsError: {},
			};
		case HANDLE_MORE_RESULTS_QUERY_SUCCESS:
			return {
				...state,
				moreResultsStatus: ASYNC_STATUS.success,
			};
		case HANDLE_MORE_RESULTS_QUERY_ERROR:
			return {
				...state,
				moreResultsStatus: ASYNC_STATUS.error,
				moreResultsError: payload.error,
			};

		case SET_ALL_QUERY_DATA:
			return {
				...state,
				data: payload,
			};

		case SET_QUERY_DATA:
			return mergePathToState( state, `data.${ payload.path }`, payload.value );

		default:
			return state;
	}
};

export default queryReducer;
