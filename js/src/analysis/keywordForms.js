import { Paper } from "yoastseo";
import { updateKeywordForms } from "../redux/actions/snippetEditor";

/**
 * Gets morphological forms of the focus keyword and makes them ready for yoast-components.
 *
 * @param {AnalysisWorkerWrapper} worker The analysis worker to request the analysis from.
 * @param {Object} store The store.
 * @param {string} keyword The keyword of the paper
 *
 * @returns {Array} All possible wordform variations of the keyphrase
 */
export function requestKeywordForms( worker, store, keyword ) {
	worker.runResearch( "morphology", new Paper( "", { keyword } ) ).then( result => {
		if ( result.hasOwnProperty( "result" ) ) {
			if ( result.result.hasOwnProperty( "keyphraseForms" ) ) {
				store.dispatch( updateKeywordForms( result.result.keyphraseForms ) );
			}
		}
	} );
}
