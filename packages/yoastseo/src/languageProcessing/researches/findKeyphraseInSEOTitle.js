import { escapeRegExp, filter, includes, isEmpty } from "lodash-es";

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
	const titleBeforeKeyword = title.substr( 0, position );
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
 * Finds the exact match of the keyphrase in the SEO title for languages that have prefixed function words.
 *
 * @param {object} matchesObject The matches object containing the array of matched words and the position of the match.
 * @param {string} keyword The keyword to find in the SEO title.
 * @param {object} result The result object to store the results in.
 * @param {RegExp} prefixedFunctionWordsRegex The function to stem the prefixed function words.
 * @returns {object} The new result object containing the results of the analysis.
 */
function findExactMatch( matchesObject, keyword, result, prefixedFunctionWordsRegex ) {
	const matchedKeywordStems = [];
	const matchedKeywordPrefixes = [];
	matchesObject.matches.forEach( match => {
		const { stem, prefix } = stemPrefixedFunctionWords( match, prefixedFunctionWordsRegex );
		matchedKeywordStems.push( stem );
		matchedKeywordPrefixes.push( prefix );
	} );

	/*
	 We consider a match an exact match if:
	 1. The matched stems are equal to the keyword.
		This is to make sure for example that the keyword "חתול חמוד" is not matched with "החתולים החמודים"
		in the title "החתולים החמודים" in Hebrew,
		or the keyword "جدول" is not matched with "الجدولين" in the title "الجدولين" in Arabic.
	 2. All the matched prefixes are the same.
		For multi-word keyphrases where each word receives "function word" prefix,
		we consider an exact match only if the prefix attached to the all words are the same.
		For example, we recognize an exact match between the keyphrase "חתול חמוד" and the title "החתול החמוד" in Hebrew, or
		between the keyphrase "منزل كبير" and the title "المنزل الكبير" in Arabic.
	 	Because In Arabic and Hebrew, when the adjective directly follows the definite noun,
	 	both the noun and the adjective take the definite article.
	 */
	if ( matchedKeywordStems.join( " " ) === keyword ) {
		for ( const prefix of matchedKeywordPrefixes ) {
			if ( prefix !== matchedKeywordPrefixes[ 0 ] && prefix !== "" ) {
				result.exactMatchFound = false;
				break;
			} else {
				result.exactMatchFound = true;
			}
		}
		if ( matchesObject.position === 0 ) {
			result.position = 0;
		}
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
 * @param {string} title The SEO title of the paper.
 * @param {string} keyword The keyphrase of the paper.
 * @param {string} locale The locale of the paper.
 * @param {object} result The result object to store the results in.
 * @param {Researcher} researcher The researcher to use for analysis.
 * @returns {object} The new result object containing the results of the analysis.
 */
function checkIfAllWordsAreFound( title, keyword, locale, result, researcher ) {
	const topicForms = researcher.getResearch( "morphology" );

	// Use only keyphrase (not the synonyms) to match topic words in the SEO title.
	const useSynonyms = false;

	const separateWordsMatched = findTopicFormsInString( topicForms, title, useSynonyms, locale, false );

	if ( separateWordsMatched.percentWordMatches === 100 ) {
		const prefixedFunctionWordsRegex = researcher.getConfig( "prefixedFunctionWordsRegex" );
		/*
		If all words are found and the position of the found words is 0, we further check if the exact match is found
		for languages with a helper to stem basic prefixes.
		Currently, we define "languages with a helper to stem basic prefixes" as languages that receive function words as prefixes,
		instead of as a separate word. This is the case for Arabic and Hebrew.
		For example, in Arabic, the word "المنزل" (the house) is written as "ال" (the) + "منزل" (house).
		In the above case, when the keyphrase is "منزل", and the SEO title starts with "المنزل", we want to consider this as an exact match
		and the position of the found keyphrase is 0.
		 */
		if ( separateWordsMatched.position === 0 && prefixedFunctionWordsRegex ) {
			const { exactMatchFound, position } = findExactMatch( separateWordsMatched, keyword, result, prefixedFunctionWordsRegex );
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
 * @param {Object} paper 			The paper containing SEO title and keyword.
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
	const keywordMatched = wordMatch( title, keyword, locale, false );

	if ( keywordMatched.count > 0 ) {
		result.exactMatchFound = true;
		result.allWordsFound = true;
		result.position = adjustPosition( title, keywordMatched.position );

		return result;
	}

	result = checkIfAllWordsAreFound( title, keyword, locale, result, researcher );

	return result;
};

export default findKeyphraseInSEOTitle;
