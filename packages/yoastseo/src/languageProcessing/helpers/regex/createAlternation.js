/**
 * Turns a word list into a regex alternation, for building a pattern out of reviewed phrase lists (as the
 * per-language `redundantPhraseInAltText` configs do). A space in a word matches any whitespace, so a multi-word
 * phrase such as "that shows" also matches across a line break.
 *
 * @param {string[]} words The words to combine.
 *
 * @returns {string} The alternation.
 */
export default function createAlternation( words ) {
	return words.map( ( word ) => word.replace( / /g, "\\s+" ) ).join( "|" );
}
