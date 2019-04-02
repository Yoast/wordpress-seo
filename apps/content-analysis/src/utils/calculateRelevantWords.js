import { get, isEqual, take } from "lodash-es";
import getLanguage from "yoastsrc/helpers/getLanguage";
import getWords from "yoastsrc/stringProcessing/getWords";
import {
	collapseRelevantWordsOnStem,
	getRelevantWords,
	getRelevantWordsFromPaperAttributes,
	getRelevantCombinations,
	sortCombinations,
} from "yoastsrc/stringProcessing/relevantWords";
import { getSubheadingsTopLevel, removeSubheadingsTopLevel } from "yoastsrc/stringProcessing/getSubheadings";
import { retrieveAbbreviations } from "../../../../packages/yoastseo/src/stringProcessing/relevantWords";
import getMorphologyData from "./getMorphologyData";

const morphologyData = getMorphologyData();

// Cache the relevant words.
let previousRelevantWordsInternalLinking = {
	text: "",
	locale: "en_US",
	description: "",
	keyword: "",
	synonyms: "",
	title: "",
	data: {},
};

let previousRelevantWordsInsights = {
	text: "",
	locale: "en_US",
	data: {},
};

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
 * @param {Paper}   paper           The paper to analyse.
 * @param {boolean} useAttributes   Whether text from attributes should also be considered for relevant words.
 *
 * @returns {Object} The relevant word objects.
 */
function calculateRelevantWords( paper, useAttributes ) {
	let text = paper.text;
	const language = getLanguage( paper.locale );
	const languageMorphologyData = get( morphologyData, language, false );

	const subheadings = getSubheadingsTopLevel( text ).map( subheading => subheading[ 2 ] );

	const attributes = useAttributes ? [
		paper.keyword,
		paper.synonyms,
		paper.description,
		paper.title,
		subheadings.join( " " ),
	] : [];

	text = useAttributes ? removeSubheadingsTopLevel( text ) : text;

	const abbreviations = retrieveAbbreviations( text.concat( attributes.join( " " ) ) );

	const relevantWordsFromText = getRelevantWords( text, abbreviations, language, languageMorphologyData );

	let relevantWordsFromPaperAttributes = [];

	if ( useAttributes ) {
		relevantWordsFromPaperAttributes = getRelevantWordsFromPaperAttributes(
			attributes,
			abbreviations,
			language,
			languageMorphologyData
		);

		/*
		 * Analogous to the research src/researches/relevantWords.js, all relevant words that come from paper attributes
		 * (and not from text) get a times-3 number of occurrences to support the idea that they are more important than
		 * the words coming from the text. For instance, if a word occurs twice in paper attributes it receives
		 * number_of_occurrences = 6.
		 */
		relevantWordsFromPaperAttributes.forEach( relevantWord => relevantWord.setOccurrences( relevantWord.getOccurrences() * 3 ) );
	}

	const collapsedWords = collapseRelevantWordsOnStem( relevantWordsFromPaperAttributes.concat( relevantWordsFromText ) );
	sortCombinations( collapsedWords );

	/*
	 * Analogous to the research src/researches/relevantWords.js, we limit the number of relevant words in consideration
	 * to 100, i.e. we take 100 first relevant words from the list sorded by number of occurrences first and then
	 * alphabetically.
	 */
	const relevantWords = take( getRelevantCombinations( collapsedWords ), 100 );

	return relevantWords.map( ( word ) => {
		return {
			word: word.getWord(),
			stem: word.getStem(),
			occurrences: word.getOccurrences(),
		};
	} );
}

/**
 * Retrieves the relevant words for Internal linking. Uses cached version when possible.
 *
 * @param {Paper} paper   The paper to get relevant words for.
 *
 * @returns {Object} The relevant words.
 */
export function relevantWordsForInternalLinking( paper ) {
	const text = paper.text;
	const locale = paper.locale;
	const description = paper.description;
	const keyword = paper.keyword;
	const synonyms = paper.synonyms;
	const title = paper.title;

	if (
		! isEqual( text, previousRelevantWordsInternalLinking.text ) ||
		! isEqual( locale, previousRelevantWordsInternalLinking.locale ) ||
		! isEqual( description, previousRelevantWordsInternalLinking.description ) ||
		! isEqual( keyword, previousRelevantWordsInternalLinking.keyword ) ||
		! isEqual( synonyms, previousRelevantWordsInternalLinking.synonyms ) ||
		! isEqual( title, previousRelevantWordsInternalLinking.title )
	) {
		previousRelevantWordsInternalLinking = {
			text,
			locale,
			description,
			keyword,
			synonyms,
			title,
			data: calculateRelevantWords( paper, true ),
		};
	}
	return previousRelevantWordsInternalLinking.data;
}

/**
 * Retrieves the relevant words for Insights (takes into consideration only the text itself, not attributes).
 * Uses cached version when possible.
 *
 * @param {Paper} paper   The paper to get relevant words for.
 *
 * @returns {Object} The relevant words.
 */
export function relevantWordsForInsights( paper ) {
	const text = paper.text;
	const locale = paper.locale;

	if (
		! isEqual( text, previousRelevantWordsInsights.text ) ||
		! isEqual( locale, previousRelevantWordsInsights.locale )
	) {
		previousRelevantWordsInsights = {
			text,
			locale,
			data: calculateRelevantWords( paper, false ),
		};
	}
	return previousRelevantWordsInsights.data;
}

