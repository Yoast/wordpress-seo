export const SET_SYNONYMS = "WPSEO_SET_SYNONYMS";
export const SET_KEYWORD_SYNONYMS = "WPSEO_SET_KEYWORD_SYNONYMS";
export const REMOVE_KEYWORD_SYNONYMS = "WPSEO_REMOVE_KEYWORD_SYNONYMS";

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
		synonyms,
	};
};

/**
 * An action creator for adding or changing the synonyms of a keyword.
 *
 * @param {string} keyword  The keyword.
 * @param {string} synonyms The synonyms.
 *
 * @returns {Object} Action.
 */
export const setKeywordSynonyms = function( keyword, synonyms ) {
	return {
		type: SET_KEYWORD_SYNONYMS,
		keyword,
		synonyms,
	};
};

/**
 * An action creator for setting the synonyms.
 *
 * @param {string} keyword The keyword.
 *
 * @returns {Object} Action.
 */
export const removeKeywordSynonyms = function( keyword ) {
	return {
		type: REMOVE_KEYWORD_SYNONYMS,
		keyword,
	};
};
