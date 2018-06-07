export const UPDATE_SNIPPET_DATA = "SNIPPET_EDITOR_UPDATE_ANALYSIS_DATA";

/**
 * Updates the analysis data in redux.
 *
 * @param {string} data The analysis data.
 *
 * @returns {Object} An action for redux.
 */
export function updateAnalysisData( data ) {
	return {
		type: UPDATE_SNIPPET_DATA,
		data,
	};
}
