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
	// Get the selectors.
	const {
		getAnalysisData,
		isCornerstoneContent,
	} = select( "yoast-seo/editor" );

	// Create and initialize the worker.
	const worker = createAnalysisWorker();
	worker.initialize(
		// Get the analysis configuration and extend it with the is cornerstone content value.
		getAnalysisConfiguration( { useCornerstone: isCornerstoneContent() } )
	).catch( handleWorkerError );

	// Initialize the data for the "is dirty" checks.
	let previousAnalysisData = getAnalysisData();
	let previousIsCornerstone = isCornerstoneContent();

	// Listen to store changes.
	subscribe( () => {
		// Fetch the current data.
		const currentIsCornerstone = isCornerstoneContent();
		const currentAnalysisData = getAnalysisData();

		// Keep the is cornerstone content up-to-date. When changed, also update the analysis results.
		if ( currentIsCornerstone !== previousIsCornerstone ) {
			previousIsCornerstone = currentIsCornerstone;
			previousAnalysisData = currentAnalysisData;
			worker.initialize( { useCornerstone: currentIsCornerstone } )
				// Run the analysis again.
				.then( () => debouncedRunAnalysis( worker, currentAnalysisData ) )
				.catch( handleWorkerError );
		}

		// Keep the analysis results up-to-date.
		if ( isEqual( currentAnalysisData, previousAnalysisData ) === false ) {
			previousAnalysisData = currentAnalysisData;
			debouncedRunAnalysis( worker, currentAnalysisData );
		}
	} );
};

export default initAnalysis;
