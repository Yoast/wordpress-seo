import { dispatch, select, subscribe } from "@wordpress/data";
import { Paper } from "yoastseo";
import { createAnalysisWorker, getAnalysisConfiguration } from "../analysis/worker";
import { sortResultsByIdentifier } from "../analysis/refreshAnalysis";
import { isEqual } from "lodash";
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

/**
 * Sets up the analysis.
 *
 * @returns {void}
 */
const initAnalysis = () => {
	// Create the worker.
	// TODO: get/set the worker URL in the store?
	const worker = createAnalysisWorker();

	// TODO: make the analysis configuration go through the store.
	worker.initialize( getAnalysisConfiguration() );

	let analysisData = select( "yoast-seo/editor" ).getAnalysisData();

	subscribe( () => {
		const currentAnalysisData = select( "yoast-seo/editor" ).getAnalysisData();
		const isDirty = ! isEqual( currentAnalysisData, analysisData );

		if ( isDirty ) {
			analysisData = currentAnalysisData;
			runAnalysis( worker, analysisData );
		}
	} );
};

export default initAnalysis;
