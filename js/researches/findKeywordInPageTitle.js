/** @module analyses/findKeywordInPageTitle */

var wordMatch = require( "../stringProcessing/matchTextWithWord.js" );

/**
 * Counts the occurrences of the keyword in the pagetitle. Returns the number of matches
 * and the position of the keyword.
 *
 * @param {object} paper The paper containing title and keyword.
 * @returns {object} result with the matches and position.
 */

module.exports = function( paper ) {
	var title = paper.getTitle();
	var keyword = paper.getKeyword();
	var locale = paper.getLocale();
	var result = { matches: 0, position: -1 };
	result.matches = wordMatch( title, keyword, locale );
	result.position = title.toLocaleLowerCase().indexOf( keyword );

	return result;
};
