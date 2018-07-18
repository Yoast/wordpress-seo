/** @module config/syllables */

let getLanguage = require( "../helpers/getLanguage.js" );
let isUndefined = require( "lodash/isUndefined" );

let de = require( "./syllables/de.json" );
let en = require( './syllables/en.json' );
let nl = require( './syllables/nl.json' );
let it = require( './syllables/it.json' );
let ru = require( './syllables/ru.json' );
let fr = require( './syllables/fr.json' );
let es = require( './syllables/es.json' );

let languages = { de, nl, en, it, ru, fr, es };

module.exports = function( locale = "en_US" ) {
	let language = getLanguage( locale );

	if( languages.hasOwnProperty( language ) ) {
		return languages[ language ];
	}

	// If an unknown locale is used, default to English.
	return languages[ "en" ];
};
