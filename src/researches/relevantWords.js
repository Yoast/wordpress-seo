import { take } from "lodash-es";
import getLanguage from "../helpers/getLanguage";
import { getRelevantWords, getRelevantWordsFromTopic } from "../stringProcessing/relevantWords";
import { getSubheadingsTopLevel } from "../stringProcessing/getSubheadings";
import functionWordListsFactory from "../helpers/getFunctionWords.js";

const functionWordLists = functionWordListsFactory();

/**
 * Retrieves the relevant words from the given paper.
 *
 * @param {Paper} paper The paper to determine the relevant words of.
 * @returns {WordCombination[]} Relevant words for this paper, filtered and sorted.
 */
function relevantWords( paper ) {
	let language = getLanguage( paper.getLocale() );
	if ( ! functionWordLists.hasOwnProperty( language ) ) {
		language = "en";
	}

	const functionWords = functionWordLists[ language ];

	const relevantWordsFromText = getRelevantWords( paper.getText(), language, functionWords );

	const subheadings = getSubheadingsTopLevel( paper.getText() ).map( subheading => subheading[ 2 ] );

	const relevantWordsFromTopic = getRelevantWordsFromTopic(
		paper.getKeyword(),
		paper.getSynonyms(),
		paper.getDescription(),
		subheadings,
		functionWords.all
	);

	return take( relevantWordsFromTopic.concat( relevantWordsFromText ), 100 );
}


export default relevantWords;
