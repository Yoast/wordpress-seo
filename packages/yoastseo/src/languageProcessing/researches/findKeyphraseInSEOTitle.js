import { escapeRegExp, filter, includes, isEmpty, uniq } from "lodash";

import wordMatch from "../helpers/match/matchTextWithWord.js";
import { findTopicFormsInString } from "../helpers/match/findKeywordFormsInString.js";
import { stemPrefixedFunctionWords } from "../helpers/morphology/stemPrefixedFunctionWords.js";

import processExactMatchRequest from "../helpers/match/processExactMatchRequest";
import getWords from "../helpers/word/getWords";
import { WORD_BOUNDARY_WITH_HYPHEN } from "../../config/wordBoundariesWithoutPunctuation";

let functionWords = [];

/**
 * Strips all function words from the start of the given string.
 *
 * @param {string} str The string from which to strip the function words.
 *
 * @returns {boolean} Whether the string consists of function words only.
 */
const stripFunctionWordsFromStart = function( str ) {
	str = str.toLocaleLowerCase();

	/*
 	 * We use a word boundary regex that includes whitespaces, en-dashes, and hyphens for all languages.
 	 * This means that when we filter out function words from the beginning of the title, we also filter out words
 	 * separated by hyphens (e.g. 'three-piece'), as well as function words attached to a content word with a hyphen
 	 * (e.g. 'after' in 'after-school).
 	 * In Indonesian we normally don't want to treat hyphens as word boundaries, but in this case it makes sense because
 	 * an Indonesian title can also contain function words seperated by hyphens at the beginning of the title (e.g. 'dua'
 	 * and 'lima' in 'dua-lima ribuan').
 	 * As a downside, single function words containing hyphens (e.g. 'vis-à-vis') won't be filtered out, but we are solving this
 	 * by adding each word from such function words as separate entries in the function words lists.
  	 */
	let titleWords = getWords( str.toLocaleLowerCase(), WORD_BOUNDARY_WITH_HYPHEN );

	// Strip all function words from the start of the string.
	titleWords = filter( titleWords, function( word ) {
		return ( ! includes( functionWords, word.trim().toLocaleLowerCase() ) );
	} );

	return isEmpty( titleWords );
};

/**
 * Checks the position of the keyphrase in the SEO title.
 *
 * @param {string} title 		The SEO title of the paper.
 * @param {number} position 	The position of the keyphrase in the SEO title.
 *
 * @returns {number} Potentially adjusted position of the keyphrase in the SEO title.
 */
const adjustPosition = function( title, position ) {
	// Don't do anything if position is already 0.
	if ( position === 0 ) {
		return position;
	}

	// Don't do anything if no function words exist for this language.
	if ( functionWords.length === 0 ) {
		return position;
	}

	// Strip all function words from the beginning of the SEO title.
	const titleBeforeKeyword = title.substring( 0, position );
	if ( stripFunctionWordsFromStart( titleBeforeKeyword ) ) {
		/*
		 * Return position 0 if there are no words left in the SEO title before the keyword after filtering
		 * the function words (such that "keyword" in "the keyword" is still counted as position 0).
 		 */
		return 0;
	}

	return position;
};

/**
 * Creates a cartesian product of the given arrays using a lazy approach.
 * @param {array} arrays The arrays to create the cartesian product of.
 * @returns {array} The cartesian product of the given arrays.
 */
function* lazyCartesian( ...arrays ) {
	const lengths = arrays.map( arr => arr.length );
	const indices = Array( arrays.length ).fill( 0 );

	while ( true ) {
		yield indices.map( ( index, position ) => arrays[ position ][ index ] );

		let i = arrays.length - 1;
		while ( i >= 0 && ++indices[ i ] === lengths[ i ] ) {
			indices[ i ] = 0;
			i--;
		}
		if ( i < 0 ) {
			break;
		}
	}
}

