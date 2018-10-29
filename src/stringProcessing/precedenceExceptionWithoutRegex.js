import { get, includes } from "lodash-es";
import functionWordsEnglishFactory from "../researches/english/functionWords";
import functionWordsFrenchFactory from "../researches/french/functionWords";
import functionWordsItalianFactory from "../researches/italian/functionWords";
import functionWordsSpanishFactory from "../researches/spanish/functionWords";
import getWords from "../stringProcessing/getWords";

const cannotBeBetweenPassiveAuxiliaryAndParticiple = {
	en: functionWordsEnglishFactory().cannotBeBetweenPassiveAuxiliaryAndParticiple,
	fr: functionWordsFrenchFactory().cannotBeBetweenPassiveAuxiliaryAndParticiple,
	it: functionWordsItalianFactory().cannotBeBetweenPassiveAuxiliaryAndParticiple,
	es: functionWordsSpanishFactory().cannotBeBetweenPassiveAuxiliaryAndParticiple,
};

/**
 * Checks whether a word from the precedence exception list occurs anywhere in the sentence part before the participle.
 * If this is the case, the sentence part is not passive.
 *
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {string} participle   The participle.
 * @param {string} language     The language of the participle.
 *
 * @returns {boolean} Returns true if a word from the precedence exception list occurs anywhere in the
 *                    sentence part before the participle, otherwise returns false.
 */
export default function( sentencePart, participle, language ) {
	// Break the sentence part up into words and convert to lower case.
	const wordsInSentencePart = getWords( sentencePart ).map( word => word.toLowerCase() );

	// Search the participle in the word list.
	const participleIndex = wordsInSentencePart.indexOf( participle.toLowerCase() );

	/*
	 * There can be no exception in the following situations:
	 *
	 * -1 The participle is not found.
	 *  0 There is no word before the participle.
	 */
	if ( participleIndex < 1 ) {
		return false;
	}

	// Get the exceptions word list.
	const precedenceExceptions = get( cannotBeBetweenPassiveAuxiliaryAndParticiple, language, [] );

	// Check if the words preceding the participle are in the exceptions list.
	for ( let i = 0; i < participleIndex; i++ ) {
		if ( includes( precedenceExceptions, wordsInSentencePart[ i ] ) ) {
			return true;
		}
	}

	return false;
}
