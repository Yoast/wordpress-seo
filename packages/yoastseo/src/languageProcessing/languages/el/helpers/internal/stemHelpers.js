/**
 * Matches word with an array of regexes and stems the word if there is any match. Further processes the stemmed word
 * if it matches one of the regexes in the second array by attaching an additional ending.
 *
 * @param {string}  word        The word to check.
 * @param {Array}   regexes1    The first array of regexes to check.
 * @param {Array}   regexes2    The second array of regexes to check.
 * @param {Array}   endings     The array of endings to attach to the stemmed word
 *                              if the previously stemmed word matches one of the regexes in the second array.
 * @returns {string}    The stemmed word if there is any matches or otherwise the original word.
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
 * Matches word with a regex and stems the word if there is any match.
 *
 * @param {string}  word     The word to check.
 * @param {string}   regex    The regex to match.
 *
 * @returns {string}    The stemmed word if there is any matches or otherwise the original word.
 */
export function matchAndStemWordWithOneRegex( word, regex ) {
	let match;
	if ( ( match = new RegExp( regex ).exec( word ) ) !== null ) {
		word = match[ 1 ];
	}
	return word;
}

/**
 * Matches word with a regex and stems the word if there is any match. Further processes the stemmed word
 * if it matches one of the two regexes in the second check by attaching an additional ending.
 *
 * @param {string}  word    The word to check.
 * @param {string}  regex1  The first regex to match.
 * @param {string}  regex2  The second regex to match.
 * @param {string}  regex3  The third regex to match.
 * @param {string}  ending  The ending to attach to the stemmed word
 *                          if the previously stemmed word matches one of the conditions in the second check.
 * @returns {string}    The stemmed word if there is any matches or otherwise the original word.
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
