import { Paper } from "yoastseo";
import {
	setOverallReadabilityScore,
	setOverallSeoScore, setReadabilityResults,
	setSeoResultsForKeyword,
} from "yoast-components/composites/Plugin/ContentAnalysis/actions/contentAnalysis";

/**
 * Refreshes the analysis.
 *
 * @param {AnalysisWorkerWrapper} analysisWorker      The analysis worker to
 *                                                    request the analysis from.
 * @param {Function}              collectAnalysisData Function that collects the
 *                                                    analysis data.
 * @param {Function}              applyMarks          Function that applies the
 *                                                    marks in the content.
 * @param {Object}                store               The store.
 *
 * @returns {void}
 */
export default function refreshAnalysis( analysisWorker, collectAnalysisData, applyMarks, store ) {
	const data = collectAnalysisData();
	const paper = Paper.parse( data );

	analysisWorker.analyze( data )
		.then( ( { result: { seo, readability } } ) => {
			if ( seo ) {
				// Only update the main results, which are located under the empty string key.
				const seoResults = seo[ "" ];

				// Recreate the getMarker function after the worker is done.
				seoResults.results.forEach( result => {
					result.getMarker = () => () => applyMarks( paper, result.marks );
				} );

				store.dispatch( setSeoResultsForKeyword( data.keyword, seoResults.results ) );
				store.dispatch( setOverallSeoScore( seoResults.score, data.keyword ) );
			}
			if ( readability ) {
				// Recreate the getMarker function after the worker is done.
				readability.results.forEach( result => {
					result.getMarker = () => () => applyMarks( paper, result.marks );
				} );

				store.dispatch( setReadabilityResults( readability.results ) );
				store.dispatch( setOverallReadabilityScore( readability.score ) );
			}
		} )
		.catch( error => console.warn( error ) );
}
