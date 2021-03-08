import SentenceTokenizer from "./SentenceTokenizer";

/**
 * Parses a text into sentences.
 *
 * @param {string} text The text to parse.
 *
 * @returns {string[]} An array of sentence objects.
 */
const parseTextIntoSentences = function( text ) {
	const  sentenceTokenizer = new SentenceTokenizer();
	const { tokenizer, tokens } = sentenceTokenizer.createTokenizer();

	sentenceTokenizer.tokenize( tokenizer, text );
	return sentenceTokenizer.getSentencesFromTokens( tokens );
};

export {
	parseTextIntoSentences,
};
