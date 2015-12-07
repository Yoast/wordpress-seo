var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

/**
 * Checks for an alttag in the image and returns
 *
 * @param {String} text Textstring to match alt
 * @returns {String} the contents of the alttag, empty if none is set.
 */
module.exports = function( text ){
	var alt = "";
	var image = text.match( /alt=([\'\"])(.*?)\1/ig );
	if ( image !== null ) {

		//matches the value of the alt attribute (alphanumeric chars), global and case insensitive
		alt = image[ 0 ].split( "=" )[ 1 ];
		alt = stripSpaces( alt.replace( /[\'\"]*/g, "" ) );
	}
	return alt;
};
