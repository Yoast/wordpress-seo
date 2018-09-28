import cannotDirectlyPrecedePassiveParticiplePolishFactory from "../researches/polish/functionWords.js";
const cannotDirectlyPrecedePassiveParticiplePolish = cannotDirectlyPrecedePassiveParticiplePolishFactory().cannotDirectlyPrecedePassiveParticiple;
/**
 * Checks whether the participle is directly preceded by a word from the direct precedence exception list.
 * If this is the case, the sentence part is not passive.
 *
 * @param {string[]} wordsInSentencePart The words in the sentence part that contains the participle.
 * @param {number}   participleIndex     The index of the participle.
 * @param {string}   language            The language of the participle.
 *
 * @returns {boolean} Returns true if a word from the direct precedence exception list is directly preceding
 * the participle, otherwise returns false.
 */
export default function( wordsInSentencePart, participleIndex, language ) {
	// If the participle is the first word, there can't be a word before that.
	if ( participleIndex === 0 ) {
		return false;
	}
	const wordPrecedingParticiple = wordsInSentencePart[ participleIndex - 1 ];

	let directPrecedenceExceptions = [];
	switch ( language ) {
		case "pl":
			directPrecedenceExceptions = cannotDirectlyPrecedePassiveParticiplePolish;
			break;
	}

	for ( let i = 0; i < directPrecedenceExceptions.length; i++ ) {
		if ( directPrecedenceExceptions[ i ].includes( wordPrecedingParticiple ) ) {
			return true;
		}
	}

	return false;
}
