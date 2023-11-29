export const UPDATE_SNIPPET_DATA = "SNIPPET_EDITOR_UPDATE_ANALYSIS_DATA";
export const RUN_ANALYSIS = "RUN_ANALYSIS";
export const UPDATE_SHORTCODES_FOR_PARSING = "UPDATE_SHORTCODES_FOR_PARSING";

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

/**
 * Updates the list of shortcodes for parsing.
 *
 * @param {Array} shortcodes The list of shortcodes for parsing.
 *
 * @returns {Object} An action to dispatch.
 */
export function updateShortcodesForParsing( shortcodes ) {
	return {
		type: UPDATE_SHORTCODES_FOR_PARSING,
		shortcodesForParsing: shortcodes,
	};
}
