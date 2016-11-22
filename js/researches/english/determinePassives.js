var getParticiples = require( "./passivevoice/getParticiples.js" );

var determineSentencePartIsPassive =  require( "../passivevoice/determineSentencePartIsPassive.js" );

/**
 * Determines whether a sentence part is passive.
 *
 * @param {string} sentencePart The sentence part to determine voice for.
 * @returns {boolean} Returns true if passive, otherwise returns false.
 */
module.exports = function( sentencePart, auxiliaries ) {
	var participles = getParticiples( sentencePart, auxiliaries );
	return determineSentencePartIsPassive( participles );
};
