import { escapeRegExp, get, uniq } from "lodash-es";
import flattenDeep from "lodash-es/flattenDeep";
import filterFunctionWordsFromArray from "../helpers/filterFunctionWordsFromArray";
import getLanguage from "../helpers/getLanguage";
import retrieveStemmer from "../helpers/retrieveStemmer";

import getWords from "../stringProcessing/getWords";
import parseSlug from "../stringProcessing/parseSlug";
import { normalizeSingle } from "../stringProcessing/quotes";
import { collectStems } from "./buildTopicStems";

/**
 * A stem with accompanying forms.
 *
 * @param {string}      stem    The word stem.
 * @param {string[]}    forms   The word forms for the stem.
 *
 * @constructor
 */
function StemWithForms( stem, forms ) {
	this.stem = stem;
	this.forms = forms;
}

/**
 * A result for all topic forms.
 *
 * @param {string[]}    keyphraseForms  All keyphrase forms.
 * @param {Array<string[]>[]}    synonymsForms   All synonym forms.
 * @constructor
 */
function Result( keyphraseForms = [], synonymsForms = [] ) {
	this.keyphraseForms = keyphraseForms;
	this.synonymsForms = synonymsForms;
}

/**
 * Gets all words found in the text, title, slug and meta description of a given paper.
 *
 * @param {Paper} paper     The paper for which to get the words.
 * @param {string} language The language of the paper.
 *
 * @returns {string[]} All words found.
 */
function getAllWordsFromPaper( paper, language ) {
	const paperContent = [
		paper.getText(),
		paper.getTitle(),
		parseSlug( paper.getUrl() ),
		paper.getDescription(),
	].join( " " );

	return getWords( paperContent ).map(
		word => normalizeSingle( escapeRegExp( word.toLocaleLowerCase( language ) ) ) );
}

/**
 * Takes a stem-original pair and returns the accompanying forms for the stem that were found in the paper. Additionally
 * adds a sanitized version of the original word.
 *
 * @param {StemOriginalPair}    stemOriginalPair            The stem-original pair for which to get forms.
 * @param {StemWithForms[]}     paperWordsGroupedByStems    All word forms in the paper grouped by stem.
 * @param {string}              language                    The language for which to get forms.
 *
 * @returns {string[]} All forms found in the paper for the given stem, plus a sanitized version of the original word.
 */
function replaceStemWithForms( stemOriginalPair, paperWordsGroupedByStems, language ) {
	const matchingStemFormPair = paperWordsGroupedByStems.find( element => element.stem === stemOriginalPair.stem );
	const originalSanitized = normalizeSingle( escapeRegExp( stemOriginalPair.original.toLocaleLowerCase( language ) ) );

	// Return original and found forms or only original if no matching forms were found in the text.
	return matchingStemFormPair
		? uniq( [ originalSanitized, ...matchingStemFormPair.forms ] )
		: [ originalSanitized ];
}

/**
 * Extracts the stems from all keyphrase and synonym stems.
 *
 * @param {TopicPhrase}   keyphrase  A topic phrase.
 * @param {TopicPhrase[]} synonyms   An array of topic phrases.
 *
 * @returns {string[]} All word stems of they keyphrase and synonyms.
 */
function extractStems( keyphrase, synonyms ) {
	const keyphraseStemsOnly = keyphrase.stemOriginalPairs.length === 0
		? []
		: keyphrase.getStems();

	const synonymsStemsOnly = synonyms.length === 0
		? []
		: synonyms.map( topicPhrase => topicPhrase.getStems() );

	return ( [ ...keyphraseStemsOnly, ...flattenDeep( synonymsStemsOnly ) ] );
}

/**
 * Constructs the result with forms for a topic phrase (i.e., a keyphrase or a synonym).
 *
 * @param {TopicPhrase}     topicPhrase                 The topic phrase for which to construct the result.
 * @param {StemWithForms[]} paperWordsGroupedByStems    All word forms in the paper grouped by stem.
 * @param {string}          language                    The language of the paper.
 *
 * @returns {Array.<string[]>} The word forms for a given topic phrase, grouped by original topic phrase word.
 */
function constructTopicPhraseResult( topicPhrase, paperWordsGroupedByStems, language ) {
	// Empty result for an empty topic phrase.
	if ( topicPhrase.length === 0 ) {
		return [];
	}

	if ( topicPhrase.exactMatch ) {
		return [ [ topicPhrase.stemOriginalPairs[ 0 ].stem ] ];
	}

	return topicPhrase.stemOriginalPairs.map( function( stemOriginalPair ) {
		return replaceStemWithForms( stemOriginalPair, paperWordsGroupedByStems, language );
	} );
}

/**
 * Gets all word forms from a paper for the stems of the keyphrase and synonyms.
 *
 * @param {Paper}       paper       The paper to build keyphrase and synonym forms for.
 * @param {Researcher}  researcher  The researcher.
 *
 * @returns {Object} Object with an array of keyphrase forms and an array of arrays of synonyms forms, based on the forms
 * found in the text.
 */
function getWordFormsFromText( paper, researcher ) {
	const language = getLanguage( paper.getLocale() );
	const determineStem = retrieveStemmer( language );
	const morphologyData = get( researcher.getData( "morphology" ), language, false );
	const topicPhrases = collectStems( paper.getKeyword(), paper.getSynonyms(), language, morphologyData );
	const keyphrase = topicPhrases.keyphraseStems;
	const synonyms = topicPhrases.synonymsStems;

	// Return an empty result when no keyphrase and synonyms have been set.
	if ( keyphrase.stemOriginalPairs.length === 0 && synonyms.length === 0 ) {
		return new Result();
	}

	// Get all stems from the keyphrase and synonyms.
	const topicStemsFlat = uniq( extractStems( keyphrase, synonyms ) );

	// Get all words from the paper text, title, meta description and slug.
	let paperWords = getAllWordsFromPaper( paper, language );

	// Filter doubles and function words.
	paperWords = filterFunctionWordsFromArray( uniq( paperWords ), language );

	// Add stems to words from the paper and filter out all forms that aren't in the keyphrase or synonyms.
	const paperWordsWithStems = paperWords
		.map( word => [ word, determineStem( word, morphologyData ) ] )
		.filter( wordStemPair => topicStemsFlat.includes( wordStemPair[ 1 ] ) );

	// Group word-stem pairs from the paper by stems.
	const paperWordsGroupedByStems = paperWordsWithStems.reduce( function( accumulator, wordStemPair ) {
		const stem = wordStemPair[ 1 ];
		const form = wordStemPair[ 0 ];

		const matchingStemFormPair = accumulator.find( element => element.stem === stem );
		const matchingStemFormPairIndex = accumulator.findIndex( element => element.stem === stem );

		if ( matchingStemFormPair ) {
			accumulator[ matchingStemFormPairIndex ].forms.push( form );
		} else {
			accumulator.push( new StemWithForms( stem, [ form ] ) );
		}

		return accumulator;
	}, [] );

	return new Result(
		constructTopicPhraseResult( keyphrase, paperWordsGroupedByStems, language ),
		synonyms.map( synonym => constructTopicPhraseResult( synonym, paperWordsGroupedByStems, language ) ) );
}

export default getWordFormsFromText;
