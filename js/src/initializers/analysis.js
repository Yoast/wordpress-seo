import { dispatch, select, subscribe } from "@wordpress/data";
import { applyFilters } from "@wordpress/hooks";
import { debounce, isEqual } from "lodash";
import { Paper } from "yoastseo";
import { refreshDelay } from "../analysis/constants";
import handleWorkerError from "../analysis/handleWorkerError";
import { sortResultsByIdentifier } from "../analysis/refreshAnalysis";
import { createAnalysisWorker, getAnalysisConfiguration } from "../analysis/worker";
import { applyModifications } from "../elementor/initializers/pluggable";

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
 * Applies the relevant pluggable modifications to the analysis data.
 *
 * @param {Object} analysisData The analysis data.
 *
 * @returns {Object} The analysis data.
 */
function applyAnalysisModifications( analysisData ) {
	analysisData.title = applyModifications( "data_page_title", analysisData.title );
	analysisData.title = applyModifications( "title", analysisData.title );
	analysisData.description = applyModifications( "data_meta_desc", analysisData.description );
	analysisData.text = applyModifications( "content", analysisData.text );

	return analysisData;
}

/**
 * Returns the analysis data.
 *
 * @returns {Object} The analysis data.
 */
export function collectData() {
	const { getAnalysisData } = select( "yoast-seo/editor" );

	const analysisData = applyAnalysisModifications( getAnalysisData() );

	return applyFilters( "wpseoAnalysisData", analysisData );
}

/**
 * Sets up the analysis.
 *
 * @returns {AnalysisWorkerWrapper} The analysis worker.
 */
export default function initAnalysis() {
	// Get the selectors.
	const {
		getAnalysisData,
		getAnalysisTimestamp,
		isCornerstoneContent,
	} = select( "yoast-seo/editor" );

	// Create and initialize the worker.
	const worker = createAnalysisWorker();
	worker.initialize(
		// Get the analysis configuration and extend it with the is cornerstone content value.
		getAnalysisConfiguration( { useCornerstone: isCornerstoneContent() } )
	).catch( handleWorkerError );

	// Initialize the data for the "is dirty" checks.
	let previousAnalysisData = applyAnalysisModifications( getAnalysisData() );
	let previousIsCornerstone = isCornerstoneContent();
	let previousAnalysisTimestamp = getAnalysisTimestamp();

	/*
	 * Listen to store changes.
	 *
	 * Because the modifications in pluggable are not in the store, they can change without our subscribe triggering.
	 * We offer a "refresh": `dispatch( "yoast-seo/editor" ).runAnalysis`, that stores a timestamp in the store.
	 */
	subscribe( () => {
		// Fetch the current data.
		const currentIsCornerstone = isCornerstoneContent();
		const currentAnalysisData = applyAnalysisModifications( getAnalysisData() );
		const currentAnalysisTimestamp = getAnalysisTimestamp();

		// Keep the is cornerstone content up-to-date. When changed, also update the analysis results.
		if ( currentIsCornerstone !== previousIsCornerstone ) {
			previousIsCornerstone = currentIsCornerstone;
			previousAnalysisData = currentAnalysisData;
			worker.initialize( { useCornerstone: currentIsCornerstone } )
				// Run the analysis again.
				.then( () => debouncedRunAnalysis( worker, currentAnalysisData ) )
				.catch( handleWorkerError );

			// The analysis results are updated with the cornerstone content already. Skip the individual check.
			return;
		}

		// Keep the analysis results up-to-date.
		if ( currentAnalysisTimestamp !== previousAnalysisTimestamp || isEqual( currentAnalysisData, previousAnalysisData ) === false ) {
			previousAnalysisData = currentAnalysisData;
			previousAnalysisTimestamp = currentAnalysisTimestamp;
			debouncedRunAnalysis( worker, currentAnalysisData );
		}
	} );

	return worker;
}
