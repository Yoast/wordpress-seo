import { SET_SYNONYMS } from "../actions/synonyms";

const INITIAL_STATE = "";

/**
 * A reducer for the synonyms.
 *
 * @param {Object} state  The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The state.
 */
function synonymsReducer( state = INITIAL_STATE, action ) {
	switch( action.type ) {
		case SET_SYNONYMS:
			return action.synonyms;
		default:
			return state;
	}
}

export default synonymsReducer;
