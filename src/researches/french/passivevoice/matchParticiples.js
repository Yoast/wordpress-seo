var find = require( "lodash/find" );
var forEach = require( "lodash/forEach" );
var memoize = require( "lodash/memoize" );

var irregulars = require( "./irregulars" )();

/**
 * Returns words that have been determined to be a regular participle.
 *
 * @param {string} word The word to check
 *
 * @returns {Array} A list with the matches.
 */
var regularParticiples = function( word ) {
	// Matches all words ending in é/ée/és/ées.
	var regularParticiplesRegex = /\S+(é|ée|és|ées)($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig;

	return word.match( regularParticiplesRegex ) || [];
};

/**
 * Returns the matches for a word in the list of irregulars.
 *
 * @param {string} word The word to match in the list.
 *
 * @returns {Array} A list with the matches.
 */
var irregularParticiples = function( word ) {
	var matches = [];
	forEach( irregulars, function( irregular ) {
		var irregularParticiplesRegex = new RegExp( "^" + irregular + "(e|s|es)?$", "ig" );
		matches.push( word.match( irregularParticiplesRegex ) || [] );
	} );
	matches = [].concat.apply( [], matches );
	return matches;
};

module.exports = function() {
	return {
		regularParticiples: memoize(regularParticiples),
		irregularParticiples: memoize(irregularParticiples),
	};
};
