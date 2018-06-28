/** @module analyses/findKeywordInFirstParagraph */

const matchParagraphs = require( "../stringProcessing/matchParagraphs.js" );
const wordMatch = require( "../stringProcessing/matchTextWithWord.js" );

const escapeRegExp = require( "lodash/escapeRegExp" );
const reject = require( "lodash/reject" );
const isEmpty = require( "lodash/isEmpty" );

/**
 * Counts the occurrences of the keyword in the first paragraph, returns 0 if it is not found,
 * if there is no paragraph tag or 0 hits, it checks for 2 newlines, otherwise returns the keyword
 * count of the complete text.
 *
 * @param {Paper} paper The text to check for paragraphs.
 * @returns {number} The number of occurrences of the keyword in the first paragraph.
 */
module.exports = function( paper ) {
	const paragraphs = matchParagraphs( paper.getText() );
	const keyword = escapeRegExp( paper.getKeyword().toLocaleLowerCase() );
	const paragraph = reject( paragraphs, isEmpty )[ 0 ] || "";
	return wordMatch( paragraph, keyword, paper.getLocale() );
};
