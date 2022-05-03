import { take } from "lodash-es";
import {
	collapseProminentWordsOnStem,
	filterProminentWords,
	getProminentWords,
	retrieveAbbreviations,
	sortProminentWords,
} from "../helpers/prominentWords/determineProminentWords";

/**
 * Retrieves the prominent words from the given paper.
 *
 * @param {Paper} paper             The paper to determine the prominent words of.
 * @param {Researcher} researcher   The researcher to use for analysis.
 *
 * @returns {WordCombination[]} Prominent words for this paper, filtered and sorted.
 */
function getProminentWordsForInsights( paper, researcher ) {
	const functionWords = researcher.getConfig( "functionWords" );
	// An optional custom helper to return custom function to return the stem of a word.
	const customStemmer = researcher.getHelper( "customGetStemmer" );
	const stemmer = customStemmer ? customStemmer( researcher ) : researcher.getHelper( "getStemmer" )( researcher );
	// An optional custom helper to get words from the text.
	const getWordsCustomHelper = researcher.getHelper( "getWordsCustomHelper" );

	const text = paper.getText();

	// If the language has a custom helper to get words from the text, we don't retrieve the abbreviation.
	const abbreviations = getWordsCustomHelper ? [] : retrieveAbbreviations( text );

	const prominentWordsFromText = getProminentWords( text, abbreviations, stemmer, functionWords, getWordsCustomHelper );

	const collapsedWords = collapseProminentWordsOnStem( prominentWordsFromText );
	sortProminentWords( collapsedWords );

	/*
	 * Collapse the list of prominent words on stems, sort it, filter out all words that occur less than
	 * 5 times in the text. Return the 20 top items from this list.
	 */
	return take( filterProminentWords( collapsedWords, 5 ), 20 );
}

export default getProminentWordsForInsights;
