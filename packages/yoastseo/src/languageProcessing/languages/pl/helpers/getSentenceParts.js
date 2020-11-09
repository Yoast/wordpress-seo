import splitSentence from "../../../helpers/passiveVoice/periphrastic/getSentencePartsSplitOnStopwords";
import arrayToRegex from "../../../helpers/regex/createRegexFromArray";
import SentencePart from "../values/SentencePart";
import auxiliariesFactory from "../config/internal/auxiliaries.js";
import stopwordsFactory from "../config/stopwords.js";

const options = {
	SentencePart: SentencePart,
	locale: "pl_PL",
	regexes: {
		auxiliaryRegex: arrayToRegex( auxiliariesFactory().all ),
		stopwordRegex: arrayToRegex( stopwordsFactory() ),
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
