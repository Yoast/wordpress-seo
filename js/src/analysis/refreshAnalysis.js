import {
	setOverallReadabilityScore,
	setOverallSeoScore, setReadabilityResults,
	setSeoResultsForKeyword,
} from "yoast-components/composites/Plugin/ContentAnalysis/actions/contentAnalysis";
import { Paper } from "yoastseo";

import getAnalysisData from "./getAnalysisData";
import getMarker from "./getMarker";

let initialized = false;

export function initializationDone( edit, analysisWorker, store, customAnalysisDAta, pluggable ) {
	initialized = true;

	refreshAnalysis( edit, analysisWorker, store, customAnalysisDAta, pluggable );
}

/**
 * Recreates the getMarker function for the assessment result.
 *
 * @param {AssessmentResult}    result  The assessment result for which to recreate the getMarker function.
 * @param {Object}              store   The store.
 * @param {Object}              data    The paper data used for the analyses.
 *
 * @returns {void}
 */
const recreateGetMarkerFunction = function( result, store, data ) {
	const { marksButtonStatus } = store.getState();
	const showMarkers = marksButtonStatus === "enabled";
	result.getMarker = () => {
		return () => {
			const marker = getMarker( showMarkers );
			marker( Paper.parse( data ), result.marks );
		};
	};
};

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

	if ( ! initialized ) {
		return;
	}

	// Request analyses.
	analysisWorker.analyze( data )
		.then( ( { result: { seo, readability } } ) => {
			if ( seo ) {
				// Recreate the getMarker function after the worker is done.
				seo.results.map ( function( result ) {
					recreateGetMarkerFunction( result, store, data );
				}
			);
				store.dispatch( setSeoResultsForKeyword( data.keyword, seo.results ) );
				store.dispatch( setOverallSeoScore( seo.score, data.keyword ) );
			}
			if ( readability ) {
				readability.results.map( function( result ) {
					recreateGetMarkerFunction( result, store, data );
				}
			);
				store.dispatch( setReadabilityResults( readability.results ) );
				store.dispatch( setOverallReadabilityScore( readability.score ) );
			}
		} )
		.catch( error => console.warn( error ) );
}
