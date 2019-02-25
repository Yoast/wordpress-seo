import { get, take } from "lodash-es";
import getLanguage from "../helpers/getLanguage";
import { getRelevantWords, getRelevantWordsFromPaperAttributes, collapseRelevantWordsOnStem } from "../stringProcessing/relevantWords";
import { getSubheadingsTopLevel } from "../stringProcessing/getSubheadings";

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

	const subheadings = getSubheadingsTopLevel( paper.getText() ).map( subheading => subheading[ 2 ] );

	const attributes = {
		keyphrase: paper.getKeyword(),
		synonyms: paper.getSynonyms(),
		title: paper.getTitle(),
		metadescription: paper.getDescription(),
		subheadings,
	};

	const relevantWordsFromPaperAttributes = getRelevantWordsFromPaperAttributes( attributes, language, morphologyData );

	const collapsedWords = collapseRelevantWordsOnStem( relevantWordsFromPaperAttributes.concat( relevantWordsFromText ) );

	return take( collapsedWords, 100 );
}


export default relevantWords;
