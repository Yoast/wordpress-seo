const verbsEndingWithVeRegex = /\S+ve($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>„”])/ig;
const verbsEndingWithVaRegex = /\S+va($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>„”])/ig;
const verbsEndingWithOdniRegex1 = /\S+ódni($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>„”])/ig;
const verbsEndingWithOdniRegex2 = /\S+ődni($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>„”])/ig;

/**
 * Checks if the word ends in 've'.
 *
 * @param {string} word     The word to match.
 * @returns {Array}         A list with matches.
 */
const verbsEndingWithVe = function( word ) {
	return word.match( verbsEndingWithVeRegex ) || [];
};

/**
 * Checks if the word ends in 'va'.
 *
 * @param {string} word     The word to match.
 * @returns {Array}         A list with matches.
 */
const verbsEndingWithVa = function( word ) {
	return word.match( verbsEndingWithVaRegex ) || [];
};

/**
 * Checks if the word ends in 'ódni'.
 *
 * @param {string} word     The word to match.
 * @returns {Array}         A list with matches.
 */
const verbsEndingWithOdni1 = function( word ) {
	return word.match( verbsEndingWithOdniRegex1 ) || [];
};

/**
 * Checks if the word ends in 'ődni'.
 *
 * @param {string} word     The word to match.
 * @returns {Array}         A list with matches.
 */
const verbsEndingWithOdni2 = function( word ) {
	return word.match( verbsEndingWithOdniRegex2 ) || [];
};

/**
 * Returns lists of verbs that are relevant for determining passive voice in Hungarian.
 *
 * @returns {Object}               Hungarian lists of words relevant for passive voice.
 */
export default function() {
	return {
		verbsEndingWithVe: verbsEndingWithVe,
		verbsEndingWithVa: verbsEndingWithVa,
		verbsEndingWithOdni1: verbsEndingWithOdni1,
		verbsEndingWithOdni2: verbsEndingWithOdni2,
	};
}
