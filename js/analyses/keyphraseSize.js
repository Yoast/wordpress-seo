var sanitizeString = require( "../stringProcessing/sanitizeString.js" );

/**
 * Checks the number of words in the keyphrase
 *
 * @param {String} text The keyphrase to count words in.
 * @returns {int} The wordcount of the given keyphrase.
 */
module.exports = function( text ) {
	text = sanitizeString( text );

	if ( text === "" ) {
		return 0;
	}

	return text.split( /\s/g ).length;
};
