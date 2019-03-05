import { get, take } from "lodash-es";
import getLanguage from "../helpers/getLanguage";
import {
	getRelevantWords,
	getRelevantWordsFromPaperAttributes,
	collapseRelevantWordsOnStem,
	getRelevantCombinations, sortCombinations,
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
	const language = getLanguage( paper.getLocale() );
	const morphologyData = get( researcher.getData( "morphology" ), language, false );

	const relevantWordsFromText = getRelevantWords( removeSubheadingsTopLevel( paper.getText() ), language, morphologyData );

	const subheadings = getSubheadingsTopLevel( paper.getText() ).map( subheading => subheading[ 2 ] );

	const attributes = {
		keyphrase: paper.getKeyword(),
		synonyms: paper.getSynonyms(),
		title: paper.getTitle(),
		metadescription: paper.getDescription(),
		subheadings,
	};

	const relevantWordsFromPaperAttributes = getRelevantWordsFromPaperAttributes( attributes, language, morphologyData );

	/* If a word is used in any of the attributes, its relevance is automatically high.
	To make sure the word survives relevance filters and gets saved in the database, make the number of occurrences times-3.*/
	relevantWordsFromPaperAttributes.forEach( relevantWord => relevantWord.setOccurrences( relevantWord.getOccurrences() * 3 ) );

	const collapsedWords = collapseRelevantWordsOnStem( relevantWordsFromPaperAttributes.concat( relevantWordsFromText ) );
	sortCombinations( collapsedWords );

	return take( getRelevantCombinations( collapsedWords ), 100 );
}


export default relevantWords;
