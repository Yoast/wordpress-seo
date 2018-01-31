/** @module analyses/getKeywordCount */

const matchWords = require( "../stringProcessing/matchTextWithWord.js" );
const normalizeQuotes = require( "../stringProcessing/quotes.js" ).normalize;

const escapeRegExp = require( "lodash/escapeRegExp" );

/**
 * Calculates the keyword count.
 *
 * @param {object} paper The paper containing keyword and text.
 * @returns {number} The keyword count.
 */
module.exports = function( paper ) {
	const keyword = escapeRegExp( normalizeQuotes( paper.getKeyword() ) );
	const text = normalizeQuotes( paper.getText() );
	const locale = paper.getLocale();
	return matchWords( text, keyword, locale );
};