/**
 * Finds the exact match of the keyphrase in the SEO title for languages that have prefixed function words.
 *
 * @param {object} matchesObject The object that contains an array of matched words of the keyphrase in SEO title and the position of the match.
 * @param {string} keyphrase The keyphrase to find in the SEO title.
 * @param {object} result The result object to store the results in.
 * @param {RegExp} prefixedFunctionWordsRegex The function to stem the prefixed function words.
 * @param {string} title The SEO title of the paper.
 * @param {string} locale The locale of the paper.
 *
 * @returns {object} The new result object containing the results of the analysis.
 */
function findExactMatch( matchesObject, keyphrase, result, prefixedFunctionWordsRegex, title, locale ) {
	// For each matched word of the keyphrase, get the prefixed function word, and remove any duplicates.
	// For example, for the matches array [ "القطط" ,"والوسيمة" ], the `matchedPrefixedFunctionWords` array will be [ "ال", "وال" ].
	// We add an empty string to the array to account for the case where the word is not prefixed.
	const matchedPrefixedFunctionWords = uniq(
		matchesObject.matches.map( match => stemPrefixedFunctionWords( match, prefixedFunctionWordsRegex ).prefix ).concat( [ "" ] )
	);

	// Split the keyphrase into words. For example, the keyphrase "قطط وسيمة" will be split into [ قطط", "وسيمة" ].
	const splitKeyphrase = keyphrase.split( " " );

	// Create an array of arrays, where each array contains word of the keyphrase with function word prefixes attached
	// and the word is present in the SEO title.
	// For example, when the split keyphrase is [ "قطط", "وسيمة" ] and the matchedPrefixedFunctionWords is [ "ال", "وال", "" ],
	// the array would be: [ [ "والقطط","القطط", "قطط" ], [ "والوسيمة" ,"الوسيمة", "وسيمة" ] ].
	const arrays = splitKeyphrase.map(
		word => matchedPrefixedFunctionWords
			.map( prefixedFunctionWord => prefixedFunctionWord + word )
			.filter( keyphraseWord => wordMatch( title, keyphraseWord, locale, false ).count > 0 )
	);

	// Check if any of the arrays is empty, which means that the keyphrase is not found in the SEO title.
	if ( ! arrays.find( array => array.length === 0 ) ) {
		// Loop over the cartesian product (i.e., all possible combinations) of the created arrays.
		// For example, the cartesian product of [ [ "والقطط","القطط", "قطط" ], [ "والوسيمة" ,"الوسيمة", "وسيمة" ] ] will be:
		// ...[ [ "والقطط", "والوسيمة" ], [ "والقطط", "الوسيمة" ], [ "والقطط", "وسيمة" ], [ "القطط", "والوسيمة" ]]
		for ( const variation of lazyCartesian( ...arrays ) ) {
			// Join the keyphrase combination into a string.
			const variationStr = Array.isArray( variation ) ? variation.join( " " ) : variation;

			// Check if the exact match of the keyphrase combination is found in the SEO title.
			const foundMatch = wordMatch( title, variationStr, locale, false );
			if ( foundMatch.count > 0 ) {
				result.exactMatchFound = true;
				// Adjust the position of the matched keyphrase if it's preceded by non-prefixed function words.
				result.position = adjustPosition( title, foundMatch.position );
				break;
			}
		}
	}

	// This check handles the case where the match is found at position 0.
	if ( matchesObject.position === 0 ) {
		result.position = 0;
	}

	return result;
}

/**
 * An object containing the results of the keyphrase in SEO title research.
 *
 * @typedef {Object} 	KeyphraseInSEOTitleResult
 * @property {boolean}	exactMatchFound	Whether the exact match of the keyphrase was found in the SEO title.
 * @property {boolean}	allWordsFound	Whether all content words from the keyphrase were found in the SEO title.
 * @property {number}	position The position of the keyphrase in the SEO title.
 * @property {boolean}	exactMatchKeyphrase Whether the exact match was requested.
 */

