import filter from "lodash/filter";
import isArray from "lodash/isArray";
import isString from "lodash/isString";
import uniq from "lodash/uniq";
import without from "lodash/without";

import {
	SET_KEYWORDS,
	ADD_KEYWORD,
	REMOVE_KEYWORD,
} from "../actions/keywords";

const INITIAL_STATE = [];

/**
 * Sets the keywords. Enforces uniqueness. Ignores non-string keywords.
 *
 * @param {Array}  state  State.
 * @param {Object} action Action.
 *
 * @returns {Array} The new state.
 */
function setKeywords( state, action ) {
	if ( ! isArray( action.keywords ) ) {
		return state;
	}

	const keywords = filter( action.keywords, isString );

	return uniq( keywords );
}

/**
 * Add a keyword at an index. Enforces uniqueness. Ignores non-string keywords.
 *
 * @param {Array}  state  State.
 * @param {Object} action Action.
 *
 * @returns {Array} The new state.
 */
function addKeyword( state, action ) {
	if ( ! isString( action.keyword ) ) {
		return state;
	}

	let index = action.index;

	// Adjust index to last position.
	if ( index === -1 || index > state.length - 1 ) {
		index = state.length;
	}

	// Insert the new keyword.
	const keywords = [
		...state.slice( 0, index ),
		action.keyword,
		...state.slice( index ),
	];

	return uniq( keywords );
}

/**
 * A reducer for the active keyword.
 *
 * @param {Object} state  The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Array} State.
 */
function keywordsReducer( state = INITIAL_STATE, action ) {
	switch( action.type ) {
		case SET_KEYWORDS:
			return setKeywords( state, action );
		case ADD_KEYWORD:
			return addKeyword( state, action );
		case REMOVE_KEYWORD:
			return without( state, action.keyword );
		default:
			return state;
	}
}

export default keywordsReducer;
