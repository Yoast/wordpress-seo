import { includes } from "lodash";
import getWords from "../../word/getWords";

/**
 * Checks whether the participle is directly preceded by a word from the direct precedence exception list.
 * If this is the case, the clause is not passive.
 *
 * @param {string} clause 		The clause that contains the participle.
 * @param {string} participle   The participle.
 * @param {Array} cannotDirectlyPrecedePassiveParticipleList List of words which cannot directly precede a passive participle.
 *
 * @returns {boolean} Returns true if a word from the direct precedence exception list is directly preceding
 *                    the participle, otherwise returns false.
 */
export default function( clause, participle, cannotDirectlyPrecedePassiveParticipleList = [] ) {
	// Break the sentence part up into words and convert to lower case.
	const wordsInClause = getWords( clause ).map( word => word.toLowerCase() );

	// Search the participle in the word list.
	const participleIndex = wordsInClause.indexOf( participle.toLowerCase() );

	/*
	 * There can be no exception in the following situations:
	 *
	 * -1 The participle is not found.
	 *  0 There is no word before the participle.
	 */
	if ( participleIndex < 1 ) {
		return false;
	}

	const wordPrecedingParticiple = wordsInClause[ participleIndex - 1 ];

	// Check if the word preceding the participle is in the exceptions list.
	return includes( cannotDirectlyPrecedePassiveParticipleList, wordPrecedingParticiple );
}
