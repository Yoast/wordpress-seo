import { isEmpty, uniq } from "lodash";

import getImagesInScope from "../helpers/image/getImagesInScope";
import getAltAttribute from "../helpers/image/getAltAttribute";
import getImageIdentifier from "../helpers/image/getImageIdentifier";
import matchWords from "../helpers/match/matchTextWithArray";
import matchTextWithTransliteration from "../helpers/match/matchTextWithTransliteration";
import processExactMatchRequest from "../helpers/match/processExactMatchRequest";
import getSentences from "../helpers/sentence/getSentences";
import splitIntoTokens from "../helpers/word/splitIntoTokens";

/**
 * @typedef {import("../AbstractResearcher").default } Researcher
 * @typedef {import("../../values/").Paper } Paper
 */

/**
 * The number of keyphrase and synonym occurrences in the alt text of one image.
 *
 * @typedef {Object} AltTextKeyphraseCount
 * @property {string|number} identifier The identifier of the image, see `getImageIdentifier`.
 * @property {number}        count      The number of full keyphrase and synonym matches in its alt text.
 */

/**
 * A token of an alt text sentence, and whether an earlier match already used it.
 *
 * @typedef {Object} AltTextToken
 * @property {string}  text The text of the token.
 * @property {boolean} used Whether a match already used this token.
 */

/**
 * A word of a topic phrase, with how often the topic phrase contains it.
 *
 * @typedef {Object} TopicPhraseWord
 * @property {string[]} wordForms The forms of the word.
 * @property {number}   times     How often the topic phrase contains the word, for example 2 for "bora" in "bora bora".
 */

/**
 * Groups the words of a topic phrase that have the same forms, so a word that the topic phrase repeats is counted
 * once with how often it repeats.
 *
 * @param {string[][]} topicPhraseForms The forms of each word of the topic phrase.
 *
 * @returns {TopicPhraseWord[]} The unique words of the topic phrase.
 */
const getUniqueWords = ( topicPhraseForms ) => {
	const words = [];

	topicPhraseForms.forEach( wordForms => {
		const key = uniq( wordForms ).sort().join( "\u0000" );
		const word = words.find( candidate => candidate.key === key );

		if ( word ) {
			word.times++;
		} else {
			words.push( { key, wordForms, times: 1 } );
		}
	} );

	return words;
};

/**
 * Checks whether a token matches a word form, the same way the keyphrase is matched with the text tree: the word
 * form is transliterated, the token is not.
 *
 * @param {string} tokenText The text of the token.
 * @param {string} wordForm  The word form to match.
 * @param {string} locale    The locale, for transliteration.
 *
 * @returns {boolean} Whether the token matches the word form.
 */
const isTokenMatch = ( tokenText, wordForm, locale ) =>
	matchTextWithTransliteration( tokenText.toLowerCase(), wordForm.toLowerCase(), locale ).length > 0;

/**
 * Counts the exact matches of a phrase in the tokens, and marks the matched tokens as used.
 *
 * Used for exact matching, when the morphology research returns the quoted keyphrase as a single form. The tokens
 * of the phrase must follow each other, in order.
 *
 * @param {AltTextToken[]} tokens   The tokens of the sentence.
 * @param {string}         phrase   The phrase to match.
 * @param {function}       splitter The function that splits a text into tokens.
 * @param {string}         locale   The locale, for transliteration.
 *
 * @returns {number} The number of exact matches.
 */
const countPhraseInTokens = ( tokens, phrase, splitter, locale ) => {
	const phraseTokens = splitter( phrase );
	let count = 0;

	for ( let start = 0; start + phraseTokens.length <= tokens.length; start++ ) {
		const candidate = tokens.slice( start, start + phraseTokens.length );

		if ( candidate.every( ( token, index ) => ! token.used && isTokenMatch( token.text, phraseTokens[ index ], locale ) ) ) {
			candidate.forEach( token => {
				token.used = true;
			} );
			count++;
			start += phraseTokens.length - 1;
		}
	}

	return count;
};

/**
 * Counts how many full matches of one topic phrase (the keyphrase or one synonym) occur in the tokens of a sentence.
 *
 * - A full match needs a token for every word of the topic phrase, in any order.
 * - A token can only be used for one word of one match. Once counted, it is marked as used, so later topic phrases
 *   (the synonyms) cannot count it again.
 * - So a repeated word needs a token for every repetition: "bora bora" needs two "bora" tokens.
 *
 * @param {AltTextToken[]} tokens           The tokens of the sentence.
 * @param {string[][]}     topicPhraseForms The forms of each word of the topic phrase.
 * @param {function}       splitter         The function that splits a text into tokens.
 * @param {string}         locale           The locale, for transliteration.
 *
 * @returns {number} The number of full matches.
 */
const countTopicPhraseInTokens = ( tokens, topicPhraseForms, splitter, locale ) => {
	// An exact match request is the only case where a word form holds more than one word.
	if ( topicPhraseForms.length === 1 && topicPhraseForms[ 0 ].length === 1 && splitter( topicPhraseForms[ 0 ][ 0 ] ).length > 1 ) {
		return countPhraseInTokens( tokens, topicPhraseForms[ 0 ][ 0 ], splitter, locale );
	}

	const words = getUniqueWords( topicPhraseForms );
	const claimed = new Set();
	const matchedIndices = words.map( ( { wordForms } ) => {
		const indices = [];
		tokens.forEach( ( token, index ) => {
			if ( ! token.used && ! claimed.has( index ) && wordForms.some( wordForm => isTokenMatch( token.text, wordForm, locale ) ) ) {
				indices.push( index );
				claimed.add( index );
			}
		} );
		return indices;
	} );

	const count = Math.min( ...words.map( ( { times }, index ) => Math.floor( matchedIndices[ index ].length / times ) ) );

	words.forEach( ( { times }, index ) => {
		matchedIndices[ index ].slice( 0, count * times ).forEach( tokenIndex => {
			tokens[ tokenIndex ].used = true;
		} );
	} );

	return count;
};

