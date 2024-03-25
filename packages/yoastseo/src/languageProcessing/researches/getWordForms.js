import { normalizeSingle } from "../helpers/sanitize/quotes";
import { collectStems, StemOriginalPair } from "../helpers/morphology/buildTopicStems";

import { escapeRegExp, flattenDeep } from "lodash";
import getAllWordsFromPaper from "../helpers/morphology/getAllWordsFromPaper";
import parseSynonyms from "../helpers/sanitize/parseSynonyms";

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
 * @param {Array[]} keyphraseForms  All keyphrase forms.
 * @param {Array[]} synonymsForms   All synonym forms.
 * @constructor
 */
function Result( keyphraseForms = [], synonymsForms = [] ) {
	this.keyphraseForms = keyphraseForms;
	this.synonymsForms = synonymsForms;
}

/**
 * Takes a stem-original pair and returns the accompanying forms for the stem that were found in the paper. Additionally
 * adds a sanitized version of the original word and (for specific languages) creates basic word forms.
 *
 * @param {StemOriginalPair}    stemOriginalPair            The stem-original pair for which to get forms.
 * @param {StemWithForms[]}     paperWordsGroupedByStems    All word forms in the paper grouped by stem.
 * @param {Function|null}       createBasicWordForms        A function to create basic word forms (if available).
 *
 * @returns {string[]} All forms found in the paper for the given stem, plus a sanitized version of the original word.
 */
function replaceStemWithForms( stemOriginalPair, paperWordsGroupedByStems, createBasicWordForms ) {
	const matchingStemFormPair = paperWordsGroupedByStems.find( element => element.stem === stemOriginalPair.stem );
	const originalSanitized = normalizeSingle( escapeRegExp( stemOriginalPair.original ) );

	const forms = matchingStemFormPair
		? [ originalSanitized, ...matchingStemFormPair.forms ]
		: [ originalSanitized ];

	// Add extra forms for languages for which we have basic word form support.
	if ( createBasicWordForms ) {
		forms.push( ...createBasicWordForms( stemOriginalPair.original ) );
	}

	/*
	 * Return original and found or created forms.
	 * Only return original if no matching forms were found in the text and no forms could be created.
	 */
	return [ ... new Set( forms ) ];
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
 * @param {TopicPhrase}     topicPhrase              The topic phrase for which to construct the result.
 * @param {StemWithForms[]} paperWordsGroupedByStems All word forms in the paper grouped by stem.
 * @param {Function|null}   createBasicWordForms     A function to create basic word forms (if available).
 *
 * @returns {Array.<string[]>} The word forms for a given topic phrase, grouped by original topic phrase word.
 */
function constructTopicPhraseResult( topicPhrase, paperWordsGroupedByStems, createBasicWordForms ) {
	// Empty result for an empty topic phrase.
	if ( topicPhrase.stemOriginalPairs.length === 0 ) {
		return [];
	}

	if ( topicPhrase.exactMatch ) {
		return [ [ topicPhrase.stemOriginalPairs[ 0 ].stem ] ];
	}

	return topicPhrase.stemOriginalPairs.map( function( stemOriginalPair ) {
		return replaceStemWithForms( stemOriginalPair, paperWordsGroupedByStems, createBasicWordForms );
	} );
}

/**
 * Gets all matching word forms for the keyphrase and synonyms. Stems are either collected from
 * the paper or, for specific languages, directly created.
 *
 * @param {string}          keyphrase               	The keyphrase.
 * @param {string[]}        synonyms                	The synonyms.
 * @param {string[]}        allWordsFromPaper       	All words found in the paper.
 * @param {string[]}        functionWords           	The function words for a given language (if available).
 * @param {Function|null}   stemmer                 	A stemmer (if available).
 * @param {Function|null}   createBasicWordForms    	A function to create basic word forms (if available).
 * @param {boolean}   		areHyphensWordBoundaries	Whether hyphens should be treated as word boundaries.

 * @returns {Object} Object with an array of keyphrase forms and an array of arrays of synonyms forms, based on the forms
 * found in the text or created forms.
 */
function getWordForms( keyphrase, synonyms, allWordsFromPaper, functionWords, stemmer, createBasicWordForms, areHyphensWordBoundaries ) {
	const topicPhrases     = collectStems( keyphrase, synonyms, stemmer, functionWords, areHyphensWordBoundaries );
	const keyphraseStemmed = topicPhrases.keyphraseStems;
	const synonymsStemmed  = topicPhrases.synonymsStems;

	// Return an empty result when no keyphrase and synonyms have been set.
	if ( keyphraseStemmed.stemOriginalPairs.length === 0 && synonymsStemmed.length === 0 ) {
		return new Result();
	}

	// Return exact match if all topic phrases contain exact match. Forms don't need to be built in that case.
	const allTopicPhrases = [ keyphraseStemmed, ...synonymsStemmed ];

	if ( allTopicPhrases.every( topicPhrase => topicPhrase.exactMatch === true ) ) {
		return new Result(
			[ [ keyphraseStemmed.stemOriginalPairs[ 0 ].stem ] ],
			synonymsStemmed.map( synonym => [ [ synonym.stemOriginalPairs[ 0 ].stem ] ]
			)
		);
	}

	// Get all stems from the keyphrase and synonyms.
	const topicStemsFlat = [ ... new Set( extractStems( keyphraseStemmed, synonymsStemmed ) ) ];

	/*
	 * Get all words from the paper text, title, meta description and slug.
	 * Filter duplicates and function words.
	 */
	const paperWords = [ ... new Set( allWordsFromPaper.filter( word => ! functionWords.includes( word ) ) ) ];

	// Add stems to words from the paper, filter out all forms that aren't in the keyphrase or synonyms and order alphabetically.
	const paperWordsWithStems = paperWords
		.map( word => new StemOriginalPair( stemmer( word ), word ) )
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
		constructTopicPhraseResult( keyphraseStemmed, paperWordsGroupedByStems, createBasicWordForms ),
		synonymsStemmed.map( synonym => constructTopicPhraseResult( synonym, paperWordsGroupedByStems, createBasicWordForms ) )
	);
}

