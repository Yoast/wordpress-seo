import { take } from "lodash-es";
import { getRelevantWords, getRelevantWordsFromPaperAttributes } from "../stringProcessing/relevantWords";
import { getSubheadingsTopLevel } from "../stringProcessing/getSubheadings";


/**
 * Retrieves the relevant words from the given paper.
 *
 * @param {Paper} paper The paper to determine the relevant words of.
 * @returns {WordCombination[]} Relevant words for this paper, filtered and sorted.
 */
function relevantWords( paper ) {
	const locale = paper.getLocale();
	const relevantWordsFromText = getRelevantWords( paper.getText(), locale );

	const subheadings = getSubheadingsTopLevel( paper.getText() ).map( subheading => subheading[ 2 ] );

	const attributes = {
		keyphrase: paper.getKeyword(),
		synonyms: paper.getSynonyms(),
		metadescription: paper.getDescription(),
		subheadings,
	};

	const relevantWordsFromPaperAttributes = getRelevantWordsFromPaperAttributes( attributes, locale );

	return take( relevantWordsFromPaperAttributes.concat( relevantWordsFromText ), 100 );
}


export default relevantWords;
