import { get, take } from "lodash-es";
import getLanguage from "../../helpers/getLanguage";
import {
	collapseProminentWordsOnStem,
	filterProminentWords,
	getProminentWords,
	retrieveAbbreviations,
	sortProminentWords,
} from "../helpers/determineProminentWords";

/**
 * Retrieves the prominent words from the given paper.
 *
 * @param {Paper} paper The paper to determine the prominent words of.
 * @param {Researcher} researcher The researcher to use for analysis.
 *
 * @returns {WordCombination[]} Prominent words for this paper, filtered and sorted.
 */
function getProminentWordsForInsights( paper, researcher ) {
	const text = paper.getText();
	const language = getLanguage( paper.getLocale() );
	const morphologyData = get( researcher.getData( "morphology" ), language, false );

	const abbreviations = retrieveAbbreviations( text );

	const prominentWordsFromText = getProminentWords( text, abbreviations, language, morphologyData );

	const collapsedWords = collapseProminentWordsOnStem( prominentWordsFromText );
	sortProminentWords( collapsedWords );

	/*
	 * Collapse the list of prominent words on stems, sort it, filter out all words that occur less than
	 * 5 times in the text. Return the 20 top items from this list.
	 */
	return take( filterProminentWords( collapsedWords, 5 ), 20 );
}

export default getProminentWordsForInsights;
