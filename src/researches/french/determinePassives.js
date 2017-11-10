var getParticiples = require( "./passivevoice/getParticiples.js" );

var determineSentencePartIsPassive =  require( "../passivevoice/determineSentencePartIsPassive.js" );

/**
 * Determines whether a sentence part is passive.
 *
 * @param {string} sentencePart The sentence part to determine voice for.
 * @param {Array} auxiliaries The auxiliaries to be used for creating SentenceParts.
 * @returns {boolean} Returns true if passive, otherwise returns false.
 */
module.exports = function( sentencePart, auxiliaries ) {
	var participles = getParticiples( sentencePart, auxiliaries );
	console.log( "x" );
	return determineSentencePartIsPassive( participles );
};
