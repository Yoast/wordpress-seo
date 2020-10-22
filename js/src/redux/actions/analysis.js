import { dispatch, select } from "@wordpress/data";
import { sortResultsByIdentifier } from "../../analysis/refreshAnalysis";

export const UPDATE_SNIPPET_DATA = "SNIPPET_EDITOR_UPDATE_ANALYSIS_DATA";
export const RUN_ANALYSIS = "RUN_ANALYSIS";
export const INITIALIZE_ANALYSIS = "INITIALIZE_ANALYSIS";

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
 * Runs the analysis.
 *
 * @param {Object} data The data to analyze.
 * @param {AnalysisWorkerWrapper} worker The analysis worker.
 *
 * @returns {Generator<Object>} The run analysis action.
 */
export function * runAnalysis( data, worker) {
	const results = yield{ type: RUN_ANALYSIS, data, worker };

	if ( results.error ) {
		return { type: RUN_ANALYSIS, error: results.error };
	}

	const { seo, readability } = results.result;

	if ( seo ) {
		// Only update the main results, which are located under the empty string key.
		const seoResults = seo[ "" ];

		seoResults.results = sortResultsByIdentifier( seoResults.results );

		dispatch( "yoast-seo/editor" ).setSeoResultsForKeyword( data.keyword, seoResults.results );
		dispatch( "yoast-seo/editor" ).setOverallSeoScore( seoResults.score, data.keyword );
	}

	if ( readability ) {
		readability.results = sortResultsByIdentifier( readability.results );

		dispatch( "yoast-seo/editor" ).setReadabilityResults( readability.results );
		dispatch( "yoast-seo/editor" ).setOverallReadabilityScore( readability.score );
	}

	return { type: RUN_ANALYSIS, data };
}

/**
 * Initializes the analysis worker.
 *
 * @returns {Object} The result of the initalization.
 */
export function * initializeAnalysis() {
	yield{ type: INITIALIZE_ANALYSIS };
	return { type: INITIALIZE_ANALYSIS };
}
