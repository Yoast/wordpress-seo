import { take } from "lodash-es";
import countWords from "../helpers/word/countWords";
import {
	collapseProminentWordsOnStem,
	filterProminentWords,
	getProminentWords,
	getProminentWordsFromPaperAttributes,
	retrieveAbbreviations,
	sortProminentWords,
} from "../helpers/prominentWords/determineProminentWords";
import { getSubheadingsTopLevel, removeSubheadingsTopLevel } from "../helpers/html/getSubheadings";
import baseStemmer from "../helpers/morphology/baseStemmer";

/**
 * Retrieves the prominent words from the given paper.
 *
 * @param {Paper}       paper       The paper to determine the prominent words of.
 * @param {Researcher}  researcher  The researcher to use for analysis.
 *
 * @returns {Object}          result                    A compound result object.
 * @returns {ProminentWord[]} result.prominentWords     Prominent words for this paper, filtered and sorted.
 * @returns {boolean}         result.hasMetaDescription Whether the metadescription is available in the input paper.
 * @returns {boolean}         result.hasTitle           Whether the title is available in the input paper.
 */
function getProminentWordsForInternalLinking( paper, researcher ) {
	const functionWords = researcher.getConfig( "functionWords" );
	// An optional custom helper to return custom function to return the stem of a word.
	const customStemmer = researcher.getHelper( "customGetStemmer" );
	const stemmer = customStemmer ? customStemmer( researcher ) : researcher.getHelper( "getStemmer" )( researcher );
	// An optional custom helper to get words from the text.
	const getWordsCustomHelper = researcher.getHelper( "getWordsCustomHelper" );
	// An optional custom helper to count length to use instead of countWords.
	const customCountLength = researcher.getHelper( "customCountLength" );

	const text = paper.getText();
	const metadescription = paper.getDescription();
	const title = paper.getTitle();

	const result = {};
	result.hasMetaDescription = metadescription !== "";
	result.hasTitle = title !== "";
	result.prominentWords = [];

	/**
	 * We only want to return suggestions (and spend time calculating prominent words) if the text is at least 100 words.
	 * And when a customCountLength is available, we only want to return the suggestions if the text has at least 200 characters.
 	 */
	if ( customCountLength ) {
		if ( customCountLength( text ) < 200 ) {
			return result;
		}
	} else if ( countWords( text ) < 100 ) {
		return result;
	}

	const subheadings = getSubheadingsTopLevel( text ).map( subheading => subheading[ 2 ] );
	const attributes = [
		paper.getKeyword(),
		paper.getSynonyms(),
		title,
		metadescription,
		subheadings.join( " " ),
	];

	// If the language has a custom helper to get words from the text, we don't retrieve the abbreviation.
	const abbreviations = getWordsCustomHelper ? [] : retrieveAbbreviations( text.concat( attributes.join( " " ) ) );

	const removedSubheadingText = removeSubheadingsTopLevel( text );
	const prominentWordsFromText = getProminentWords( removedSubheadingText, abbreviations, stemmer, functionWords, getWordsCustomHelper );

	const prominentWordsFromPaperAttributes = getProminentWordsFromPaperAttributes(
		attributes, abbreviations, stemmer, functionWords, getWordsCustomHelper );

	/*
	 * If a word is used in any of the attributes, its weight is automatically high.
	 * To make sure the word survives weight filters and gets saved in the database, make the number of occurrences times-3.
	 */
	prominentWordsFromPaperAttributes.forEach( relevantWord => relevantWord.setOccurrences( relevantWord.getOccurrences() * 3 ) );

	const collapsedWords = collapseProminentWordsOnStem( prominentWordsFromPaperAttributes.concat( prominentWordsFromText ) );
	sortProminentWords( collapsedWords );

	/*
	 * If morphology data are available for a language, the minimum number of occurrences to consider a word to be prominent is 4.
	 * This minimum number was chosen in order to avoid premature suggestions of words from the paper attributes.
	 * These get a times-3 boost and would therefore be prominent with just 1 occurrence.
	 *
	 * If morphology data are not available, and therefore word forms are not recognized, the minimum threshold is lowered to 2.
	 */
	let minimumNumberOfOccurrences = 4;

	if ( stemmer === baseStemmer ) {
		minimumNumberOfOccurrences = 2;
	}

	/*
	 * Return the 100 top items from the collapsed and sorted list. The number is picked deliberately to prevent larger
	 * articles from getting too long of lists.
	 */
	result.prominentWords = take( filterProminentWords( collapsedWords, minimumNumberOfOccurrences ), 100 );

	return result;
}

export default getProminentWordsForInternalLinking;
