/** @module researches/countKeywordInUrl */

import findWordFormsInString from "./findKeywordFormsInString.js";


// import { escapeRegExp } from "lodash-es";

/**
 * Matches the keyword in the URL. Replaces whitespaces with dashes and uses dash as wordboundary.
 *
 * @param {Paper} paper the Paper object to use in this count.
 * @returns {int} Number of times the keyword is found.
 */
export default function( paper, researcher ) {
	const { keyphraseForms } = researcher.getResearch( "morphology" ).replace( "'" && "-", "" );
	// keyphraseForms = escapeRegExp( keyphraseForms );

	const slug = paper.getUrl().replace( "-", "" );
	// create array??
	const numberOfContentWords = keyphraseForms.length;
	// I want this to count number of content words, not number of all forms

	const matches = findWordFormsInString( keyphraseForms, slug, paper.getLocale() );
	let score = "ok";

	if ( numberOfContentWords === 1 || numberOfContentWords === 2 ) {
		if ( matches.percentWordMatches === 100 ) {
			score = "good";
		} else {
			score = "ok";
		}
	}

	if ( numberOfContentWords > 2 ) {
		if ( matches.percentWordMatches > 50 ) {
			score = "good";
		} else {
			score = "ok";
		}
	}

	return score;
}
