/** @module analyses/findKeywordInPageTitle */

const normalizeQuotes = require( "../stringProcessing/quotes.js" ).normalize;
const wordMatch = require( "../stringProcessing/matchTextWithWord" );

import { escapeRegExp } from "lodash-es";

/**
 * Counts the occurrences of the keyword in the pagetitle. Returns the number of matches
 * and the position of the keyword.
 *
 * @param {object} paper The paper containing title and keyword.
 * @returns {object} result with the matches and position.
 */

module.exports = function( paper ) {
	const title = normalizeQuotes( paper.getTitle() );
	const keyword = escapeRegExp( normalizeQuotes( paper.getKeyword() ).toLocaleLowerCase() );
	const locale = paper.getLocale();
	const result = { matches: 0, position: -1 };
	result.matches = wordMatch( title, keyword, locale ).count;
	result.position = title.toLocaleLowerCase().indexOf( keyword );

	return result;
};
