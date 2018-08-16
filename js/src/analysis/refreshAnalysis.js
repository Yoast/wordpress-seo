import {
	setOverallReadabilityScore,
	setOverallSeoScore, setReadabilityResults,
	setSeoResultsForKeyword,
} from "yoast-components/composites/Plugin/ContentAnalysis/actions/contentAnalysis";
import { Paper } from "yoastseo";

import getAnalysisData from "./getAnalysisData";
import getMarker from "./getMarker";

/**
 * Refreshes the analysis.
 *
 * @param {Edit}                  edit               The edit instance.
 * @param {AnalysisWorkerWrapper} analysisWorker     The analysis worker to
 *                                                   request the analysis from.
 * @param {Object}                store              The store.
 * @param {CustomAnalysisData}    customAnalysisData The custom analysis data.
 * @param {Pluggable}             pluggable          The Pluggable.
 *
 * @returns {void}
 */
export default function refreshAnalysis( edit, analysisWorker, store, customAnalysisData, pluggable ) {
	const data = getAnalysisData( edit, store, customAnalysisData, pluggable );

	// Request analyses.
	analysisWorker.analyze( data )
		.then( ( { result: { seo, readability } } ) => {
			if ( seo ) {
				// Recreate the getMarker function after the worker is done.
				seo.results.map( function( result ) {
					result.getMarker = () => {
						const { marksButtonStatus } = store.getState();
						const showMarkers = marksButtonStatus === "enabled";
						return () => {
							const marker = getMarker( showMarkers );
							marker( Paper.parse( data ), result.marks );
						};
					};
				}
			);
				store.dispatch( setSeoResultsForKeyword( data.keyword, seo.results ) );
				store.dispatch( setOverallSeoScore( seo.score, data.keyword ) );
			}
			if ( readability ) {
				readability.results.map( function( result ) {
					result.getMarker = () => {
						const { marksButtonStatus } = store.getState();
						const showMarkers = marksButtonStatus === "enabled";
						return () => {
							const marker = getMarker( showMarkers );
							marker( Paper.parse( data ), result.marks );
						};
					};
				}
			);
				store.dispatch( setReadabilityResults( readability.results ) );
				store.dispatch( setOverallReadabilityScore( readability.score ) );
			}
		} )
		.catch( error => console.warn( error ) );
}
