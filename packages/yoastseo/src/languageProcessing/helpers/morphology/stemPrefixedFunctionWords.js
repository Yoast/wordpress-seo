/**
 * An object containing the stem and the prefix.
 *
 * @typedef {Object} 	StemAndPrefixPair
 * @property {string}	stem The word without the basic prefixes.
 * @property {string}	prefix The prefix that was matched.
 */

/**
 * Strips basic prefixes from a word.
 *
 * @param {string} word The word to strip the basic prefixes from.
 * @param {RegExp} regex The regular expression to match the basic prefixes.
 * @returns {StemAndPrefixPair} The word without the basic prefixes and the prefix that was stripped.
 */
export function stemPrefixedFunctionWords( word, regex ) {
	/*
 	 * If a word starts with one of the prefixes, we strip it.
	 */
	let stemmedWord = word;
	let prefix = "";
	const isPrefixed = word.match( regex );

	if ( isPrefixed ) {
		prefix = isPrefixed[ 0 ];
		stemmedWord = word.slice( prefix.length );
	}

	return { stem: stemmedWord, prefix: prefix };
}
