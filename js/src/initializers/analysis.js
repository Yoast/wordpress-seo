import { dispatch, select, subscribe } from "@wordpress/data";
import { Paper } from "yoastseo";
import { refreshDelay } from "../analysis/constants";
import { createAnalysisWorker, getAnalysisConfiguration } from "../analysis/worker";
import { sortResultsByIdentifier } from "../analysis/refreshAnalysis";
import { debounce, isEqual } from "lodash";
import handleWorkerError from "../analysis/handleWorkerError";

/**
 * Runs the analysis.
 *
 * @param {AnalysisWorkerWrapper} worker The analysis worker.
 * @param {Object} data The data to analyze.
 *
 * @returns {void}
 */
async function runAnalysis( worker, data ) {
	const { text, ...paperAttributes } = data;
	const paper = new Paper( text, paperAttributes );

	try {
		const results = await worker.analyze( paper );
		const { seo, readability } = results.result;

		if ( seo ) {
			// Only update the main results, which are located under the empty string key.
			const seoResults = seo[ "" ];

			seoResults.results = sortResultsByIdentifier( seoResults.results );

			dispatch( "yoast-seo/editor" ).setSeoResultsForKeyword( paper.getKeyword(), seoResults.results );
			dispatch( "yoast-seo/editor" ).setOverallSeoScore( seoResults.score, paper.getKeyword() );
		}

		if ( readability ) {
			readability.results = sortResultsByIdentifier( readability.results );

			dispatch( "yoast-seo/editor" ).setReadabilityResults( readability.results );
			dispatch( "yoast-seo/editor" ).setOverallReadabilityScore( readability.score );
		}
	} catch ( error ) {
		handleWorkerError();
		console.error( "An error occurred in the analysis.", error );
	}
}

// Create a debounced version that runs the analysis in order to avoid spamming the worker while typing.
const debouncedRunAnalysis = debounce( runAnalysis, refreshDelay );

/**
 * Sets up the analysis.
 *
 * @returns {void}
 */
const initAnalysis = () => {
	// Create and initialize the worker.
	const worker = createAnalysisWorker();
	worker.initialize( getAnalysisConfiguration() );

	// Initialize the analysis data for the dirty check.
	let previousAnalysisData = select( "yoast-seo/editor" ).getAnalysisData();

	// Listen to the store changes to keep our analysis up-to-date.
	subscribe( () => {
		const currentAnalysisData = select( "yoast-seo/editor" ).getAnalysisData();
		const isDirty = ! isEqual( currentAnalysisData, previousAnalysisData );

		if ( isDirty ) {
			previousAnalysisData = currentAnalysisData;
			debouncedRunAnalysis( worker, previousAnalysisData );
		}
	} );
};

export default initAnalysis;
