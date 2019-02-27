import { take } from "lodash-es";
import getLanguage from "yoastsrc/helpers/getLanguage";
import getWords from "yoastsrc/stringProcessing/getWords";
import { getRelevantWords, getRelevantWordsFromPaperAttributes, getRelevantCombinations } from "yoastsrc/stringProcessing/relevantWords";
import { getSubheadingsTopLevel } from "yoastsrc/stringProcessing/getSubheadings";
import getMorphologyData from "./getMorphologyData";

const morphologyData = getMorphologyData();

/**
 * Rounds number to four decimals.
 *
 * @param {number} number The number to be rounded.
 *
 * @returns {number} The rounded number.
 */
function formatNumber( number ) {
	if ( Math.round( number ) === number ) {
		return number;
	}

	return Math.round( number * 10000 ) / 10000;
}

/**
 * Calculates all properties for the relevant word objects.
 *
 * @param {Paper} paper The paper to analyse.
 *
 * @returns {Object} The relevant word objects.
 */
export default function calculateRelevantWords( paper ) {
	const text = paper.text;
	const words = getWords( text );

	const language = getLanguage( paper.locale );
	const relevantWordsFromText = getRelevantWords( text, language, morphologyData );

	const subheadings = getSubheadingsTopLevel( text ).map( subheading => subheading[ 2 ] );

	const relevantWordsFromTopic = getRelevantWordsFromPaperAttributes(
		{
			keyphrase: paper.keyword,
			synonyms: paper.synonyms,
			metadescription: paper.description,
			title: paper.title,
			subheadings,
		},
		language,
		morphologyData,
	);

	const relevantWords = take( getRelevantCombinations( relevantWordsFromTopic.concat( relevantWordsFromText ) ), 100 );

	return relevantWords.map( ( word ) => {
		return {
			word: word.getWord(),
			stem: word.getStem(),
			occurrences: word.getOccurrences(),
		};
	} );
}
