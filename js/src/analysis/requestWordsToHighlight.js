import { Paper } from "yoastseo";
import { updateWordsToHighlight } from "../redux/actions/snippetEditor";

/**
 * Requests morphological forms of the focus keyword and makes them ready for the snippet editor.
 *
 * @param {function} runResearch The research function to use.
 * @param {Object} store The store.
 * @param {string} keyword The keyword of the paper.
 *
 * @returns {Array} All possible wordform variations of the keyphrase.
 */
export default function( runResearch, store, keyword ) {
	runResearch( "morphology", new Paper( "", { keyword } ) ).then( researchResult => {
		store.dispatch( updateWordsToHighlight( researchResult.result.keyphraseForms ) );
	} ).catch( () => {
		store.dispatch( updateWordsToHighlight( [] ) );
	} );
}
