var Participle = require( "../../values/Participle.js" );

/**
 * Creates an Participle object for the French language.
 *
 * @param {string} participle The participle.
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {object} attributes  The attributes object.
 *
 * @constructor
 */
var FrenchParticiple = function(  participle, sentencePart, attributes ) {
	Participle.call( this, participle, sentencePart, attributes );
	this.setSentencePartPassiveness( this.isPassive() );
};

require( "util" ).inherits( FrenchParticiple, Participle );
