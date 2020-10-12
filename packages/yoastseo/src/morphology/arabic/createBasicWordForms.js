/**
 * Creates basic word forms for a given Arabic word.
 *
 * @param {string} word     The word for which to create basic word forms.
 *
 * @returns {Array}        Prefixed and de-prefixed variations of a word.
 */
export function createBasicWordForms( word ) {
	const prefixes = [ "ل", "ب", "ك", "و", "ف", "س", "أ", "ال", "وب", "ول", "لل", "فس", "فب", "فل", "وس", "ات",
		"ست", "سن", "لن", "وال", "بال", "فال", "كال", "ولل", "نست", "است", "تنن", "مست", "وبال" ];

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
	for ( const prefix of prefixes ) {
		if ( word.startsWith( prefix ) ) {
			stemmedWord = word.slice( prefix.length );
		}
	}

	if ( stemmedWord.length > 0 ) {
		forms.push( stemmedWord );
		forms.push( ...prefixes.map( prefix => prefix + stemmedWord ) );
	}

	return forms;
}
