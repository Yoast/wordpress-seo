import {
	setOverallReadabilityScore,
	setOverallSeoScore, setReadabilityResults,
	setSeoResultsForKeyword
} from "yoast-components/composites/Plugin/ContentAnalysis/actions/contentAnalysis";

/**
 * Refreshes the analysis.
 *
 * @param {AnalysisWorkerWrapper} analysisWorker The analysis worker to
 *                                               request the analysis from.
 * @param {Object}                store          The store.
 *
 * @returns {void}
 */
export default function refreshAnalysis( analysisWorker, store ) {
	/* START OF TEMPORARY FETCH DATA -- until PR #10609 gets merged. */
	const { YoastSEO } = window;
	const {
		app: { getData, rawData },
	} = YoastSEO;

	// Collect the paper data.
	getData.call( YoastSEO.app );
	const {
		text, keyword, synonyms,
		snippetMeta, snippetTitle,
		url, permalink, snippetCite,
		locale,
	} = rawData;
	/* END OF TEMPORARY FETCH DATA */

	// Request analyses.
	analysisWorker.analyze( {
		text,
		keyword,
		synonyms,
		description: snippetMeta,
		title: snippetTitle,
		url,
		permalink: permalink + snippetCite,
		locale,
	} )
		.then( ( { result: { seo, readability } } ) => {
			if ( seo ) {
				store.dispatch( setSeoResultsForKeyword( keyword, seo.results ) );
				store.dispatch( setOverallSeoScore( seo.score, keyword ) );
			}
			if ( readability ) {
				store.dispatch( setReadabilityResults( readability.results ) );
				store.dispatch( setOverallReadabilityScore( readability.score ) );
			}
		} )
		.catch( error => console.warn( error ) );
}
