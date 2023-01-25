import { actions } from "@yoast/externals/redux";
import { flatten, uniq } from "lodash-es";
import { Paper } from "yoastseo";

/**
 * Requests morphological forms of the focus keyword and makes them ready for the snippet editor.
 *
 * @param {function} runResearch The research function to use.
 * @param {Object} store The store.
 * @param {string} keyword The keyword of the paper.
 *
 * @returns {void}
 */
export default function( runResearch, store, keyword ) {
	runResearch( "morphology", new Paper( "", { keyword } ) ).then( researchResult => {
		const keyphraseForms = researchResult.result.keyphraseForms;
		// Prepare the original array to be used for highlighting in SnippetPreview and dispatch it to the store.
		store.dispatch( actions.updateWordsToHighlight( uniq( flatten( keyphraseForms ) ) ) );
	} ).catch( () => {
		store.dispatch( actions.updateWordsToHighlight( [] ) );
	} );
}
