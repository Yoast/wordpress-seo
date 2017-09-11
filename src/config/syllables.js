/** @module config/syllables */

let getLanguage = require( "../helpers/getLanguage.js" );
let isUndefined = require( "lodash/isUndefined" );

let de = require( "./syllables/de.json" );
let en = require( './syllables/en.json' );
let nl = require( './syllables/nl.json' );
let it = require( './syllables/it.json' );

let languages = { de, nl, en, it };

module.exports = function( locale = "en_US" ) {
	let language = getLanguage( locale );

	if( languages.hasOwnProperty( language ) ) {
		return languages[ language ];
	}

	// If an unknown locale is used, default to English.
	return languages[ "en" ];
};
