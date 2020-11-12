import getPeriphrasticSentenceParts from "../../../helpers/passiveVoice/periphrastic/getSentenceParts.js";
import arrayToRegex from "../../../helpers/regex/createRegexFromArray";
import SentencePart from "../values/SentencePart";
import auxiliaries from "../config/internal/passiveVoiceAuxiliaries.js";
import stopWords from "../config/stopWords.js";

const followingAuxiliaryExceptionWords = [ "le", "la", "les", "une", "l'un", "l'une" ];
const reflexivePronouns = [ "se", "me", "te", "s'y", "m'y", "t'y", "nous nous", "vous vous" ];
const elisionAuxiliaryExceptionWords = [ "c'", "s'", "peut-" ];

const options = {
	SentencePart: SentencePart,
	stopwords: stopWords,
	auxiliaries: auxiliaries,
	regexes: {
		auxiliaryRegex: arrayToRegex( auxiliaries ),
		stopCharacterRegex: /(,)(?=[ \n\r\t'"+\-»«‹›<>])/ig,
		followingAuxiliaryExceptionRegex: arrayToRegex( followingAuxiliaryExceptionWords ),
		directPrecedenceExceptionRegex: arrayToRegex( reflexivePronouns ),
		elisionAuxiliaryExceptionRegex: arrayToRegex( elisionAuxiliaryExceptionWords, true ),
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
