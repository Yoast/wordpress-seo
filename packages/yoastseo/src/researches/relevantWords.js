import { get, take } from "lodash-es";
import getLanguage from "../helpers/getLanguage";
import {
	collapseRelevantWordsOnStem,
	getRelevantCombinations,
	getRelevantWords,
	getRelevantWordsFromPaperAttributes,
	retrieveAbbreviations,
	sortCombinations,
} from "../stringProcessing/relevantWords";
import { getSubheadingsTopLevel, removeSubheadingsTopLevel } from "../stringProcessing/getSubheadings";

/**
 * Retrieves the relevant words from the given paper.
 *
 * @param {Paper} paper The paper to determine the relevant words of.
 * @param {Researcher} researcher The researcher to use for analysis.
 *
 * @returns {WordCombination[]} Relevant words for this paper, filtered and sorted.
 */
function relevantWords( paper, researcher ) {
	const text = paper.getText();
	const language = getLanguage( paper.getLocale() );
	const morphologyData = get( researcher.getData( "morphology" ), language, false );

	const subheadings = getSubheadingsTopLevel( text ).map( subheading => subheading[ 2 ] );
	const attributes = [
		paper.getKeyword(),
		paper.getSynonyms(),
		paper.getTitle(),
		paper.getDescription(),
		subheadings.join( " " ),
	];

	const abbreviations = retrieveAbbreviations( text.concat( attributes.join( " " ) ) );

	const relevantWordsFromText = getRelevantWords( removeSubheadingsTopLevel( text ), abbreviations, language, morphologyData );

	const relevantWordsFromPaperAttributes = getRelevantWordsFromPaperAttributes( attributes, abbreviations, language, morphologyData );

	/*
	 * If a word is used in any of the attributes, its relevance is automatically high.
	 * To make sure the word survives relevance filters and gets saved in the database, make the number of occurrences times-3.
	 */
	relevantWordsFromPaperAttributes.forEach( relevantWord => relevantWord.setOccurrences( relevantWord.getOccurrences() * 3 ) );

	const collapsedWords = collapseRelevantWordsOnStem( relevantWordsFromPaperAttributes.concat( relevantWordsFromText ) );
	sortCombinations( collapsedWords );

	/*
	 * Return the 100 top items from the collapsed and sorted list. The number is picked deliberately to prevent larger
	 * articles from getting too long of lists.
	 */
	return take( getRelevantCombinations( collapsedWords, 2 ), 100 );
}


export default relevantWords;
