import { isEmpty, uniq } from "lodash";

import matchTextWithArray from "./matchTextWithArray.js";
import matchTextWithTransliteration from "./matchTextWithTransliteration.js";
import splitIntoTokens from "../word/splitIntoTokens.js";

/**
 * @typedef {import ("../../../parse/structure/Sentence").default} Sentence
 * @typedef {import ("../../../parse/structure/Token").default} Token
 */

/**
 * @typedef MatchResult
 * @property {number} count The number of matches found.
 * @property {(Token|string)[]} matches The array of matched tokens or strings.
 */

/**
 * A token of a sentence, and whether an earlier match already used it.
 *
 * @typedef {Object} SentenceToken
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
 * Tokenizes the word form of the keyphrase for exact matching. This function gets the word form and tokenizes it.
 * This function assumes that if a keyphrase needs to be matched exactly, there will be only one word form.
 * This is the result of how the focus keyphrase is processed in buildTopicStems.js in the buildStems function.
 *
 * @param {string[]}  wordForms 					The word forms to tokenize.
 * @param {function}	customSplitIntoTokensHelper	A custom helper to split sentences into tokens.
 *
 * @returns {string[]} The tokenized word forms.
 */
export const tokenizeKeyphraseFormsForExactMatching = ( wordForms, customSplitIntoTokensHelper ) => {
	// Tokenize a word form of the keyphrase.
	const wordFormText = wordForms[ 0 ];

	return customSplitIntoTokensHelper ? customSplitIntoTokensHelper( wordFormText ) : splitIntoTokens( wordFormText );
};

/**
 * Gets the exact matches of the keyphrase.
 * Exact matching happens when the user puts the keyphrase in double quotes.
 *
 * @param {Sentence}	sentence					The sentence to match the word forms with.
 * @param {string[]}	wordForms					The word forms to match.
 * @param {string}		locale						The locale used in the analysis.
 * @param {function}	customSplitIntoTokensHelper	A custom helper to split sentences into tokens.
 *
 * @returns {MatchResult} Object containing the number of the exact matches and the matched tokens.
 */
const findExactMatchKeyphraseInSentence = ( sentence, wordForms, locale, customSplitIntoTokensHelper ) => {
	const result = {
		count: 0,
		matches: [],
	};
	// Tokenize word forms of the keyphrase.
	const keyphraseTokens = tokenizeKeyphraseFormsForExactMatching( wordForms, customSplitIntoTokensHelper );

	const sentenceTokens = sentence.tokens;

	// Initialize the index of the word token of the keyphrase.
	let indexOfWordInKeyphrase = 0;
	// Initialize the index of the word token of the sentence.
	let indexOfWordInSentence = 0;
	let currentMatch = [];

	// Check if the tokenized word forms occur in the same order in the sentence tokens.
	while ( indexOfWordInSentence < sentenceTokens.length ) {
		// If the current sentence token matches the current word token of the keyphrase, add it to the current match.
		const sentenceTokenText = sentenceTokens[ indexOfWordInSentence ].text;
		const keyphraseTokenText = keyphraseTokens[ indexOfWordInKeyphrase ];

		const foundMatches = matchTextWithTransliteration( sentenceTokenText.toLowerCase(), keyphraseTokenText.toLowerCase(), locale );

		if ( foundMatches.length > 0 ) {
			currentMatch.push( sentenceTokens[ indexOfWordInSentence ] );
			indexOfWordInKeyphrase++;
		} else {
			indexOfWordInKeyphrase = 0;
			currentMatch = [];
		}

		/*
		 * If the current match has the same length as the keyphrase tokens, the keyphrase forms have been matched.
		 * Add the current match to the matches array and reset the index of the word in keyphrase and the current match.
		 */
		if ( currentMatch.length === keyphraseTokens.length ) {
			result.matches.push( ...currentMatch );
			result.count++;
			indexOfWordInKeyphrase = 0;
			currentMatch = [];
		}

		indexOfWordInSentence++;
	}
	return result;
};

/**
 * Matches a word form of the keyphrase with the tokens from the sentence.
 *
 * With this approach, we transliterate the word form of the keyphrase before matching it with the sentence tokens.
 * However, we don't do the transliteration step for the sentence tokens.
 * As a result, for example, the word form "acción" from the keyphrase will match the word "accion" in the sentence.
 * But, the word form "accion" from the keyphrase will NOT match the word "acción" in the sentence.
 *
 * @param {Token[]}	tokens		The array of tokens to check.
 * @param {string}	wordForm	The word form of the keyphrase.
 * @param {string}	locale		The locale used in the analysis.
 *
 * @returns {Token[]}	The array of the matched tokens.
 */
