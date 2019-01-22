import { Paper } from "yoastseo";
import { updateKeywordForms } from "../redux/actions/snippetEditor";

/**
 * Gets morphological forms of the focus keyword and makes them ready for yoast-components.
 *
 * @returns {Array}
 */
export function requestKeywordForms( keyword ) {
	YoastSEO.analysis.worker.runResearch( "morphology", new Paper( "", { keyword } ) ).then( result => {
		console.log("!! request keyword forms result: ", result);
		if ( result.hasOwnProperty( "result" ) ) {
			console.log( "!! taking result.result only: ", result.result );
			if ( result.result.hasOwnProperty( "keyphraseForms" ) ) {
				console.log( "!! taking keyphraseforms only: ", result.result.keyphraseForms );
				result = result.result.keyphraseForms;
			} else {
				console.log( "!! Ha, looks like there are no keyphrase forms (1)!" )
				result = [];
			}
		} else {
			console.log("!! Ha, looks like there are no keyphrase forms (2)!")
			result = [];
		}
		YoastSEO.store.dispatch( updateKeywordForms( result ) );
	} );
}
