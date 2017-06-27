/** @module config/syllables */

let getLanguage = require( "../helpers/getLanguage.js" );
let isUndefined = require( "lodash/isUndefined" );

let de = require( "./syllables/de.json" );
let en = require( './syllables/en.json' );
let nl = require( './syllables/nl.json' );
let it = require( './syllables/it.json' );

let languages = { "de": de, "nl": nl, "en": en, "it": it };

module.exports = function( locale ) {
	// Default to English when no locale is defined.
	let language = locale ? getLanguage( locale ) : "en";

	if( languages.hasOwnProperty( language ) ) {
		return languages[ language ];
	}
	// When a locale is defined, but not included in the languages object, also default to English.
	return languages[ "en" ];
};
