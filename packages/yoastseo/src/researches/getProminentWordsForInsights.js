import { get, take } from "lodash-es";
import getLanguage from "../helpers/getLanguage";
import {
	collapseRelevantWordsOnStem,
	getRelevantCombinations,
	getRelevantWords,
	retrieveAbbreviations,
	sortCombinations,
} from "../stringProcessing/determineProminentWords";

/**
 * Retrieves the relevant words from the given paper.
 *
 * @param {Paper} paper The paper to determine the relevant words of.
 * @param {Researcher} researcher The researcher to use for analysis.
 *
 * @returns {WordCombination[]} Relevant words for this paper, filtered and sorted.
 */
function getProminentWordsForInsights( paper, researcher ) {
	const text = paper.getText();
	const language = getLanguage( paper.getLocale() );
	const morphologyData = get( researcher.getData( "morphology" ), language, false );

	const abbreviations = retrieveAbbreviations( text );

	const relevantWordsFromText = getRelevantWords( text, abbreviations, language, morphologyData );

	const collapsedWords = collapseRelevantWordsOnStem( relevantWordsFromText );
	sortCombinations( collapsedWords );

	/*
	 * Collapse the list of word combinations on stems, sort it, filter out all word combinations that occur less than
	 * 5 times in the text. Return the 20 top items from this list.
	 */
	return take( getRelevantCombinations( collapsedWords, 5 ), 20 );
}

export default getProminentWordsForInsights;
