import getPassiveVerbs from "../config/passiveVoice/passiveVerbsWithLongVowel";

/**
 * Checks the passed sentence to see if it contains Arabic passive verb-forms.
 *
 * @param {string} sentence The sentence to match against.
 * @returns {Boolean} Whether the sentence contains Arabic passive voice.
 */
export default function isPassiveSentence( sentence ) {
	const arabicPrepositionalPrefix =  "و";
	const words = getWords( sentence );
	const passiveVerbs = [];

	for ( let word of words ) {
		// Check if the word starts with prefix و
		if ( word.startsWith( arabicPrepositionalPrefix ) ) {
			word = word.slice( 1 );
		}
		let wordWithDamma = -1;
		// Check if the first character has a damma or if the word is in the list of Arabic passive verbs
		if ( word.length >= 2 ) {
			wordWithDamma = word[ 1 ].search( "\u064F" );
		}
		if ( wordWithDamma !== -1 || getPassiveVerbs().includes( word ) ) {
			passiveVerbs.push( word );
		}
	}

	return passiveVerbs.length !== 0;
};
