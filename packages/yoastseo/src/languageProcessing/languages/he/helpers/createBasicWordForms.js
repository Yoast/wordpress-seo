/**
 * Creates basic word forms for a given Hebrew word.
 *
 * @param {string} word     The word for which to create basic word forms.
 *
 * @returns {string[]} Prefixed and de-prefixed variations of a word.
 */
export default function createBasicWordForms( word ) {
	const prefixes = [ "ב", "ה", "ו", "כ", "ל", "מ", "ש" ];
	const forms = [];

	/*
	 * Add prefixes to the input word. We always do this, since some words
	 * beginning with a prefix-like letter might be exceptions where this is the
	 * actual first letter of the word.
	 */
	forms.push( ...prefixes.map( prefix => prefix + word ) );

	let stemmedWord = "";

	/*
	 * If a word starts with one of the prefixes, we strip it and create all possible
	 * prefixed forms based on this stem.
	 */
	if ( prefixes.some( prefix => word.startsWith( prefix ) ) ) {
		stemmedWord = word.slice( 1 );
	}

	if ( stemmedWord.length > 0 ) {
		forms.push( stemmedWord );
		forms.push( ...prefixes.map( prefix => prefix + stemmedWord ) );
	}

	return forms;
}
