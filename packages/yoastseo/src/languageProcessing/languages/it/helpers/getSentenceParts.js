import { languageProcessing } from "yoastseo";
const { createRegexFromArray, getPeriphrasticSentenceParts } = languageProcessing;

import SentencePart from "../values/SentencePart";
import auxiliaries from "../config/internal/passiveVoiceAuxiliaries.js";
import stopwords from "../config/stopWords.js";

const followingAuxiliaryExceptionWords = [ "il", "i", "la", "le", "lo", "gli", "uno", "una" ];
const reflexivePronouns = [ "mi", "ti", "si", "ci", "vi" ];

const options = {
	SentencePart: SentencePart,
	stopwords: stopwords,
	auxiliaries: auxiliaries,
	regexes: {
		auxiliaryRegex: createRegexFromArray( auxiliaries ),
		stopCharacterRegex: /([:,])(?=[ \n\r\t'"+\-»«‹›<>])/ig,
		followingAuxiliaryExceptionRegex: createRegexFromArray( followingAuxiliaryExceptionWords ),
		directPrecedenceExceptionRegex: createRegexFromArray( reflexivePronouns ),
	},
};

/**
 * Gets the sentence parts from a sentence by determining sentence breakers.
 *
 * @param {string} sentence The sentence to split up in sentence parts.
 *
 * @returns {Array} The array with all parts of a sentence that have an auxiliary.
 */
export default function getSentenceParts( sentence ) {
	return getPeriphrasticSentenceParts( sentence, options );
}
