import { take } from "lodash-es";
import {
	collapseProminentWordsOnStem,
	filterProminentWords,
	getProminentWords,
	retrieveAbbreviations,
	sortProminentWords,
} from "../../helpers/prominentWords/determineProminentWords";

let functionWords = [];

/**
 * Retrieves the prominent words from the given paper.
 *
 * @param {Paper} paper             The paper to determine the prominent words of.
 * @param {Researcher} researcher   The researcher to use for analysis.
 * @param {Function} stemmer        The available stemmer function of a language.
 * @param {Array}   funcWords       The available function words.
 * @param {Object}  morphologyData  The available morphology data file.
 *
 * @returns {WordCombination[]} Prominent words for this paper, filtered and sorted.
 */
function getProminentWordsForInsights( paper, researcher, stemmer, funcWords, morphologyData ) {
	functionWords = funcWords;
	const text = paper.getText();

	const abbreviations = retrieveAbbreviations( text );

	const prominentWordsFromText = getProminentWords( text, abbreviations, stemmer, functionWords, morphologyData );

	const collapsedWords = collapseProminentWordsOnStem( prominentWordsFromText );
	sortProminentWords( collapsedWords );

	/*
	 * Collapse the list of prominent words on stems, sort it, filter out all words that occur less than
	 * 5 times in the text. Return the 20 top items from this list.
	 */
	return take( filterProminentWords( collapsedWords, 5 ), 20 );
}

export default getProminentWordsForInsights;
