const PREFIX = "WPSEO_";

export const OPEN_SECTION = `${ PREFIX }OPEN_SECTION`;
export const CLOSE_SECTION = `${ PREFIX }CLOSE_SECTION`;
export const CLOSE_ALL_SECTIONS = `${ PREFIX }CLOSE_ALL_SECTIONS`;

/**
 * An action creator for the action that opens a section.
 *
 * @param {string} sectionId The id of the to be opened section.
 *
 * @returns {Object}         A (WPSEO_)OPEN_SECTION action.
 */
export const openSection = function( sectionId ) {
	return {
		type: OPEN_SECTION,
		sectionId,
	};
};

/**
 * An action creator for the action that closes a section.
 *
 * @param {string} sectionId The id of the to be closed section.
 *
 * @returns {Object}         A (WPSEO_)CLOSE_SECTION action.
 */
export const closeSection = function( sectionId ) {
	return {
		type: CLOSE_SECTION,
		sectionId,
	};
};

/**
 * An action creator for the action that closes all sections.
 *
 * @returns {Object}         A (WPSEO_)CLOSE_ALL_SECTIONS action.
 */
export const closeAllSections = function() {
	return {
		type: CLOSE_ALL_SECTIONS,
	};
};