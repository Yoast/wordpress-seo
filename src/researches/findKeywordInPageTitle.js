/** @module analyses/findKeywordInPageTitle */

const wordMatch = require( "../stringProcessing/matchTextWithWord.js" );

const escapeRegExp = require( "lodash/escapeRegExp" );

/**
 * Counts the occurrences of the keyword in the pagetitle. Returns the number of matches
 * and the position of the keyword.
 *
 * @param {object} paper The paper containing title and keyword.
 * @returns {object} result with the matches and position.
 */

module.exports = function( paper ) {
	const title = paper.getTitle();
	const keyword = escapeRegExp( paper.getKeyword() );
	const locale = paper.getLocale();
	const result = { matches: 0, position: -1 };
	const wordMatched = wordMatch( title, keyword, locale );
	result.matches = wordMatched.count;
	result.position = wordMatched.position;
	return result;
};
