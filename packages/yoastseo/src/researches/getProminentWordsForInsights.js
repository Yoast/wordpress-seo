import { get, take } from "lodash-es";
import getLanguage from "../helpers/getLanguage";
import {
	getRelevantWords,
	collapseRelevantWordsOnStem,
	getRelevantCombinations,
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
export default function( paper, researcher ) {
	const language = getLanguage( paper.getLocale() );
	const morphologyData = get( researcher.getData( "morphology" ), language, false );

	const relevantWordsFromText = getRelevantWords( paper.getText(), language, morphologyData );

	const collapsedWords = collapseRelevantWordsOnStem( relevantWordsFromText );
	sortCombinations( collapsedWords );

	/*
	 * Collapse the list of word combinations on stems, sort it, filter out all word combinations that occur less than
	 * 5 times in the text. Return the 20 top items from this list.
	 */
	return take( getRelevantCombinations( collapsedWords, 5 ), 20 );
}
