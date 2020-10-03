import { get, includes } from "lodash-es";
import functionWordsDutchFactory from "../../../languages/legacy/researches/dutch/functionWords";
import functionWordsEnglishFactory from "../../../languages/legacy/researches/english/functionWords";
import functionWordsFrenchFactory from "../../../languages/legacy/researches/french/functionWords";
import functionWordsItalianFactory from "../../../languages/legacy/researches/italian/functionWords";
import functionWordsPolishFactory from "../../../languages/legacy/researches/polish/functionWords";
import functionWordsSpanishFactory from "../../../languages/legacy/researches/spanish/functionWords";
import functionWordsPortugueseFactory from "../../../languages/legacy/researches/portuguese/functionWords";
import getWords from "../../../researches/stringProcessing/getWords";

const cannotDirectlyPrecedePassiveParticiples = {
	nl: functionWordsDutchFactory().cannotDirectlyPrecedePassiveParticiple,
	en: functionWordsEnglishFactory().cannotDirectlyPrecedePassiveParticiple,
	fr: functionWordsFrenchFactory().cannotDirectlyPrecedePassiveParticiple,
	it: functionWordsItalianFactory().cannotDirectlyPrecedePassiveParticiple,
	pl: functionWordsPolishFactory().cannotDirectlyPrecedePassiveParticiple,
	es: functionWordsSpanishFactory().cannotDirectlyPrecedePassiveParticiple,
	pt: functionWordsPortugueseFactory().cannotDirectlyPrecedePassiveParticiple,
};

/**
 * Checks whether the participle is directly preceded by a word from the direct precedence exception list.
 * If this is the case, the sentence part is not passive.
 *
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {string} participle   The participle.
 * @param {string} language     The language of the participle.
 *
 * @returns {boolean} Returns true if a word from the direct precedence exception list is directly preceding
 *                    the participle, otherwise returns false.
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

	const wordPrecedingParticiple = wordsInSentencePart[ participleIndex - 1 ];

	// Get the exceptions word list.
	const directPrecedenceExceptions = get( cannotDirectlyPrecedePassiveParticiples, language, [] );

	// Check if the word preceding the participle is in the exceptions list.
	return includes( directPrecedenceExceptions, wordPrecedingParticiple );
}
