import { CLOSE_ALL_SECTIONS, OPEN_SECTION } from "../actions/openSections";
import { CLOSE_SECTION } from "../actions/openSections";

const INITIAL_STATE = [];

/**
 * Helper function: returns an array with the requested item removed.
 *
 * @param   {Array}   array       The array from which the item should be removed.
 * @param   {string}  removeItem  The item to be removed.
 *
 * @returns {Array}               The array without the item that should be removed.
 */
let removeItemFromArray = ( array, removeItem ) => {
	return array.filter( item => item !== removeItem );
};

/**
 * A reducer for adding and removing section ids.
 *
 * @param {Object} state The current state of the state managed by the reducer.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The new state, which may be altered or not.
 */
function openSectionsReducer( state = INITIAL_STATE, action ) {
	switch( action.type ) {
		case OPEN_SECTION:
			console.log( action.sectionId );
			return [
				...state,
				action.sectionId
			];
		case CLOSE_SECTION:
			return removeItemFromArray( state, action.sectionId );
		case CLOSE_ALL_SECTIONS:
			return [];
		default:
			return state;
	}
}

export default openSectionsReducer;
