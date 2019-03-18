import { get, take } from "lodash-es";
import getLanguage from "../helpers/getLanguage";
import {
	getRelevantWords,
	collapseRelevantWordsOnStem,
	getRelevantCombinationsForInsights,
	sortCombinations,
} from "../stringProcessing/relevantWords";

/**
 * Retrieves the relevant words from the given paper.
 *
 * @param {Paper} paper The paper to determine the relevant words of.
 * @param {Researcher} researcher The researcher to use for analysis.
 *
 * @returns {WordCombination[]} Relevant words for this paper, filtered and sorted.
 */
function relevantWords( paper, researcher ) {
	const language = getLanguage( paper.getLocale() );
	const morphologyData = get( researcher.getData( "morphology" ), language, false );

	const relevantWordsFromText = getRelevantWords( paper.getText(), language, morphologyData );

	const collapsedWords = collapseRelevantWordsOnStem( relevantWordsFromText );
	sortCombinations( collapsedWords );

	/*
	 * Return the 100 top items from the collapsed and sorted list. The number is picked deliberately to prevent larger
	 * articles from getting too long of lists.
	 */
	return take( getRelevantCombinationsForInsights( collapsedWords ), 20 );
}


export default relevantWords;
