import { Paper } from "yoastseo";
import { updateKeywordForms } from "../redux/actions/snippetEditor";

/**
 * Gets morphological forms of the focus keyword and makes them ready for yoast-components.
 *
 * @param {function} runResearch The research function to use.
 * @param {Object} store The store.
 * @param {string} keyword The keyword of the paper
 *
 * @returns {Array} All possible wordform variations of the keyphrase
 */
export function requestKeywordForms( runResearch, store, keyword ) {
	runResearch( "morphology", new Paper( "", { keyword } ) ).then( researchResult => {
		store.dispatch( updateKeywordForms( researchResult.result.keyphraseForms ) );
	} ).catch( () => {
		store.dispatch( updateKeywordForms( [] ) );
	} );
}
