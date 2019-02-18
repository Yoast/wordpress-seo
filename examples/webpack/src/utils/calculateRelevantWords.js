import { take } from "lodash-es";
import getWords from "yoastsrc/stringProcessing/getWords";
import { getRelevantWords, getRelevantWordsFromPaperAttributes } from "yoastsrc/stringProcessing/relevantWords";
import { getSubheadingsTopLevel } from "yoastsrc/stringProcessing/getSubheadings";
import WordCombination from "yoastsrc/values/WordCombination";

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

	const locale = paper.locale;
	const relevantWordsFromText = getRelevantWords( text, locale );

	const subheadings = getSubheadingsTopLevel( text ).map( subheading => subheading[ 2 ] );

	const relevantWordsFromTopic = getRelevantWordsFromPaperAttributes(
		{
			keyphrase: paper.keyword,
			synonyms: paper.synonyms,
			metadescription: paper.description,
			title: paper.title,
			subheadings,
		},
		locale,
	);

	const relevantWords = take( relevantWordsFromTopic.concat( relevantWordsFromText ), 100 );

	return relevantWords.map( ( word ) => {
		const output = {
			word: word.getCombination(),
			relevance: formatNumber( word.getRelevance() ),
			length: word._length,
			occurrences: word.getOccurrences(),
			multiplier: formatNumber( word.getMultiplier( word.getRelevantWordPercentage() ) ),
			relevantWordPercentage: formatNumber( word.getRelevantWordPercentage() ),
		};

		output.lengthBonus = word._length === 1 ? "" : WordCombination.lengthBonus[ word._length ];
		output.density = formatNumber( word.getDensity( words.length ) );

		return output;
	} );
}
