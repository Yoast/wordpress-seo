import get from "lodash/get";

/**
 * Gets the SEO results.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} The SEO results for all keywords.
 */
export function getSeoResults( state ) {
	return get( state, [ "analysis", "seo" ], {} );
}

/**
 * Gets the SEO results for a specific keywords.
 *
 * @param {Object} state The state.
 * @param {string} keyword The keyword to get the results for.
 *
 * @returns {Array} The SEO results for the keyword.
 */
export function getResultsForKeyword( state, keyword ) {
	const seoResults = getSeoResults( state );

	return get( seoResults, keyword, [] );
}

/**
 * Gets the readability results for the focus keyword.
 *
 * @param {object} state The state.
 *
 * @returns {object} The results and score for the readability analysis.
 */
export function getReadabilityResults( state ) {
	return get( state, [ "analysis", "readability" ] );
}

/**
 * Gets the SEO results for the focus keyword.
 *
 * @param {object} state The state.
 *
 * @returns {object} The SEO results and overall score for the focus keyword.
 */
export function getResultsForFocusKeyword( state ) {
	return getResultsForKeyword( state, state.focusKeyword );
}

/**
 * Get a result by id from both the focus keyword and readability analysis.
 *
 * @param {object} state The state.
 * @param {string} id    The assessment's identifier.
 *
 * @returns {Object|null} The assessment result.
 */
export function getResultById( state, id ) {
	const allResults = [
		...getResultsForFocusKeyword( state ).results,
		...getReadabilityResults( state ).results,
	];

	return allResults.find( result => result._identifier === id );
}

/**
 * Returns the marks button status.
 *
 * @param {object} state The state.
 *
 * @returns {string} The status of the mark buttons.
 */
export function getMarkButtonStatus( state ) {
	return state.marksButtonStatus;
}

