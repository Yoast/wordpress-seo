/** @module analyses/findKeywordInFirstParagraph */

var regexMatch = require( "../stringProcessing/matchStringWithRegex.js" );
var wordMatch = require( "../stringProcessing/matchTextWithWord.js" );

/**
 * Counts the occurrences of the keyword in the first paragraph, returns 0 if it is not found,
 * if there is no paragraph tag or 0 hits, it checks for 2 newlines, otherwise returns the keyword
 * count of the complete text.
 *
 * @param {Paper} paper The text to check for paragraphs.
 * @returns {number} The number of occurences of the keyword in the first paragraph.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var keyword = paper.getKeyword();
	var paragraph;

	// matches everything between the <p> and </p> tags.
	paragraph = regexMatch( text, "<p(?:[^>]+)?>(.*?)<\/p>" );
	if ( paragraph.length > 0 ) {
		return wordMatch( paragraph[0], keyword );
	}

	/* if no <p> tags found, use a regex that matches [^], not nothing, so any character,
	including linebreaks untill it finds double linebreaks.
	*/
	paragraph = regexMatch( text, "[^]*?\n\n" );
	if ( paragraph.length > 0 ) {
		return wordMatch( paragraph[0], keyword );
	}

	// if no double linebreaks found, return the keyword count of the entire text
	return wordMatch( text, keyword );
};
