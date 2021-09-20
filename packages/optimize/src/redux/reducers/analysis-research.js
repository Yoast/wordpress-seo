import { ASYNC_STATUS } from "@yoast/admin-ui-toolkit/constants";
import { RUN_RESEARCH_ERROR, RUN_RESEARCH_REQUEST, RUN_RESEARCH_SUCCESS } from "../constants";

export const RESEARCHES = {
	MORPHOLOGY: "morphology",
};

/**
 * Reduces the analysis research state.
 *
 * @param {Object} state  The state.
 * @param {Object} action The action.
 *
 * @returns {Object} The new state.
 */
export default function researchReducer( state, { type, payload } ) {
	let newState;

	switch ( type ) {
		case RUN_RESEARCH_REQUEST:
			return {
				...state,
				status: ASYNC_STATUS.loading,
			};
		case RUN_RESEARCH_SUCCESS:
			newState = {
				...state,
				status: ASYNC_STATUS.success,
				[ payload.research ]: payload.data,
			};

			return newState;
		case RUN_RESEARCH_ERROR:
			return {
				...state,
				status: ASYNC_STATUS.error,
			};

		default:
			return state;
	}
}
