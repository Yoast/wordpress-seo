export const UPDATE_SNIPPET_DATA = "SNIPPET_EDITOR_UPDATE_ANALYSIS_DATA";
export const RUN_ANALYSIS = "RUN_ANALYSIS";

/**
 * Updates the analysis data in redux.
 *
 * @param {Object} data The analysis data, consisting of a title and a description.
 *
 * @returns {Object} An action for redux.
 */
export function updateAnalysisData( data ) {
	return {
		type: UPDATE_SNIPPET_DATA,
		data,
	};
}

/**
 * Refreshes the analysis data timestamp which triggers store subscriptions (including the analysis).
 *
 * @returns {Object} An action to dispatch.
 */
export function runAnalysis() {
	return {
		type: RUN_ANALYSIS,
		timestamp: Date.now(),
	};
}
