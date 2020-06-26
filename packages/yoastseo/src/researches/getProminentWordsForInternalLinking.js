import { get, take } from "lodash-es";
import getLanguage from "../helpers/getLanguage";
import countWords from "../stringProcessing/countWords";
import {
	collapseProminentWordsOnStem,
	filterProminentWords,
	getProminentWords,
	getProminentWordsFromPaperAttributes,
	retrieveAbbreviations,
	sortProminentWords,
} from "../stringProcessing/determineProminentWords";
import { getSubheadingsTopLevel, removeSubheadingsTopLevel } from "../stringProcessing/getSubheadings";

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
	const text = paper.getText();
	const metadescription = paper.getDescription();
	const title = paper.getTitle();

	const result = {};
	result.hasMetaDescription = metadescription !== "";
	result.hasTitle = title !== "";
	result.prominentWords = [];

	/**
	 * We only want to return suggestions (and spend time calculating prominent words) if the text is at least 300 words
	 * and has a title or a metadescription or if the text is at least 400 words if it has neither.
 	 */
	const textLength = countWords( text );
	if (
		( textLength < 300 ) ||
		( textLength < 400 && ( ! result.hasTitle ) && ( ! result.hasMetaDescription ) )
	) {
		return result;
	}

	const language = getLanguage( paper.getLocale() );
	const morphologyData = get( researcher.getData( "morphology" ), language, false );

	const subheadings = getSubheadingsTopLevel( text ).map( subheading => subheading[ 2 ] );
	const attributes = [
		paper.getKeyword(),
		paper.getSynonyms(),
		title,
		metadescription,
		subheadings.join( " " ),
	];

	const abbreviations = retrieveAbbreviations( text.concat( attributes.join( " " ) ) );

	const prominentWordsFromText = getProminentWords( removeSubheadingsTopLevel( text ), abbreviations, language, morphologyData );

	const prominentWordsFromPaperAttributes = getProminentWordsFromPaperAttributes( attributes, abbreviations, language, morphologyData );

	/*
	 * If a word is used in any of the attributes, its weight is automatically high.
	 * To make sure the word survives weight filters and gets saved in the database, make the number of occurrences times-3.
	 */
	prominentWordsFromPaperAttributes.forEach( relevantWord => relevantWord.setOccurrences( relevantWord.getOccurrences() * 3 ) );

	const collapsedWords = collapseProminentWordsOnStem( prominentWordsFromPaperAttributes.concat( prominentWordsFromText ) );
	sortProminentWords( collapsedWords );

	/*
	 * Return the 100 top items from the collapsed and sorted list. The number is picked deliberately to prevent larger
	 * articles from getting too long of lists.
	 *
	 * Minimum required occurrences set to 4 in order to avoid premature suggestions of words from the paper attributes.
	 * These get a times-3 boost and would therefore be prominent with just 1 occurrence.
	 */
	result.prominentWords = take( filterProminentWords( collapsedWords, 4 ), 100 );

	return result;
}

export default getProminentWordsForInternalLinking;

