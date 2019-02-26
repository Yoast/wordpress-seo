/**
 * The default limit of 20 words is too strict for Catalan. For more detailed explanation, see:
 * https://github.com/Yoast/research/wiki/Sentence-Length-Catalan
 */

export default {
	sentenceLength: {
		recommendedWordCount: 25,
	},
};
