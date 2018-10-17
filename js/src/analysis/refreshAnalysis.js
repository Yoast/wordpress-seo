import {
	setOverallReadabilityScore,
	setOverallSeoScore,
	setReadabilityResults,
	setSeoResultsForKeyword,
	setKeyphraseNotice,
} from "yoast-components/composites/Plugin/ContentAnalysis/actions/contentAnalysis";
import { refreshSnippetEditor } from "../redux/actions/snippetEditor";

let isInitialized = false;

/**
 * Sorts analysis results alphabetically by their identifier.
 *
 * @param {Array} results The SEO or Readability analysis results to be sorted.
 *
 * @returns {Array} The sorted results.
 */
export function sortResultsByIdentifier( results ) {
	return results.sort( ( a, b ) => a._identifier.localeCompare( b._identifier ) );
}

/**
 * Refreshes the analysis.
 *
 * @param {AnalysisWorkerWrapper}               worker        The analysis worker to request the analysis from.
 * @param {Function}                            collectData   Function that collects the analysis data.
 * @param {Function}                            applyMarks    Function that applies the marks in the content.
 * @param {Object}                              store         The store.
 * @param {PostDataCollector|TermDataCollector} dataCollector The data collector to update the score of the results.
 *
 * @returns {void}
 */
export default function refreshAnalysis( worker, collectData, applyMarks, store, dataCollector ) {
	const paper = collectData();

	if ( ! isInitialized ) {
		return;
	}

	worker.analyze( paper )
		.then( ( { result: { seo, readability } } ) => {
			if ( seo ) {
				// Only update the main results, which are located under the empty string key.
				const seoResults = seo[ "" ];

				// Recreate the getMarker function after the worker is done.
				seoResults.results.forEach( result => {
					result.getMarker = () => () => applyMarks( paper, result.marks );
				} );

				seoResults.results = sortResultsByIdentifier( seoResults.results );

				store.dispatch( setSeoResultsForKeyword( paper.getKeyword(), seoResults.results ) );
				store.dispatch( setOverallSeoScore( seoResults.score, paper.getKeyword() ) );
				store.dispatch( setKeyphraseNotice( paper.getKeyword(), seoResults.keyphraseNotice ) );
				store.dispatch( refreshSnippetEditor() );

				dataCollector.saveScores( seoResults.score, paper.getKeyword() );
			}

			if ( readability ) {
				// Recreate the getMarker function after the worker is done.
				readability.results.forEach( result => {
					result.getMarker = () => () => applyMarks( paper, result.marks );
				} );

				readability.results = sortResultsByIdentifier( readability.results );

				store.dispatch( setReadabilityResults( readability.results ) );
				store.dispatch( setOverallReadabilityScore( readability.score ) );
				store.dispatch( refreshSnippetEditor() );

				dataCollector.saveContentScore( readability.score );
			}
		} )
		.catch( error => console.warn( error ) );
}

/**
 * Sets isInitialized to true.
 *
 * @returns {void}
 */
export function initializationDone() {
	isInitialized = true;
}
