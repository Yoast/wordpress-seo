/** @module researches/countKeywordInUrl */

var wordMatch = require( "../stringProcessing/matchTextWithWord.js" );
import { escapeRegExp } from "lodash-es";

/**
 * Matches the keyword in the URL. Replaces whitespaces with dashes and uses dash as wordboundary.
 *
 * @param {Paper} paper the Paper object to use in this count.
 * @returns {int} Number of times the keyword is found.
 */
module.exports = function( paper, researcher ) {
	const { keyphraseForms } = researcher.getResearch( "morphology" );

	let keyword = paper.getKeyword().replace( "'", "" ).replace( /\s/ig, "-" );
	keyword = escapeRegExp( keyword );

	return wordMatch( paper.getUrl(), keyword, paper.getLocale() ).count;
};
