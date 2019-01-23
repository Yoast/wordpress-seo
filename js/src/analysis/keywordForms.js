import { Paper } from "yoastseo";
import { updateKeywordForms } from "../redux/actions/snippetEditor";

/**
 * Gets morphological forms of the focus keyword and makes them ready for yoast-components.
 *
 * @returns {Array}
 */
export function requestKeywordForms( keyword ) {
	YoastSEO.analysis.worker.runResearch( "morphology", new Paper( "", { keyword } ) ).then( result => {
		if ( result.hasOwnProperty( "result" ) ) {
			if ( result.result.hasOwnProperty( "keyphraseForms" ) ) {
				YoastSEO.store.dispatch( updateKeywordForms( result.result.keyphraseForms ) );
			}
		}
	} );
}
