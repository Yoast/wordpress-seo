import splitSentence from "../../../helpers/passiveVoice/periphrastic/getSentencePartsSplitOnStopwords";
import arrayToRegex from "../../../helpers/createRegexFromArray";
import SentencePart from "../config/passiveVoice/SentencePart";
import auxiliariesFactory from "../config/passiveVoice/auxiliaries.js";
import stopwordsFactory from "../config/stopwords.js";

const options = {
	SentencePart: SentencePart,
	locale: "nl_NL",
	regexes: {
		auxiliaryRegex: arrayToRegex( auxiliariesFactory().all ),
		stopwordRegex: arrayToRegex( stopwordsFactory() ),
	},
};

/**
 * Gets the sentence parts from a sentence by determining sentence breakers.
 *
 * @param {string} sentence The sentence to split up in sentence parts.
 * @param {Object} options The language options for which to get the sentence parts.
 * @returns {Array} The array with all parts of a sentence that have an auxiliary.
 */
const getSentenceParts = function( sentence) {
	return splitSentence( sentence, options );
};
