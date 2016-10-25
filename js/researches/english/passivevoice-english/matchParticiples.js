var find = require ( "lodash/find" );

var irregulars = require( "./irregulars" )();

// Matches all words ending in ed.
var regularParticiplesRegex = /\w+ed($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig;

/**
 * Returns the matches from a word with a regex that determines regular participles.
 * @param {string} word The word to match with the regex.
 * @returns {Array} A list with the matches.
 */
var regularParticiples = function( word ) {
	return word.match( regularParticiplesRegex ) || [];
};

/**
 * Returns the matches for a word in the list of irregulars.
 * @param {string} word The word to match in the list.
 * @returns {Array} A list with the matches.
 */
var irregularParticiples = function( word ) {
	var matches = [];
	find( irregulars, function( currentWord ) {
		if( currentWord === word ) {
			matches.push( currentWord );
		}
	} );
	return matches;
};

module.exports = function() {
	return {
		regularParticiples: regularParticiples,
		irregularParticiples: irregularParticiples,
	};
};
