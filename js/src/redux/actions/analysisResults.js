export const SET_ANALYSIS_RESULTS = "SET_ANALYSIS_RESULTS";

/**
 * Returns an action that will set the analysis results.
 *
 * @param {Object} results The results of the analysis.
 *
 * @returns {Object} The analysis results action.
 */
export function setAnalysisResults( results ) {
	return {
		type: SET_ANALYSIS_RESULTS,
		payload: results,
	};
}
