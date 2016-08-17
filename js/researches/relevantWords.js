var getRelevantWords = require( "../stringProcessing/relevantWords" ).getRelevantWords;

/**
 * Retrieves the relevant words from the given paper.
 *
 * @param {Paper} paper The paper to determine the relevant words of.
 */
function relevantWords( paper ) {
	return getRelevantWords( paper.getText() );
}


module.exports = relevantWords;
