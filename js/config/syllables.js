/** @module config/syllables */

var getLanguage = require( "../helpers/getLanguage.js" );
var isUndefined = require( "lodash/isUndefined" );

var de = require( "./syllables/de.json" );
var en = require( './syllables/en.json' );
var nl = require( './syllables/nl.json' );

module.exports = function( locale ) {
	if ( isUndefined( locale ) ) {
		locale = "en_US"
	}

	switch( getLanguage( locale ) ) {
		case "de":
			return de;
		case "nl":
			return nl;
		case "en":
		default:
			return en;
	}
};