/**
 * Counts the full matches of one topic phrase in a sentence with a language-specific match helper, and removes the
 * matched words from the sentence, so the next topic phrase cannot match them again.
 *
 * Used for languages that split words their own way, like Japanese. A repeated word needs as many matches as the
 * topic phrase repeats it.
 *
 * @param {string}     text                  The sentence.
 * @param {string[][]} topicPhraseForms      The forms of each word of the topic phrase.
 * @param {string}     locale                The locale, for transliteration.
 * @param {function}   matchWordCustomHelper The language-specific helper to match a word in a text.
 *
 * @returns {{count: number, remainingText: string}} The number of full matches and the sentence without them.
 */
const countTopicPhraseWithHelper = ( text, topicPhraseForms, locale, matchWordCustomHelper ) => {
	const words = getUniqueWords( topicPhraseForms );
	const wordMatches = words.map( ( { wordForms } ) => matchWords( text, wordForms, locale, matchWordCustomHelper ) );
	const count = Math.min( ...words.map( ( { times }, index ) => Math.floor( wordMatches[ index ].count / times ) ) );

	let remainingText = text;
	words.forEach( ( { times }, index ) => {
		wordMatches[ index ].matches.slice( 0, count * times ).forEach( match => {
			remainingText = remainingText.replace( match, "" );
		} );
	} );

	return { count, remainingText };
};

/**
 * Counts the full matches of all topic phrases in one sentence. Each topic phrase only matches words that the ones
 * before it did not match.
 *
 * @param {string}       sentence              The sentence.
 * @param {string[][][]} topicPhrases          The forms of each word of each topic phrase.
 * @param {string}       locale                The locale, for transliteration.
 * @param {function}     matchWordCustomHelper The language-specific helper to match a word in a text, if any.
 * @param {function}     splitter              The function that splits a text into tokens.
 *
 * @returns {number} The number of full matches.
 */
const countInSentence = ( sentence, topicPhrases, locale, matchWordCustomHelper, splitter ) => {
	const nonEmptyTopicPhrases = topicPhrases.filter( topicPhraseForms => ! isEmpty( topicPhraseForms ) );

	if ( matchWordCustomHelper ) {
		let remainingText = sentence;
		return nonEmptyTopicPhrases.reduce( ( count, topicPhraseForms ) => {
			const result = countTopicPhraseWithHelper( remainingText, topicPhraseForms, locale, matchWordCustomHelper );
			remainingText = result.remainingText;
			return count + result.count;
		}, 0 );
	}

	const tokens = splitter( sentence ).map( text => ( { text, used: false } ) );
	return nonEmptyTopicPhrases.reduce( ( count, topicPhraseForms ) =>
		count + countTopicPhraseInTokens( tokens, topicPhraseForms, splitter, locale ), 0 );
};

/**
 * Counts how often the keyphrase and its synonyms occur in the alt text of each image in scope.
 *
 * The images in scope are the images in the text, unless the Paper carries a `providedImages` attribute
 * (see `getImagesInScope`). Images without alt text are skipped. The keyphrase and the synonyms are summed, so an
 * alt text that has the keyphrase once and a synonym once counts 2. Each topic phrase only matches words that the
 * ones before it did not match, so overlapping synonyms do not count the same words twice.
 *
 * The alt text is counted per sentence, like the keyphrase in the meta description, so the words of a keyphrase
 * that are spread over different sentences do not form a match. Within a sentence, each word is matched as a token,
 * so a word that the keyphrase repeats ("bora bora") needs a token for every repetition.
 *
 * Exact matching (a keyphrase in double quotes) is already applied by the morphology research, which then returns
 * the quoted phrase as a single form. It is still reported here, because it changes how many occurrences count as
 * stuffing.
 *
 * @param {Paper}      paper      The paper to check for images.
 * @param {Researcher} researcher The researcher, for the keyphrase forms and the language-specific helpers.
 *
 * @returns {{exactMatchRequested: boolean, images: AltTextKeyphraseCount[]}} Whether exact matching is requested,
 *                                                                           and the count for each image with alt text.
 */
export default function altTextKeyphraseCount( paper, researcher ) {
	const result = {
		exactMatchRequested: processExactMatchRequest( paper.getKeyword() ).exactMatchRequested,
		images: [],
	};

	const topicForms = researcher.getResearch( "morphology" );
	if ( isEmpty( topicForms.keyphraseForms ) ) {
		return result;
	}

	const matchWordCustomHelper = researcher.getHelper( "matchWordCustomHelper" );
	const memoizedTokenizer = researcher.getHelper( "memoizedTokenizer" );
	const splitter = researcher.getHelper( "splitIntoTokensCustom" ) || splitIntoTokens;
	const locale = paper.getLocale();
	const topicPhrases = [ topicForms.keyphraseForms, ...topicForms.synonymsForms ];

	getImagesInScope( paper ).forEach( image => {
		const altText = getAltAttribute( image );

		if ( altText === "" ) {
			return;
		}

		const count = getSentences( altText, memoizedTokenizer ).reduce( ( total, sentence ) =>
			total + countInSentence( sentence, topicPhrases, locale, matchWordCustomHelper, splitter ), 0 );

		result.images.push( { identifier: getImageIdentifier( image ), count } );
	} );

	return result;
}
