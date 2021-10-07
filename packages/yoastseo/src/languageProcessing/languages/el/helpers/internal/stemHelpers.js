/**
 *
 * @param word
 * @param regexes1
 * @param regexes2
 * @param endings
 * @returns {*}
 */
export function matchAndStemWordWithRegexArray( word, regexes1, regexes2, endings ) {
	let match;
	for ( let i = 0; i < regexes1.length; i++ ) {
		if ( ( match = new RegExp( regexes1[ i ] ).exec( word ) ) !== null ) {
			word = match[ 1 ];
			if ( new RegExp( regexes2[ i ] ).test( word ) ) {
				word += endings[ i ];
			}
		}
	}
	return word;
}

/**
 *
 * @param word
 * @param regex
 * @returns {string}
 */
export function matchAndStemWordWithOneRegex( word, regex ) {
	let match;
	if ( ( match = new RegExp( regex ).exec( word ) ) !== null ) {
		word = match[ 1 ];
	}
	return word;
}

/**
 *
 * @param word
 * @param regex1
 * @param regex2
 * @param regex3
 * @param ending
 * @returns {string}
 */
export function matchAndStemWord( word, regex1, regex2, regex3, ending ) {
	let match;
	if ( ( match = new RegExp( regex1 ).exec( word ) ) !== null ) {
		word = match[ 1 ];
		if ( new RegExp( regex2 ).test( word ) || new RegExp( regex3 ).test( word ) ) {
			word += ending;
		}
	}
	return word;
}
