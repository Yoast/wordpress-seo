import { includes, isNull } from "lodash";

import irregularParticiples from  "../../../../languageProcessing/languages/en/config/internal/passiveVoiceIrregulars";

import { regularParticiplesRegex } from "../../../../languageProcessing/languages/en/config/regularParticiplesRegex";


/**
 * Checks if a given word is a participle.
 *
 * @param {string} word The word that needs to be checked for whether it is a participle.
 * @returns {boolean} True if the words is a participle, false otherwise.
 */
export function isParticiple( word ) {
	const participleMatch = word.match( regularParticiplesRegex );
	return ( ! isNull( participleMatch ) && participleMatch[ 0 ] === word ) || includes( irregularParticiples, word );
}


/**
 * Generates a callback that checks if a non-inclusive phrase is followed by a participle.
 *
 * @param {string[]} words an array of the words that form the text that contains the non inclusive phrase.
 * @param {string[]} nonInclusivePhrase a list of words that are a non inclusive phrase.
 * @returns {function} a callback function that checks if the word after a non inclusive phrase is a participle.
 */
export function isFollowedByParticiple( words, nonInclusivePhrase ) {
	return index => {
		const followingWordIndex = index + nonInclusivePhrase.length;
		if ( followingWordIndex < words.length ) {
			const followingWord = words[ followingWordIndex ];
			return isParticiple( followingWord );
		}
		return false;
	};
}
