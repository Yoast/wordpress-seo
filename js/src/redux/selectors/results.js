import get from "lodash/get";

/**
 * Gets the SEO results.
 *
 * @param {Object} state The state.
 * @returns {Object} The SEO results.
 */
export function getSeoResults( state ) {
	return get( state, [ "analysis", "seo" ], {} );
}

/**
 * Gets the active keyword.
 *
 * @param {Object} state The state.
 * @returns {String} The active keyword.
 */
export function getActiveKeyword( state ) {
	return state.activeKeyword;
}

/**
 * Gets the SEO results for a specific keywords.
 *
 * @param {Object} state The state.
 * @param {string} keyword The keyword to get the results for.
 * @returns {Array} The SEO results for the keyword.
 */
export function getResultsForKeyword( state, keyword ) {
	const seoResults = getSeoResults( state );

	return get( seoResults, keyword, [] );
}


