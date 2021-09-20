import { ASYNC_STATUS } from "@yoast/admin-ui-toolkit/constants";
import { RUN_ANALYSIS_ERROR, RUN_ANALYSIS_REQUEST, RUN_ANALYSIS_SUCCESS } from "../constants";

/**
 * A reducer for the focus analysis data in the state.
 *
 * @param {Object} state The state.
 * @param {Object} action The action.
 *
 * @returns {Object} The new state.
 */
export default function analysisFocusReducer( state, { type, payload } ) {
	switch ( type ) {
		case RUN_ANALYSIS_REQUEST:
			return {
				...state,
				status: ASYNC_STATUS.loading,
			};
		case RUN_ANALYSIS_SUCCESS:
			return {
				status: ASYNC_STATUS.success,
				readability: payload.readability.results,
				seo: payload.seo.results,
			};
		case RUN_ANALYSIS_ERROR:
			return {
				...state,
				status: ASYNC_STATUS.error,
			};

		default:
			return state;
	}
}
