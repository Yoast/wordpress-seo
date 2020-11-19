var verbsBeginningWithGeRegex = /^((ge)\S+t($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>]))/ig;
const verbsEndingWithVeRegex = /\S+ve($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>„”])/ig;
const verbsEndingWithVaRegex = /\S+va($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>„”])/ig;
var verbsBeginningWithErVerEntBeZerHerUberRegex = /^(((be|ent|er|her|ver|zer|über|ueber)\S+([^s]t|sst))($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>]))/ig;
var verbsWithGeInMiddleRegex = /(ab|an|auf|aus|vor|wieder|zurück)(ge)\S+t($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig;
var verbsWithErVerEntBeZerHerUberInMiddleRegex =
	/((ab|an|auf|aus|vor|wieder|zurück)(be|ent|er|her|ver|zer|über|ueber)\S+([^s]t|sst))($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig;
var verbsEndingWithIertRegex = /\S+iert($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig;
var exceptionsRegex = /\S+(apparat|arbeit|dienst|haft|halt|kraft|not|pflicht|schaft|schrift|tät|wert|zeit)($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig;

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
 * Returns lists of verbs that are relevant for determining passive voice in Hungarian.
 *
 * @returns {Object}               Hungarian lists of words relevant for passive voice.
 */
export default function() {
	return {
		verbsEndingWithVe: verbsEndingWithVe,
		verbsEndingWithVa: verbsEndingWithVa,
	};
}