/**
 * Checks if all content words from the keyphrase are found in the SEO title.
 *
 * @param {Paper} paper The Paper object that contains analysis data.
 * @param {Researcher} researcher The language researcher.
 * @param {string} keyword The keyword to find in the SEO title.
 * @param {object} result The result object to store the results in.
 * @param {RegExp} prefixedFunctionWordsRegex The researcher to use for analysis.
 * @returns {object} The new result object containing the results of the analysis.
 */
function checkIfAllWordsAreFound( paper, researcher, keyword, result, prefixedFunctionWordsRegex ) {
	const title = paper.getTitle();
	const locale = paper.getLocale();
	const topicForms = researcher.getResearch( "morphology" );

	// Use only keyphrase (not the synonyms) to match topic words in the SEO title.
	const useSynonyms = false;

	const separateWordsMatched = findTopicFormsInString( topicForms, title, useSynonyms, locale, false );

	if ( separateWordsMatched.percentWordMatches === 100 ) {
		/*
		If all words are found and the position of the found words is 0, we further check if the exact match is found
		for languages with a helper to stem prefixed function words, e.g. definite article.
		Our support for this type of language is currently only for Arabic and Hebrew.
		For example, in Arabic, the word "المنزل" (the house) is written as "ال" (the) + "منزل" (house).
		And in Hebrew, the word "הבית" (the house) is written as "ה" (the) + "בית" (house).
		In the above case, when the keyphrase is "منزل", and the SEO title starts with "المنزل" in Arabic,
		or when the keyphrase is "בית" and the SEO title is "הבית", we want to consider this as an exact match
		and the position is 0 if it's found in the beginning of the SEO title.
		This treatment is to align with the way we match the keyphrase in SEO title for other languages.
		For example, in English, the keyphrase "house" is considered to be found in the SEO title "the house" at position 0.
		 */
		if ( prefixedFunctionWordsRegex ) {
			const {
				exactMatchFound,
				position,
			} = findExactMatch( separateWordsMatched, keyword, result, prefixedFunctionWordsRegex, title, locale );
			result = {
				...result,
				exactMatchFound: exactMatchFound,
				position: position,
			};
		}
		result.allWordsFound = true;
	}
	return result;
}

/**
 * Counts the occurrences of the keyword in the SEO title. Returns the result that contains information on
 * (1) whether the exact match of the keyphrase was used in the SEO title,
 * (2) whether all (content) words from the keyphrase were found in the SEO title,
 * (3) at which position the exact match was found in the SEO title.
 *
 * @param {Paper} paper 			The paper containing SEO title and keyword.
 * @param {Researcher} researcher 	The researcher to use for analysis.
 *
 * @returns {KeyphraseInSEOTitleResult} An object containing the information on whether the keyphrase was matched in the SEO title and how.
 */
const findKeyphraseInSEOTitle = function( paper, researcher ) {
	functionWords = researcher.getConfig( "functionWords" );

	let keyword = escapeRegExp( paper.getKeyword() );
	const title = paper.getTitle();
	const locale = paper.getLocale();

	let result = { exactMatchFound: false, allWordsFound: false, position: -1, exactMatchKeyphrase: false  };

	// Check if the keyphrase is enclosed in double quotation marks to ensure that only exact matches are processed.
	const exactMatchRequest = processExactMatchRequest( keyword );

	if ( exactMatchRequest.exactMatchRequested ) {
		keyword = exactMatchRequest.keyphrase;
		result.exactMatchKeyphrase = true;
	}

	// Check if the exact match of the keyphrase is found in the SEO title.
	const prefixedFunctionWordsRegex = researcher.getConfig( "prefixedFunctionWordsRegex" );
	const keywordMatched = wordMatch( title, keyword, locale, false );

	if ( keywordMatched.count > 0 && ! prefixedFunctionWordsRegex ) {
		result.exactMatchFound = true;
		result.allWordsFound = true;
		result.position = adjustPosition( title, keywordMatched.position );

		return result;
	}

	result = checkIfAllWordsAreFound( paper, researcher, keyword, result, prefixedFunctionWordsRegex );

	return result;
};

export default findKeyphraseInSEOTitle;