const matchWordFormInTokens = ( tokens, wordForm, locale ) => {
	let matches = [];

	tokens.forEach( token => {
		const occurrence = matchTextWithTransliteration( token.text, wordForm, locale );
		if ( occurrence.length > 0 ) {
			matches = matches.concat( token );
		}
	} );

	return matches;
};

/**
 * Finds keyphrase forms in a sentence.
 *
 * @param {Sentence|string}	sentence				The sentence to check.
 * @param {string[]}		wordForms				The word forms of the keyphrase to check.
 * @param {string}			locale					The locale used in the analysis.
 * @param {function}		matchWordCustomHelper	Custom function to match a word form with sentence.
 *
 * @returns {MatchResult} Object containing the number of the matches and the matched tokens.
 */
export const matchWordFormsInSentence = ( sentence, wordForms, locale, matchWordCustomHelper ) => {
	const result = {
		count: 0,
		matches: [],
	};

	wordForms.forEach( wordForm => {
		let occurrences = [];
		if ( matchWordCustomHelper ) {
			occurrences = matchWordCustomHelper( sentence, wordForm );
		} else {
			const tokens = sentence.tokens.slice();
			occurrences = matchWordFormInTokens( tokens, wordForm, locale );
		}
		result.count += occurrences.length;
		result.matches = result.matches.concat( occurrences );
	} );

	return result;
};

/**
 * Matches the word forms of a keyphrase with a sentence object from the HTML parser.
 *
 * @param {Sentence|string}	sentence					The sentence to match against the word forms of a keyphrase.
 * @param {string[]}		wordForms					The array of word forms of the keyphrase.
 * E.g. If the keyphrase is "key word", then (if Premium is activated) this will be [ "key", "keys" ] OR [ "word", "words" ]
 * The forms are retrieved higher up (among others in keywordCount.js) with researcher.getResearch( "morphology" ).
 * @param {string}			locale						The locale used for transliteration.
 * @param {function}		matchWordCustomHelper		Custom function to match a word form with sentence.
 * @param {boolean}			useExactMatching			Whether to match the keyphrase forms exactly or not.
 * 														Exact match is used when the keyphrase is enclosed in double quotes.
 * @param {function}		customSplitIntoTokensHelper	A custom helper to split sentences into tokens.
 *
 * @returns {MatchResult} Object containing the number of the matches and the matched tokens.
 */
const matchWordFormsWithSentence = ( sentence, wordForms, locale, matchWordCustomHelper, useExactMatching = false, customSplitIntoTokensHelper ) => {
	/*
	 * Only use `findExactMatchKeyphraseInSentence` when the custom helper is not available.
	 * When the custom helper is available, the step for the exact matching happens in the helper.
	 */
	if ( useExactMatching && ! matchWordCustomHelper ) {
		return findExactMatchKeyphraseInSentence( sentence, wordForms, locale, customSplitIntoTokensHelper );
	}
	return matchWordFormsInSentence( sentence, wordForms, locale, matchWordCustomHelper );
};

/**
 * Groups the words of a topic phrase that have the same forms, so a word that the topic phrase repeats is counted
 * once with how often it repeats.
 *
 * @param {string[][]} topicPhraseForms The forms of each word of the topic phrase.
 *
 * @returns {TopicPhraseWord[]} The unique words of the topic phrase.
 */
export const getUniqueWords = ( topicPhraseForms ) => {
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
 * @param {SentenceToken[]} tokens   The tokens of the sentence.
 * @param {string}          phrase   The phrase to match.
 * @param {function}        splitter The function that splits a text into tokens.
 * @param {string}          locale   The locale, for transliteration.
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
 * @param {SentenceToken[]} tokens           The tokens of the sentence.
 * @param {string[][]}      topicPhraseForms The forms of each word of the topic phrase.
 * @param {function}        splitter         The function that splits a text into tokens.
 * @param {string}          locale           The locale, for transliteration.
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
	const wordMatches = words.map( ( { wordForms } ) => matchTextWithArray( text, wordForms, locale, matchWordCustomHelper ) );
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
export const countTopicPhrasesInSentence = ( sentence, topicPhrases, locale, matchWordCustomHelper, splitter ) => {
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

export default matchWordFormsWithSentence;
