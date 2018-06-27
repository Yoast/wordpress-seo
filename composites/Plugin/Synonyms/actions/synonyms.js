export const SET_SYNONYMS = "WPSEO_SET_SYNONYMS";

/**
 * An action creator for setting the synonyms.
 *
 * @param {string} synonyms The synonyms.
 *
 * @returns {Object} Action.
 */
export const setSynonyms = function( synonyms ) {
	return {
		type: SET_SYNONYMS,
		tab: synonyms,
	};
};
