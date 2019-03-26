/* global wpseoWpData */
import { SET_TAXONOMIES } from "../actions";

/**
 * Reducer containing WordPress taxonomies.
 *
 * @param {Object} state  The current state.
 * @param {Object} action Action object.
 *
 * @returns {Object} The new state.
 */
export default ( state = wpseoWpData.taxonomies, action ) => {
	switch ( action.type ) {
		case SET_TAXONOMIES:
			return action.taxonomies;
		default:
			return state;
	}
};
