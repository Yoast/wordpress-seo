/**
 *
 * If the word starts with one of the prefixes "ב" "ה", "ו", "כ", "ל", "מ", "ש" it should be stemmed as the dictionary
 * does not contain forms with those prefixes.
 *
 * @param {string} 		word		The word to check for a prefix.
 * @param {string[]} 	prefixes	The prefixes that should be stemmed before checking the dictionary.
 *
 * @returns {string} Word without the prefix or the original word if no prefix was found
 */
const removePrefix = function( word, prefixes ) {
	if ( prefixes.some( prefix => word.startsWith( prefix ) ) ) {
		return word.slice( 1 );
	}
	return word;
};

/**
 *
 * @param word
 * @param morphologyData
 */
export default function stem( word, morphologyData ) {
	const dictionaryStemmer = morphologyData.dictionary;

	// Check if the word exists in the dictionary stemmer. If yes, return base form of the word specified in the dictionary.
	let stemmedWord = dictionaryStemmer[ word ];
	if ( stemmedWord ) {
		return stemmedWord;
	}

	// If the word was not found in the dictionary, try to remove a prefix from the word and see whether the deprefixed word is found.
	const wordAfterRemovingPrefix = removePrefix( word, morphologyData.prefixes );
	if ( wordAfterRemovingPrefix !== word ) {
		stemmedWord = dictionaryStemmer[ wordAfterRemovingPrefix ];
		if ( stemmedWord ) {
			return stemmedWord;
		}
		// If a prefix was removed but the word was still not found, try removing another prefix and search in the dictionary again.

		const wordAfterRemovingSecondPrefix = removePrefix( wordAfterRemovingPrefix, morphologyData.prefixes );
		if ( wordAfterRemovingSecondPrefix !== wordAfterRemovingPrefix  ) {
			stemmedWord = dictionaryStemmer[ wordAfterRemovingSecondPrefix ];
			if ( stemmedWord ) {
				return stemmedWord;
			}
		}
	}
	return word;
}
