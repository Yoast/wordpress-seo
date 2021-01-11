const verbsBeginningWithGeRegex = /^((ge)\S+t($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>]))/ig;
const verbsBeginningWithErVerEntBeZerHerUberRegex = /^(((be|ent|er|her|ver|zer|über|ueber)\S+([^s]t|sst))($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>]))/ig;
const verbsWithGeInMiddleRegex = /(ab|an|auf|aus|vor|wieder|zurück)(ge)\S+t($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig;
const verbsWithErVerEntBeZerHerUberInMiddleRegex =
	/((ab|an|auf|aus|vor|wieder|zurück)(be|ent|er|her|ver|zer|über|ueber)\S+([^s]t|sst))($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig;
const verbsEndingWithIertRegex = /\S+iert($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig;

/**
 * Checks if the word starts with 'ge'.
 *
 * @param {string} word The word to match.
 * @returns {Array} A list with matches.
 */
const verbsBeginningWithGe = function( word ) {
	return word.match( verbsBeginningWithGeRegex ) || [];
};

/**
 * Checks if the word starts with 'er', 'ver', 'ent', 'be' or 'zer'.
 *
 * @param {string} word The word to match.
 * @returns {Array} A list with matches.
 */
const verbsBeginningWithErVerEntBeZerHerUber = function( word ) {
	return word.match( verbsBeginningWithErVerEntBeZerHerUberRegex ) || [];
};

/**
 * Checks if the word contains 'ge' following 'ab', 'an', 'auf', 'aus', 'vor', 'wieder' or 'zurück'.
 *
 * @param {string} word The word to match.
 * @returns {Array} A list with matches.
 */
const verbsWithGeInMiddle = function( word ) {
	return word.match( verbsWithGeInMiddleRegex ) || [];
};

/**
 * Checks if the word starts with 'er', 'ver', 'ent', 'be' or 'zer',
 * following  'ab', 'an', 'auf', 'aus', 'vor', 'wieder' or 'zurück'.
 *
 * @param {string} word The word to match.
 * @returns {Array} A list with matches.
 */
const verbsWithErVerEntBeZerHerUberInMiddle = function( word ) {
	return word.match( verbsWithErVerEntBeZerHerUberInMiddleRegex ) || [];
};

/**
 * Checks if the word ends in 'iert'.
 *
 * @param {string} word The word to match.
 * @returns {Array} A list with matches.
 */
const verbsEndingWithIert = function( word ) {
	return word.match( verbsEndingWithIertRegex ) || [];
};

/**
 * Returns lists of verbs that are relevant for determining passive voice in German.
 *
 * @returns {Object} German lists of words relevant for passive voice.
 */
export default function() {
	return {
		verbsBeginningWithGe: verbsBeginningWithGe,
		verbsBeginningWithErVerEntBeZerHerUber: verbsBeginningWithErVerEntBeZerHerUber,
		verbsWithGeInMiddle: verbsWithGeInMiddle,
		verbsWithErVerEntBeZerHerUberInMiddle: verbsWithErVerEntBeZerHerUberInMiddle,
		verbsEndingWithIert: verbsEndingWithIert,
	};
}
