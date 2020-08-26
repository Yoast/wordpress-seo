/** @module config/transitionWords */

const singleWords = [ ];
const multipleWords = [ ];

/**
 * Returns lists with Farsi transition words to be used by the assessments.
 * @returns {Object}                 The object with transition word lists.
 */
export default function() {
	return {
		singleWords: singleWords,
		multipleWords: multipleWords,
		allWords: singleWords.concat( multipleWords ),
	};
}
