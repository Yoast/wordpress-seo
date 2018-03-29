import { CLOSE_ALL_SIDEBAR_SECTIONS, OPEN_SIDEBAR_SECTION, CLOSE_SIDEBAR_SECTION } from "../actions/openSidebarSections";

const INITIAL_STATE = [];

/**
 * Helper function: returns an array with the passed item added.
 *
 * @param   {Array}  openSidebarSections The array to which the item should be added.
 * @param   {string} addSection          The item to be added.
 *
 * @returns {Array}                      The array including the item that should be added.
 */
const sidebarSectionOpener = ( openSidebarSections, addSection ) => {
	if ( typeof addSection !== "string" || openSidebarSections.includes( addSection ) ) {
		return openSidebarSections;
	}

	return [
		...openSidebarSections,
		addSection,
	];
};

/**
 * Helper function: returns an array with the passed item removed.
 *
 * @param   {Array}  openSidebarSections The array from which the item should be removed.
 * @param   {string} removeSection       The item to be removed.
 *
 * @returns {Array}                      The array without the item that should be removed.
 */
const sidebarSectionCloser = ( openSidebarSections, removeSection ) => {
	return openSidebarSections.filter( item => item !== removeSection );
};

/**
 * A reducer for adding and removing sections from openSidebarSections.
 *
 * @param {Object} state   The current state, which in this case is openSidebarSections.
 * @param {Object} action  The current action received.
 *
 * @returns {Object}       The new state.
 */
function openSidebarSectionsReducer( state = INITIAL_STATE, action ) {
	switch( action.type ) {
		case OPEN_SIDEBAR_SECTION:
			return sidebarSectionOpener( state, action.addSection );
		case CLOSE_SIDEBAR_SECTION:
			return sidebarSectionCloser( state, action.removeSection );
		case CLOSE_ALL_SIDEBAR_SECTIONS:
			return [];
		default:
			return state;
	}
}

export default openSidebarSectionsReducer;
