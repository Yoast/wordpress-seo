import { includes } from "lodash-es";

import { irregularParticiples } from  "../../../../languageProcessing/languages/en/config/internal/passiveVoiceIrregulars";

import { regularParticiplesRegex } from "../../../../languageProcessing/languages/en/config/regularParticiplesRegex";

// const participleRegex =  /\w+ed($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig;
// console.log(participleRegex)

console.log( regularParticiplesRegex, "THEREGEX" );

/**
 * Checks if a given word is a participle.
 * @param {string} word The word that needs to be ckecked for patricipleness.
 * @returns {boolean} True if the words is a participle, false otherwise.
 */
function isParticiple( word ) {
	if ( word.match( regularParticiplesRegex )[ 0 ].length > 0 || includes( irregularParticiples, word ) ) {
		console.log( "MATCH isparticiple1" );
	}
	console.log( "isparticiple, regex", regularParticiplesRegex );
	console.log( word.match( regularParticiplesRegex )[ 0 ] === word || includes( irregularParticiples, word ), word, "isparticiple2" );
	return  word.match( regularParticiplesRegex )[ 0 ] === word || includes( irregularParticiples, word );
	// return matchRegularParticiples( word, participleRegex ).length !== 0 || includes( irregularParticiples, word );
}


/**
 * Generates a callback that checks if a non-inclusive phrase is followed by a participle.
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


/**
 * Generates a callback that checks if a non-inclusive phrase is NOT followed by a participle.
 * @param {string[]} words an array of the words that form the text that contains the non inclusive phrase.
 * @param {string[]} nonInclusivePhrase a list of words that are a non inclusive phrase.
 * @returns {function} a callback function that checks if the word after a non inclusive phrase is a participle.
 */
export function isNotFollowedByParticiple( words, nonInclusivePhrase ) {
	return index => ! isFollowedByParticiple( words, nonInclusivePhrase )( index );
}
