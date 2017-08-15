/*
 * Action types
 */
const prefix = "CONTENT_ANALYSIS_";

export const UPDATE_SEO_RESULT = `${ prefix }UPDATE_SEO_RESULT`;
export const UPDATE_READABILITY_RESULT = `${ prefix }UPDATE_READABILITY_RESULT`;

/*
 * Action creators
 */


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
