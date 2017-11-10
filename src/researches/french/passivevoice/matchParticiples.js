/**
 * Returns words that have been determined to be a regular participle.
 *
 * @param {string} word The word to check
 *
 * @returns {Array} A list with the matches.
 */
var regularParticiples = function( word ) {
	// Matches all words ending in ed.
	var regularParticiplesRegex = /\S+(é|ée|és|ées)($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig;

	return word.match( regularParticiplesRegex ) || [];
};

module.exports = function() {
	return {
		regularParticiples: regularParticiples,
	};
};
