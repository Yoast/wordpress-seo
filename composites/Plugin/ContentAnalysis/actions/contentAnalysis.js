/*
 * Action types
 */
const prefix = "CONTENT_ANALYSIS_";

export const SET_SEO_RESULTS = `${ prefix }SET_SEO_RESULTS`;
export const SET_SEO_RESULTS_FOR_KEYWORD = `${ prefix }SET_SEO_RESULTS_FOR_KEYWORD`;
export const UPDATE_SEO_RESULT = `${ prefix }UPDATE_SEO_RESULT`;
export const REMOVE_KEYWORD = `${ prefix }REMOVE_KEYWORD`;

export const SET_READABILITY_RESULTS = `${ prefix }SET_READABILITY_RESULTS`;
export const UPDATE_READABILITY_RESULT = `${ prefix }UPDATE_READABILITY_RESULT`;

/*
 * Action creators
 */

/**
 * An action creator for setting the SEO results for a keyword.
 *
 * @param {string} keyword The keyword.
 * @param {Array} results The SEO results for the keyword.
 *
 * @returns {Object} A set SEO results for keyword action.
 */
export function setSeoResultsForKeyword( keyword, results ) {
	return {
		type: SET_SEO_RESULTS_FOR_KEYWORD,
		keyword: keyword,
		results: results,
	};
}

/**
 * An action creator for setting the SEO results.
 *
 * @param {Array} resultsPerKeyword The SEO results per keyword.
 *
 * @returns {Object} A set SEO results action.
 */
export function setSeoResults( resultsPerKeyword ) {
	return {
		type: SET_SEO_RESULTS,
		resultsPerKeyword: resultsPerKeyword,
	};
}

/**
 * An action creator for updating a single SEO result.
 *
 * @param {string} keyword The focus keyword.
 * @param {Object} result The SEO result.
 *
 * @returns {Object} An update SEO result action.
 */
export function updateSeoResult( keyword, result ) {
	return {
		type: UPDATE_SEO_RESULT,
		keyword: keyword,
		result: result,
	};
}

/**
 * An action creator for removing a keyword and its results.
 *
 * @param {string} keyword The focus keyword.
 *
 * @returns {Object} A remove keyword action.
 */
export function removeKeyword( keyword ) {
	return {
		type: REMOVE_KEYWORD,
		keyword: keyword,
	};
}

/**
 * An action creator for setting the readability results.
 *
 * @param {Object} results The readability results.
 *
 * @returns {Object} A set readability results action.
 */
export function setReadabilityResults( results ) {
	return {
		type: SET_READABILITY_RESULTS,
		results: results,
	};
}

/**
 * An action creator for updating a single readability result.
 *
 * @param {Object} result The readability result.
 *
 * @returns {Object} An update readability result action.
 */
export function updateReadabilityResult( result ) {
	return {
		type: UPDATE_READABILITY_RESULT,
		result: result,
	};
}
