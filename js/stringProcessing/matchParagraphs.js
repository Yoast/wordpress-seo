var regexMatch = require( "../stringProcessing/matchStringWithRegex.js" );

/**
 * Returns an array with all paragraphs from the text.
 * @param {object} text The text to match paragraph in.
 * @returns {array} the array containing all paragraphs from the text.
 */
module.exports = function( text ) {
	var paragraphs;

	// matches everything between the <p> and </p> tags.
	paragraphs = regexMatch( text, "<p(?:[^>]+)?>(.*?)<\/p>" );
	if ( paragraphs.length > 0 ) {
		return paragraphs;
	}

	/* if no <p> tags found, use a regex that matches [^], not nothing, so any character,
	 including linebreaks untill it finds double linebreaks.
	 */
	paragraphs = text.split( "\n\n" );
	if ( paragraphs.length > 0 ) {
		return paragraphs;
	}
	// if no paragraphs are found, return an array containing the entire text.
	return [ text ];
};
