export const SET_SYNONYMS = "WPSEO_SET_SYNONYMS";
export const ADD_SYNONYMS = "WPSEO_ADD_SYNONYMS";
export const INSERT_SYNONYMS = "WPSEO_INSERT_SYNONYMS";
export const CHANGE_SYNONYMS = "WPSEO_CHANGE_SYNONYMS";
export const REMOVE_SYNONYMS = "WPSEO_REMOVE_SYNONYMS";

/**
 * An action creator for setting the synonyms.
 *
 * @param {string} synonyms The synonyms.
 *
 * @returns {Object} The action.
 */
export const setSynonyms = function( synonyms ) {
	return {
		type: SET_SYNONYMS,
		synonyms,
	};
};

/**
 * An action creator for adding synonyms.
 *
 * @param {string} synonyms The synonyms to add.
 *
 * @returns {Object} The action.
 */
export const addSynonyms = function( synonyms ) {
	return {
		type: ADD_SYNONYMS,
		synonyms,
	};
};

/**
 * An action creator for insert synonyms at an index.
 *
 * @param {string} index    The index in the array.
 * @param {string} synonyms The synonyms to insert.
 *
 * @returns {Object} The action.
 */
export const insertSynonyms = function( index, synonyms ) {
	return {
		type: INSERT_SYNONYMS,
		index,
		synonyms,
	};
};

/**
 * An action creator for adding synonyms.
 *
 * @param {string} index    The index in the array.
 * @param {string} synonyms The synonyms to add.
 *
 * @returns {Object} The action.
 */
export const changeSynonyms = function( index, synonyms ) {
	return {
		type: CHANGE_SYNONYMS,
		index,
		synonyms,
	};
};

/**
 * An action creator for removing the synonyms at an index.
 *
 * @param {string} index The index in the array.
 *
 * @returns {Object} The action.
 */
export const removeSynonyms = function( index ) {
	return {
		type: REMOVE_SYNONYMS,
		index,
	};
};
