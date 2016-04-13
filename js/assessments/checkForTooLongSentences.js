var forEach = require( "lodash/forEach" );

/**
 * Counts number of too long sentences.
 * @param {array} sentences The array containing sentences.
 * @returns {number} Number of too long sentences.
 */
module.exports = function ( sentences ) {
	var tooLong = 0;
	var recommendedValue = 20;
	forEach( sentences, function( sentence ) {
		if ( sentence  > recommendedValue ) {
			tooLong++;
		}
	} );
	return tooLong;
};
