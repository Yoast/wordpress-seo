import { mergeWithArrayReplace } from "@yoast/admin-ui-toolkit/helpers";
import {
	HANDLE_MORE_RESULTS_QUERY_ERROR,
	HANDLE_MORE_RESULTS_QUERY_SUCCESS,
	HANDLE_QUERY_ERROR,
	HANDLE_QUERY_SUCCESS,
	RESET_LIST_DATA,
} from "../constants";
import { defaultInitialState } from "../initial-state";

/**
 * A reducer for the list data in the state.
 *
 * @param {Object} state The current state.
 * @param {Action} action The action object.
 * @returns {Object} The new state.
 */
const listDataReducer = ( state, { type, payload } ) => {
	switch ( type ) {
		case HANDLE_QUERY_SUCCESS:
			return payload.data;

		case HANDLE_MORE_RESULTS_QUERY_SUCCESS:
			return {
				items: [ ...state.items, ...payload.data.items ],
				after: payload.data.after,
			};

		case RESET_LIST_DATA:
		case HANDLE_QUERY_ERROR:
		case HANDLE_MORE_RESULTS_QUERY_ERROR:
			return mergeWithArrayReplace( {}, defaultInitialState.list.data );

		default:
			return state;
	}
};

export default listDataReducer;
