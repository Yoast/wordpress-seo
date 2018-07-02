import filter from "lodash/filter";

import {
	SET_SYNONYMS,
	SET_KEYWORD_SYNONYMS,
	REMOVE_KEYWORD_SYNONYMS,
} from "../actions/synonyms";

const INITIAL_STATE = {};

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

		case SET_KEYWORD_SYNONYMS:
			return {
				...state,
				[ action.keyword ]: action.synonyms,
			};

		case REMOVE_KEYWORD_SYNONYMS:
			return filter( state, ( synonyms, keyword ) => keyword === action.keyword );

		default:
			return state;
	}
}

export default synonymsReducer;
