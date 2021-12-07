import { isEqual, take } from "lodash-es";
import getLanguage from "yoastseo/src/languageProcessing/helpers/language/getLanguage";
import {
	collapseProminentWordsOnStem,
	filterProminentWords,
	getProminentWords,
	getProminentWordsFromPaperAttributes,
	retrieveAbbreviations,
	sortProminentWords,
} from "yoastseo/src/languageProcessing/helpers/prominentWords/determineProminentWords";
import { getSubheadingsTopLevel, removeSubheadingsTopLevel } from "yoastseo/src/languageProcessing/helpers/html/getSubheadings";
import getMorphologyData from "./getMorphologyData";
import getResearcher from "yoastseo/spec/specHelpers/getResearcher";

// Cache the relevant words.
let previousProminentWordsInternalLinking = {
	text: "",
	locale: "en_US",
	description: "",
	keyword: "",
	synonyms: "",
	title: "",
	data: {},
};

let previousProminentWordsInsights = {
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
 * @param {boolean} internalLinking Whether the paper should be processed as for internal linking (true) or for insights (false).
 *
 * @returns {Object} The relevant word objects.
 */
function calculateProminentWords( paper, internalLinking ) {
	let text = paper.text;
	const language = getLanguage( paper.locale );
	const morphologyData = getMorphologyData( language );
	const Researcher = getResearcher( language );
	const languageResearcher = new Researcher( paper );
	// We always provide the morphology data here as the prominent words functionality only available in Premium,
	// Where we can assume that the data is always available in real world situation.
	languageResearcher.addResearchData( "morphology", morphologyData );

	const functionWords = languageResearcher.getConfig( "functionWords" );
	// An optional custom helper to return custom function to return the stem of a word.
	const customStemmer = languageResearcher.getHelper( "customGetStemmer" );
	const stemmer = customStemmer ? customStemmer( languageResearcher ) : languageResearcher.getHelper( "getStemmer" )( languageResearcher );
	// An optional custom helper to get words from the text.
	const getWordsCustomHelper = languageResearcher.getHelper( "getWordsCustomHelper" );

	const subheadings = getSubheadingsTopLevel( text ).map( subheading => subheading[ 2 ] );

	const attributes = internalLinking ? [
		paper.keyword,
		paper.synonyms,
		paper.description,
		paper.title,
		subheadings.join( " " ),
	] : [];

	text = internalLinking ? removeSubheadingsTopLevel( text ) : text;

	const abbreviations = getWordsCustomHelper ? [] : retrieveAbbreviations( text.concat( attributes.join( " " ) ) );

	const relevantWordsFromText = internalLinking
		? getProminentWords( removeSubheadingsTopLevel( text ), abbreviations, stemmer, functionWords, getWordsCustomHelper )
		: getProminentWords( text, abbreviations, stemmer, functionWords, getWordsCustomHelper );

	let relevantWordsFromPaperAttributes = [];

	if ( internalLinking ) {
		relevantWordsFromPaperAttributes = getProminentWordsFromPaperAttributes(
			attributes,
			abbreviations,
			stemmer,
			functionWords,
			getWordsCustomHelper,
		);

		/*
		 * Analogous to the research src/researches/relevantWords.js, all relevant words that come from paper attributes
		 * (and not from text) get a times-3 number of occurrences to support the idea that they are more important than
		 * the words coming from the text. For instance, if a word occurs twice in paper attributes it receives
		 * number_of_occurrences = 6.
		 */
		relevantWordsFromPaperAttributes.forEach( relevantWord => relevantWord.setOccurrences( relevantWord.getOccurrences() * 3 ) );
	}

	const collapsedWords = collapseProminentWordsOnStem( relevantWordsFromPaperAttributes.concat( relevantWordsFromText ) );
	sortProminentWords( collapsedWords );

	/*
	 * For Internal linking:
	 * Analogous to the research src/researches/relevantWords.js, we limit the number of relevant words in consideration
	 * to 100, i.e. we take 100 first relevant words from the list sorted by number of occurrences first and then
	 * alphabetically and we only take words that occur 2 or more times.
	 * For Insights:
	 * Analogous to the research src/researches/getProminentWordsForInsights.js, we limit the number of relevant words
	 * in consideration to 20 and we only take words that occur 5 or more times.
	 */
	const relevantWords = internalLinking
		? take( filterProminentWords( collapsedWords, 2 ), 100 )
		: take( filterProminentWords( collapsedWords, 5 ), 20 );

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
// eslint-disable-next-line
export function prominentWordsForInternalLinking( paper ) {
	const text = paper.text;
	const locale = paper.locale;
	const description = paper.description;
	const keyword = paper.keyword;
	const synonyms = paper.synonyms;
	const title = paper.title;

	if (
		! isEqual( text, previousProminentWordsInternalLinking.text ) ||
		! isEqual( locale, previousProminentWordsInternalLinking.locale ) ||
		! isEqual( description, previousProminentWordsInternalLinking.description ) ||
		! isEqual( keyword, previousProminentWordsInternalLinking.keyword ) ||
		! isEqual( synonyms, previousProminentWordsInternalLinking.synonyms ) ||
		! isEqual( title, previousProminentWordsInternalLinking.title )
	) {
		previousProminentWordsInternalLinking = {
			text,
			locale,
			description,
			keyword,
			synonyms,
			title,
			data: calculateProminentWords( paper, true ),
		};
	}
	return previousProminentWordsInternalLinking.data;
}

/**
 * Retrieves the relevant words for Insights (takes into consideration only the text itself, not attributes).
 * Uses cached version when possible.
 *
 * @param {Paper} paper   The paper to get relevant words for.
 *
 * @returns {Object} The relevant words.
 */
export function prominentWordsForInsights( paper ) {
	const text = paper.text;
	const locale = paper.locale;

	if (
		! isEqual( text, previousProminentWordsInsights.text ) ||
		! isEqual( locale, previousProminentWordsInsights.locale )
	) {
		previousProminentWordsInsights = {
			text,
			locale,
			data: calculateProminentWords( paper, false ),
		};
	}
	return previousProminentWordsInsights.data;
}

