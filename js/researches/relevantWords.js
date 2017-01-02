var getRelevantWords = require( "../stringProcessing/relevantWords" ).getRelevantWords;

/**
 * Retrieves the relevant words from the given paper.
 *
 * @param {Paper} paper The paper to determine the relevant words of.
 * @returns {WordCombination[]} Relevant words for this paper, filtered and sorted.
 */
function relevantWords( paper ) {
	return getRelevantWords( paper.getText(), paper.getLocale() );
}


module.exports = relevantWords;
