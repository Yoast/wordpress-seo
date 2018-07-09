const PREFIX = "WPSEO_";

export const OPEN_SIDEBAR_SECTION = `${ PREFIX }OPEN_SIDEBAR_SECTION`;
export const CLOSE_SIDEBAR_SECTION = `${ PREFIX }CLOSE_SIDEBAR_SECTION`;
export const CLOSE_ALL_SIDEBAR_SECTIONS = `${ PREFIX }CLOSE_ALL_SIDEBAR_SECTIONS`;

/**
 * An action creator for the action that opens a section.
 *
 * @param {string} sectionId The to be opened section.
 *
 * @returns {Object}         A (WPSEO_)OPEN_SECTION action.
 */
export const openSidebarSection = function( sectionId ) {
	return {
		type: OPEN_SIDEBAR_SECTION,
		sectionId,
	};
};

/**
 * An action creator for the action that closes a section.
 *
 * @param {string} sectionId The to be closed section.
 *
 * @returns {Object}         A (WPSEO_)CLOSE_SECTION action.
 */
export const closeSidebarSection = function( sectionId ) {
	return {
		type: CLOSE_SIDEBAR_SECTION,
		sectionId,
	};
};

/**
 * An action creator for the action that closes all sections.
 *
 * @returns {Object}         A (WPSEO_)CLOSE_ALL_SECTIONS action.
 */
export const closeAllSidebarSections = function() {
	return {
		type: CLOSE_ALL_SIDEBAR_SECTIONS,
	};
};
