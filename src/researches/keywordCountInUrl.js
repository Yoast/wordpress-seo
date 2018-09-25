/** @module researches/countKeywordInUrl */

import findWordFormsInString from "./findKeywordFormsInString.js";


import { escapeRegExp } from "lodash-es";

/**
 * Matches the keyword in the URL. Replaces whitespaces with dashes and uses dash as wordboundary.
 *
 * @param {Paper} paper the Paper object to use in this count.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 *
 * @returns {int} Number of times the keyword is found.
 */
export default function( paper, researcher ) {
	let { keyphraseForms } = researcher.getResearch( "morphology" ).replace( "-" && "'" && "&", "" );
	keyphraseForms = escapeRegExp(keyphraseForms);

	const slug = paper.getUrl().replace( "-", "" );

	const numberOfWords = keyphraseForms.length;

	const matches = findWordFormsInString( keyphraseForms, slug, paper.getLocale() );

	const result =


	return ;
}
