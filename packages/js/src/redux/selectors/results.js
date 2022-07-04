import { get, isEmpty } from "lodash";

const emptyObject = {};
const emptyArray  = [];

/**
 * Gets the SEO results.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} The SEO results for all keywords.
 */
export function getSeoResults( state ) {
	const results = get( state, "analysis.seo", emptyObject );

	return isEmpty( results ) ? { results: emptyArray, overallScore: null } : results;
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

	return get( seoResults, keyword, emptyObject );
}

/**
 * Gets the readability results.
 *
 * @param {object} state The state.
 *
 * @returns {object} The results and overall score for the readability analysis.
 */
export function getReadabilityResults( state ) {
	const results = get( state, "analysis.readability", {} );

	return isEmpty( results ) ? { results: emptyArray, overallScore: null } : results;
}

/**
 * Gets the inclusive language results.
 *
 * @param {object} state The state.
 *
 * @returns {object} The results and overall score for the inclusive language analysis.
 */
export function getInclusiveLanguageResults( state ) {
	const results = get( state, "analysis.inclusiveLanguage", {} );

	return isEmpty( results ) ? { results: emptyArray, overallScore: null } : results;
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
	const focusKeywordResults = getResultsForFocusKeyword( state ).results || emptyArray;
	const readabilityResults = getReadabilityResults( state ).results || emptyArray;
	const inclusiveLanguageResults = getInclusiveLanguageResults( state ).results || emptyArray;

	const allResults = [
		...focusKeywordResults,
		...readabilityResults,
		...inclusiveLanguageResults,
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
