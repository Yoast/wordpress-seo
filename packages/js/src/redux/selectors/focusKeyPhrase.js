import { applyFilters } from "@wordpress/hooks";
import { get, isArray, isString } from "lodash";

/**
 * Gets the focus keyphrase.
 *
 * @param {Object} state    The state.
 *
 * @returns {string} Focus keyphrase.
 */
export function getFocusKeyphrase( state ) {
	return get( state, "focusKeyword", "" );
}

/**
 * Gets extra focus keyphrase errors.
 * @param {Object} state The state.
 * @returns {string[]} The errors.
 */
export const getFocusKeyphraseErrors = state => {
	const errors = applyFilters( "yoast.focusKeyphrase.errors", [], getFocusKeyphrase( state ) );
	return isArray( errors ) ? errors.filter( isString ) : [];
};
