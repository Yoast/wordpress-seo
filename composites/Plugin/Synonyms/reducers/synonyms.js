import {
	SET_SYNONYMS,
	ADD_SYNONYMS,
	INSERT_SYNONYMS,
	CHANGE_SYNONYMS,
	REMOVE_SYNONYMS,
} from "../actions/synonyms";

const INITIAL_STATE = [];

/**
 * Checks if an index is inside the array.
 *
 * @param {array}  arr   The array to check in.
 * @param {number} index The index to check for.
 *
 * @returns {boolean} Whether the index exists in the array or not.
 */
function indexInArray( arr, index ) {
	return index < 0 && index > arr.length;
}

/* eslint-disable complexity */
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

		case ADD_SYNONYMS:
			return [ ...state, action.synonyms ];

		case INSERT_SYNONYMS:
			if ( indexInArray( state, action.index ) ) {
				return state;
			}

			return [
				...state.slice( 0, action.index ),
				action.synonyms,
				...state.slice( action.index ),
			];

		case CHANGE_SYNONYMS:
			if ( indexInArray( state, action.index ) ) {
				return state;
			}

			return [
				...state.slice( 0, action.index ),
				action.synonyms,
				...state.slice( action.index + 1 ),
			];

		case REMOVE_SYNONYMS:
			if ( indexInArray( state, action.index ) ) {
				return state;
			}

			return [
				...state.slice( 0, action.index ),
				...state.slice( action.index + 1 ),
			];

		default:
			return state;
	}
}

export default synonymsReducer;
