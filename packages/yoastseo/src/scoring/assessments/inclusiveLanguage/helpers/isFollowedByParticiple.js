import { includes, isNull } from "lodash-es";

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
	console.log( "xxxxxxxxx", word, word.match( regularParticiplesRegex ) );
	if ( word.match( regularParticiplesRegex ) || includes( irregularParticiples, word ) ) {
		console.log( "MATCH isparticiple1" );
	}
	console.log( "isparticiple, regex", regularParticiplesRegex );
	console.log( word.match( regularParticiplesRegex ) || includes( irregularParticiples, word ), word, "isparticiple2" );
	const participleMatch = word.match( regularParticiplesRegex );
	return ( ! isNull( participleMatch ) && participleMatch[ 0 ] === word ) || includes( irregularParticiples, word );
	// return matchRegularParticiples( word, participleRegex ).length !== 0 || includes( irregularParticiples, word );
}


/**
 * Generates a callback that checks if a non-inclusive phrase is followed by a participle.
 * @param {string[]} words an array of the words that form the text that contains the non inclusive phrase.
 * @param {string[]} nonInclusivePhrase a list of words that are a non inclusive phrase.
 * @returns {function} a callback function that checks if the word after a non inclusive phrase is a participle.
 */
export function isFollowedByParticiple( words, nonInclusivePhrase ) {
	console.log( "haaaaaa" );
	return index => {
		console.log( "hiiiiiiiii" );
		const followingWordIndex = index + nonInclusivePhrase.length;
		if ( followingWordIndex < words.length ) {
			const followingWord = words[ followingWordIndex ];
			console.log( "qqqqqqqqqq", followingWord );
			return isParticiple( followingWord );
		}
		console.log( "rrrrrrrrr" );
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
	console.log( "hoooooo" );
	return index => ! isFollowedByParticiple( words, nonInclusivePhrase )( index );
}
