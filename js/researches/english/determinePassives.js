var getParticiples = require( "./passivevoice/getParticiples.js" );

var forEach = require( "lodash/forEach" );

/**
 * Determines whether a sentence part is passive.
 *
 * @param {string} sentencePart The sentence part to determine voice for.
 * @returns {boolean} Returns true if passive, otherwise returns false.
 */
module.exports = function( sentencePart, auxiliaries ) {
	var participles = getParticiples( sentencePart, auxiliaries );
	var passive = false;
	forEach( participles, function( participle ) {
		if ( participle.determinesSentencePartIsPassive() ) {
			passive = true;
			return;
		}
	} );
	return passive;
};
