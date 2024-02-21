/**
 * An object containing the stem and the prefix.
 *
 * @typedef {Object} 	StemAndPrefixPair
 * @property {string}	stem The word without the basic prefixes.
 * @property {string}	prefix The prefix that was matched.
 */

/**
 * Strips function word prefixes from the word.
 *
 * @param {string} word The word to strip the basic prefixes from.
 * @param {RegExp} regex The regular expression to match the function word prefixes.
 * @returns {StemAndPrefixPair} The word without the function word prefixes that was stripped,
 * or the original word if the word is not prefixed.
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
