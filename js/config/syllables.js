/** @module config/syllables */

let getLanguage = require( "../helpers/getLanguage.js" );
let isUndefined = require( "lodash/isUndefined" );

let de = require( "./syllables/de.json" );
let en = require( './syllables/en.json' );
let nl = require( './syllables/nl.json' );
let it = require( './syllables/it.json' );

module.exports = function( locale ) {
	if ( isUndefined( locale ) ) {
		locale = "en_US"
	}

	switch( getLanguage( locale ) ) {
		case "de":
			return de;
		case "nl":
			return nl;
		case "it":
			return it;
		case "en":
		default:
			return en;
	}
};
