import { CLOSE_ALL_SIDEBAR_SECTIONS, OPEN_SIDEBAR_SECTION, CLOSE_SIDEBAR_SECTION } from "../actions/openSidebarSections";

const INITIAL_STATE = [];

/**
 * Helper function: returns an array with the requested item removed.
 *
 * @param   {Array}  openSections The array from which the item should be removed.
 * @param   {string} removeItem   The item to be removed.
 *
 * @returns {Array}               The array without the item that should be removed.
 */
let sidebarSectionCloser = ( openSidebarSections, removeSection ) => {
	return openSidebarSections.filter( item => item !== removeSection );
};

let sidebarSectionOpener = ( openSidebarSections, addSection ) => {
	if ( typeof addSection !== "string" || openSidebarSections.includes( addSection ) ) {
		return openSidebarSections;
	}

	return [
		...openSidebarSections,
		addSection,
	];
};

/**
 * A reducer for adding and removing section ids.
 *
 * @param {Object} state The current state of the state managed by the reducer, which in this case is openSections.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The new state, which may be altered or not.
 */
function openSidebarSectionsReducer( state = INITIAL_STATE, action ) {
	switch( action.type ) {
		case OPEN_SIDEBAR_SECTION:
			return sidebarSectionOpener( state, action.sectionId );
		case CLOSE_SIDEBAR_SECTION:
			return sidebarSectionCloser( state, action.sectionId );
		case CLOSE_ALL_SIDEBAR_SECTIONS:
			return [];
		default:
			return state;
	}
}

export default openSidebarSectionsReducer;
