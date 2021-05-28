import { get, isEmpty } from "lodash";

/**
 * Gets the SEO results.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} The SEO results for all keywords.
 */
export function getSeoResults( state ) {
	const results = get( state, "analysis.seo", {} );

	return isEmpty( results ) ? { results: [], overallScore: null } : results;
}

/**
 * Gets the SEO results for a specific keywords.
 *
 * @param {Object} state The state.
 * @param {string} keyword The keyword to get the results for.
 *
 * @returns {object} The results and overall score for the SEO analysis.
 */
export function getResultsForKeyword( state, keyword ) {
	const seoResults = getSeoResults( state );

	return get( seoResults, keyword, {} );
}

/**
 * Gets the readability results for the focus keyword.
 *
 * @param {object} state The state.
 *
 * @returns {object} The results and overall score for the readability analysis.
 */
export function getReadabilityResults( state ) {
	const results = get( state, "analysis.readability", {} );

	return isEmpty( results ) ? { results: [], overallScore: null } : results;
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
	const focusKeywordResults = getResultsForFocusKeyword( state ).results || [];
	const readabilityResults = getReadabilityResults( state ).results || [];

	const allResults = [
		...focusKeywordResults,
		...readabilityResults,
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
