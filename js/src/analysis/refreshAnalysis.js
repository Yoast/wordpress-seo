import { Paper } from "yoastseo";
import {
	setOverallReadabilityScore,
	setOverallSeoScore,
	setReadabilityResults,
	setSeoResultsForKeyword,
} from "yoast-components/composites/Plugin/ContentAnalysis/actions/contentAnalysis";
import { refreshSnippetEditor } from "../redux/actions/snippetEditor";

/**
 * Refreshes the analysis.
 *
 * @param {AnalysisWorkerWrapper}               worker        The analysis
 *                                                            worker to request
 *                                                            the analysis from.
 * @param {Function}                            collectData   Function that
 *                                                            collects the
 *                                                            analysis data.
 * @param {Function}                            applyMarks    Function that
 *                                                            applies the marks
 *                                                            in the content.
 * @param {Object}                              store         The store.
 * @param {PostDataCollector|TermDataCollector} dataCollector The data collector
 *                                                            to update the
 *                                                            score of the
 *                                                            results.
 *
 * @returns {void}
 */
export default function refreshAnalysis( worker, collectData, applyMarks, store, dataCollector ) {
	const data = collectData();
	const paper = Paper.parse( data );

	worker.analyze( data )
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
				store.dispatch( refreshSnippetEditor() );

				dataCollector.saveScores( seoResults.score );
			}
			if ( readability ) {
				// Recreate the getMarker function after the worker is done.
				readability.results.forEach( result => {
					result.getMarker = () => () => applyMarks( paper, result.marks );
				} );

				store.dispatch( setReadabilityResults( readability.results ) );
				store.dispatch( setOverallReadabilityScore( readability.score ) );
				store.dispatch( refreshSnippetEditor() );

				dataCollector.saveContentScore( readability.score );
			}
		} )
		.catch( error => console.warn( error ) );
}
