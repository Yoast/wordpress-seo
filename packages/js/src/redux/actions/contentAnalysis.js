import AnalysisFields from "../../helpers/fields/AnalysisFields";

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

export const SET_INCLUSIVE_LANGUAGE_RESULTS = `${ prefix }SET_INCLUSIVE_LANGUAGE_RESULTS`;
export const UPDATE_INCLUSIVE_LANGUAGE_RESULT = `${ prefix }UPDATE_INCLUSIVE_LANGUAGE_RESULT`;

export const SET_OVERALL_READABILITY_SCORE = `${ prefix }SET_OVERALL_READABILITY_SCORE`;
export const SET_OVERALL_SEO_SCORE = `${ prefix }SET_OVERALL_SEO_SCORE`;
export const SET_OVERALL_INCLUSIVE_LANGUAGE_SCORE = `${ prefix }SET_OVERALL_INCLUSIVE_LANGUAGE_SCORE`;

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

/**
 * An action creator for setting the inclusive language results.
 *
 * @param {Object} results The inclusive language results.
 *
 * @returns {Object} A set inclusive language results action.
 */
export function setInclusiveLanguageResults( results ) {
	return {
		type: SET_INCLUSIVE_LANGUAGE_RESULTS,
		results: results,
	};
}

/**
 * An action creator for updating a single inclusive language result.
 *
 * @param {Object} result The inclusive language result.
 *
 * @returns {Object} An update inclusive language result action.
 */
export function updateInclusiveLanguageResult( result ) {
	return {
		type: UPDATE_INCLUSIVE_LANGUAGE_RESULT,
		result: result,
	};
}

/**
 * An action creator for setting the overall score for a readability result.
 *
 * @param {string|number} overallScore The overall score.
 *
 * @returns {Object} A set overall score action.
 */
export function setOverallReadabilityScore( overallScore ) {
	AnalysisFields.readabilityScore = overallScore;
	return {
		type: SET_OVERALL_READABILITY_SCORE,
		overallScore: overallScore,
	};
}

/**
 * An action creator for setting the overall score result.
 *
 * @param {string|number} overallScore The overall score.
 * @param {Object} keyword The keyword the overall score is for.
 *
 * @returns {Object} A set overall score action.
 */
export function setOverallSeoScore( overallScore, keyword ) {
	AnalysisFields.seoScore = overallScore;
	return {
		type: SET_OVERALL_SEO_SCORE,
		keyword: keyword,
		overallScore: overallScore,
	};
}

/**
 * An action creator for setting the overall score for an inclusive language result.
 *
 * @param {string|number} overallScore The overall score.
 *
 * @returns {Object} A set overall score action.
 */
export function setOverallInclusiveLanguageScore( overallScore ) {
	AnalysisFields.inclusiveLanguageScore = overallScore;
	return {
		type: SET_OVERALL_INCLUSIVE_LANGUAGE_SCORE,
		overallScore: overallScore,
	};
}
