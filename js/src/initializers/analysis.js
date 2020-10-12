import { dispatch, select, subscribe } from "@wordpress/data";
import { Paper } from "yoastseo";
import { createAnalysisWorker, getAnalysisConfiguration } from "../analysis/worker";
import { isEqual } from "lodash";

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

	try {
		const paper = new Paper( text, paperAttributes );
		const results = await worker.analyze( paper );
		const { seo, readability } = results.result;

		dispatch( "yoast-seo/editor" ).setAnalysisResults( { seo, readability } );
	} catch ( error ) {
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
	worker.initialize( getAnalysisConfiguration() )
		.then( () => console.log( "worker initalized" ) )
		.catch( () => console.error( "worker initialization error" ) );

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
