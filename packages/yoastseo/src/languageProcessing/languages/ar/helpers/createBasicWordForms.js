import { flattenDeep } from "lodash-es";
const BASIC_PREFIXES = [ "ل", "ب", "ك", "و", "ف", "س", "أ", "ال", "وب", "ول", "لل", "فس", "فب", "فل", "وس",
	"وال", "بال", "فال", "كال", "ولل", "وبال" ];
// Sort the prefixes by length, so we can match the longest prefix first.
const DESCENDING_BASIC_PREFIXES = [ ...BASIC_PREFIXES ].sort( ( a, b ) => b.length - a.length );
const BASIC_PREFIXES_REGEX = new RegExp( `^(${DESCENDING_BASIC_PREFIXES.join( "|" )})` );

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
 * @returns {StemAndPrefixPair} The word without the basic prefixes and the prefix that was stripped.
 */
export function stemBasicPrefixes( word ) {
	/*
 	 * If a word starts with one of the prefixes, we strip it.
	 */
	let stemmedWord = word;
	let prefix = "";
	const isPrefixed = word.match( BASIC_PREFIXES_REGEX );

	if ( isPrefixed ) {
		prefix = isPrefixed[ 0 ];
		stemmedWord = word.slice( prefix.length );
	}

	return { stem: stemmedWord, prefix: prefix };
}

/**
 * Creates basic word forms for a given Arabic word.
 *
 * @param {string} word     The word for which to create basic word forms.
 *
 * @returns {Array}        Prefixed and de-prefixed variations of a word.
 */
export function createBasicWordForms( word ) {
	const forms = [];

	/*
	 * Add prefixes to the input word. We always do this, since some words
	 * beginning with a prefix-like letter might be exceptions where this is the
	 * actual first letter of the word.
	 */
	forms.push( ...BASIC_PREFIXES.map( basicPrefix => basicPrefix + word ) );

	const { stem, prefix } = stemBasicPrefixes( word );

	if ( prefix !== "" ) {
		/*
		If a word starts with one of the prefixes, we strip it and attach all prefixes to the stem.
		*/
		forms.push( stem );
		forms.push( ...BASIC_PREFIXES.map( basicPrefix => basicPrefix + stem ) );
	}

	return flattenDeep( forms );
}
