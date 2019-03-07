import { getRelevantWords } from "../stringProcessing/relevantWords";

/**
 * Retrieves the relevant words from the given paper.
 *
 * @param {Paper} paper The paper to determine the relevant words of.
 * @returns {WordCombination[]} Relevant words for this paper, filtered and sorted.
 */
function relevantWords( paper ) {
	return getRelevantWords( paper.getText(), paper.getLocale() );
}


export default relevantWords;
