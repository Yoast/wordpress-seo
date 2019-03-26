/* global wpseoWpData */
import {
	SET_TERMS,
} from "../actions";

/**
 * Reducer containing WordPress terms.
 *
 * @param {Object} state  The current state.
 * @param {Object} action Action object.
 *
 * @returns {Object} The new state.
 */
export default ( state = wpseoWpData.terms, action ) => {
	switch ( action.type ) {
		case SET_TERMS:
			return {
				...state,
				[ action.taxonomy ]: action.terms,
			};
		default:
			return state;
	}
};
