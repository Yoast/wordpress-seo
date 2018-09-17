/** @module researches/countKeywordInUrl */

import findWordFormsInString from "./findKeywordFormsInString.js";


import { escapeRegExp } from "lodash-es";

/**
 * Matches the keyword in the URL. Replaces whitespaces with dashes and uses dash as wordboundary.
 *
 * @param {Paper} paper the Paper object to use in this count.
 * @returns {int} Number of times the keyword is found.
 */
export default function( paper, researcher ) {
	const { keyphraseForms } = researcher.getResearch( "morphology" );
	const keyphraseForms = keyphraseForms.replace( "'", "" );
	//??keyword = escapeRegExp( keyword );
	const slug = paper.getUrl() // strip of dashes and create array
	const numberOfContentWords = keyphraseForms.length;
	//I want this to count number of content words, not number of all forms

	const matches = findWordFormsInString( keyphraseForms, slug, paper.getLocale() );

	if (numberOfContentWords === 1) {

	}
}

// put outcome in a variable, then return it

/**if (numberContentWords === 1) {
	keyphraseForms.
}