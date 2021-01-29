import splitSentence from "../../../helpers/passiveVoice/periphrastic/getSentencePartsSplitOnStopwords";
import arrayToRegex from "../../../helpers/regex/createRegexFromArray";
import SentencePart from "../values/SentencePart";
import auxiliaries from "../config/internal/auxiliaries.js";
import stopWords from "../config/stopWords.js";

const options = {
	SentencePart: SentencePart,
	regexes: {
		auxiliaryRegex: arrayToRegex( auxiliaries.allAuxiliaries ),
		stopwordRegex: arrayToRegex( stopWords ),
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
	return splitSentence( sentence, options );
}
