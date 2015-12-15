/** @module analyses/getKeyphraseLength */

var sanitizeString = require( "../stringProcessing/sanitizeString.js" );

/**
 * Checks the number of words in the keyphrase
 *
 * @param {string} text The keyphrase to count words in.
 * @returns {number} The wordcount of the given keyphrase.
 */
module.exports = function( text ) {
	text = sanitizeString( text );

	if ( text === "" ) {
		return 0;
	}

	return text.split( /\s/g ).length;
};
