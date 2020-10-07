import { escapeRegExp, get, uniq } from "lodash-es";
import flattenDeep from "lodash-es/flattenDeep";
import filterFunctionWordsFromArray from "../../helpers/filterFunctionWordsFromArray";
import getWordFormsFactory from "../../helpers/getBasicWordForms";
import getLanguage from "../../helpers/getLanguage";
import retrieveStemmer from "../../helpers/retrieveStemmer";

import getAlttagContent from "../../helpers/image/getAlttagContent";
import getWords from "../../helpers/word/getWords";
import imageInText from "../../helpers/image/imageInText";
import parseSlug from "../../helpers/url/parseSlug";
import { normalizeSingle } from "../../helpers/sanitize/quotes";
import { collectStems, StemOriginalPair } from "./buildTopicStems";

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
	const paperText = paper.getText();
	const altTagsInText = imageInText( paperText ).map( image => getAlttagContent( image ) );

	const paperContent = [
		paperText,
		paper.getTitle(),
		parseSlug( paper.getUrl() ),
		paper.getDescription(),
		altTagsInText.join( " " ),
	].join( " " );

	return getWords( paperContent ).map(
		word => normalizeSingle( escapeRegExp( word.toLocaleLowerCase( language ) ) ) );
}

/**
 * Takes a stem-original pair and returns the accompanying forms for the stem that were found in the paper. Additionally
 * adds a sanitized version of the original word and (for specific languages) creates basic word forms.
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

	const forms = matchingStemFormPair
		? [ originalSanitized, ...matchingStemFormPair.forms ]
		: [ originalSanitized ];

	// Add extra forms for languages for which we have basic word form support.
	if ( Object.keys( getWordFormsFactory() ).includes( language ) ) {
		const createBasicWordForms = getWordFormsFactory()[ language ];
		forms.push( ...createBasicWordForms( stemOriginalPair.original ) );
	}

	/*
	 * Return original and found or created forms.
	 * Only return original if no matching forms were found in the text and no forms could be created.
	 */
	return uniq( forms );
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
	if ( topicPhrase.stemOriginalPairs.length === 0 ) {
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
 * Gets all matching word forms for the stems of the keyphrase and synonyms. Stems are either colleced from
 * the paper or, for specific languages, directly created.
 *
 * @param {Paper}       paper       The paper to build keyphrase and synonym forms for.
 * @param {Researcher}  researcher  The researcher.
 *
 * @returns {Object} Object with an array of keyphrase forms and an array of arrays of synonyms forms, based on the forms
 * found in the text or created forms.
 */
function getWordForms( paper, researcher ) {
	const language = getLanguage( paper.getLocale() );
	const morphologyData = get( researcher.getData( "morphology" ), language, false );
	const determineStem = retrieveStemmer( language, morphologyData );
	const topicPhrases = collectStems( paper.getKeyword(), paper.getSynonyms(), language, morphologyData );
	const keyphrase = topicPhrases.keyphraseStems;
	const synonyms = topicPhrases.synonymsStems;

	// Return an empty result when no keyphrase and synonyms have been set.
	if ( keyphrase.stemOriginalPairs.length === 0 && synonyms.length === 0 ) {
		return new Result();
	}

	// Return exact match if all topic phrases contain exact match. Forms don't need to be built in that case.
	const allTopicPhrases = [ keyphrase, ...synonyms ];

	if ( allTopicPhrases.every( topicPhrase => topicPhrase.exactMatch === true ) ) {
		return new Result(
			[ [ keyphrase.stemOriginalPairs[ 0 ].stem ] ],
			synonyms.map( synonym => [ [ synonym.stemOriginalPairs[ 0 ].stem ] ]
			)
		);
	}

	// Get all stems from the keyphrase and synonyms.
	const topicStemsFlat = uniq( extractStems( keyphrase, synonyms ) );

	// Get all words from the paper text, title, meta description and slug.
	let paperWords = getAllWordsFromPaper( paper, language );

	// Filter doubles and function words.
	paperWords = filterFunctionWordsFromArray( uniq( paperWords ), language );

	// Add stems to words from the paper, filter out all forms that aren't in the keyphrase or synonyms and order alphabetically.
	const paperWordsWithStems = paperWords
		.map( word => new StemOriginalPair( determineStem( word, morphologyData ), word ) )
		.filter( stemOriginalPair => topicStemsFlat.includes( stemOriginalPair.stem ) )
		.sort( ( a, b ) => a.stem.localeCompare( b.stem ) );

	// Group word-stem pairs from the paper by stems.
	const paperWordsGroupedByStems = paperWordsWithStems.reduce( function( accumulator, stemOriginalPair ) {
		const lastItem = accumulator[ accumulator.length - 1 ];

		if ( accumulator.length === 0 || lastItem.stem !== stemOriginalPair.stem ) {
			accumulator.push( new StemWithForms( stemOriginalPair.stem, [ stemOriginalPair.original ] ) );
		} else {
			lastItem.forms.push( stemOriginalPair.original );
		}

		return accumulator;
	}, [] );

	return new Result(
		constructTopicPhraseResult( keyphrase, paperWordsGroupedByStems, language ),
		synonyms.map( synonym => constructTopicPhraseResult( synonym, paperWordsGroupedByStems, language ) )
	);
}

export default getWordForms;