/**
 * Gets all matching word forms for the keyphrase and synonyms.
 *
 * @param {Paper}       paper       	The paper.
 * @param {Researcher}  researcher  	The researcher.
 *
 * @returns {Object} Object with an array of keyphrase forms and an array of arrays of synonyms forms, based on the forms
 * found in the text or created forms.
 */
export default function( paper, researcher ) {
	const functionWords = researcher.getConfig( "functionWords" );
	const stemmer = researcher.getHelper( "getStemmer" )( researcher );
	const createBasicWordForms = researcher.getHelper( "createBasicWordForms" );
	const language = researcher.getConfig( "language" );
	/*
	 * Whether we want to split words on hyphens depends on the language.
	 * In all languages apart from Indonesian, we consider hyphens as word boundaries. But in Indonesian, hyphens are used
	 * to form plural forms of nouns, e.g. 'buku' is the singular form for 'book' and 'buku-buku' is the plural form.
	 * This is why we don't split words on hyphens in Indonesian and we consider 'buku-buku' as one word rather than two.
	 */
	const areHyphensWordBoundaries = researcher.getConfig( "areHyphensWordBoundaries" );

	const allWordsFromPaper = getAllWordsFromPaper( paper, areHyphensWordBoundaries ).map( word => word.toLocaleLowerCase( language ) );
	const keyphrase = paper.getKeyword().toLocaleLowerCase( language ).trim();
	const synonyms = parseSynonyms( paper.getSynonyms().toLocaleLowerCase( language ).trim() );

	return getWordForms( keyphrase, synonyms, allWordsFromPaper, functionWords, stemmer, createBasicWordForms, areHyphensWordBoundaries );
}
