const BASIC_PREFIXES = [ "ل", "ب", "ك", "و", "ف", "س", "أ", "ال", "وب", "ول", "لل", "فس", "فب", "فل", "وس",
	"وال", "بال", "فال", "كال", "ولل", "وبال" ];

/**
 * Strips basic prefixes from a word.
 *
 * @param {string} word The word to strip the basic prefixes from.
 * @returns {string} The word without the basic prefixes.
 */
export function stemBasicPrefixes( word ) {
	/*
 	 * If a word starts with one of the prefixes, we strip it and create all possible
	 * prefixed forms based on this stem.
	 */
	let stemmedWord = "";
	BASIC_PREFIXES.forEach( prefix => {
		if ( word.startsWith( prefix ) ) {
			stemmedWord = word.slice( prefix.length );
		}
	} );
	return stemmedWord;
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
	forms.push( ...BASIC_PREFIXES.map( prefix => prefix + word ) );

	const stemmedWord = stemBasicPrefixes( word );

	if ( stemmedWord !== "" ) {
		forms.push( stemmedWord );
		forms.push( ...BASIC_PREFIXES.map( prefix => prefix + stemmedWord ) );
	}

	return forms;
}
