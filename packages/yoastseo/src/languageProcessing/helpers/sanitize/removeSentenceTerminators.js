// These are sentence terminators, that never should be in the middle of a word.
const sentenceTerminators = /[.?!:;,]/g;

/**
 * Replaces sentence terminators from the text.
 *
 * @param {String} text The text to remove the terminators from.
 *
 * @returns {String} The sanitized text.
 */
export default function( text ) {
	return text.replace( sentenceTerminators, "" );
}
