export const UPDATE_SNIPPET_DATA = "SNIPPET_EDITOR_UPDATE_ANALYSIS_DATA";
export const REFRESH_ANALYSIS_DATA_TIMESTAMP = "REFRESH_ANALYSIS_DATA_TIMESTAMP";

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
 * Refreshes the analysis data timestamp.
 *
 * @returns {Object} An action to dispatch.
 */
export function refreshAnalysisDataTimestamp() {
	return {
		type: REFRESH_ANALYSIS_DATA_TIMESTAMP,
		timestamp: Date.now(),
	};
}
