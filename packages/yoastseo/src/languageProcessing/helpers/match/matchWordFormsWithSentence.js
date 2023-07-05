import matchTextWithTransliteration from "./matchTextWithTransliteration";
import getWordsForHTMLParser from "../word/getWordsForHTMLParser";

/**
 * Tokenizes the word form of the keyphrase for exact matching. This function gets the word form and tokenizes it.
 * This function assumes that if a keyphrase needs to be matched exactly, there will be only one word form.
 * This is the result of how the focus keyphrase is processed in buildTopicStems.js in the buildStems function.
 *
 * @param {(string[])} wordForms The word forms to tokenize.
 *
 * @returns {string[]} The tokenized word forms.
 */
export const tokenizeKeyphraseFormsForExactMatching = ( wordForms ) => {
	// Tokenize keyword forms.
	const wordFormText = wordForms[ 0 ];
	return getWordsForHTMLParser( wordFormText );
};

/**
 * Gets the exact matches of the keyphrase.
 * Exact matching happens when the user puts the keyphrase in double quotes.
 *
 * @param {Sentence} sentence The sentence to match the word forms with.
 * @param {string[]} wordForms The word forms to match.
 * @param {string} locale The locale used in the analysis.
 *
 * @returns {{count: number, matches: Token[]}} Object containing the number of the exact matches and the matched tokens.
 */
const findExactMatchKeyphraseInSentence = ( sentence, wordForms, locale ) => {
	const result = {
		count: 0,
		matches: [],
	};
	// Tokenize word forms of the keyphrase.
	const keywordTokens = tokenizeKeyphraseFormsForExactMatching( wordForms );

	const sentenceTokens = sentence.tokens;

	// Check if tokenized word forms occur in the same order in the sentence tokens.
	let keywordIndex = 0;
	let sentenceIndex = 0;
	let currentMatch = [];

	while ( sentenceIndex < sentenceTokens.length ) {
		// If the current sentence token matches the current word token, add it to the current match.
		const sentenceTokenText = sentenceTokens[ sentenceIndex ].text;
		const keywordTokenText = keywordTokens[ keywordIndex ];

		const foundMatches = matchTextWithTransliteration( sentenceTokenText.toLowerCase(), keywordTokenText.toLowerCase(), locale );

		if ( foundMatches.length > 0 ) {
			currentMatch.push( sentenceTokens[ sentenceIndex ] );
			keywordIndex++;
		} else {
			keywordIndex = 0;
			currentMatch = [];
		}

		// If the current match has the same length as the keyword tokens, the keyword forms have been matched.
		// Add the current match to the matches array and reset the keyword index and the current match.
		if ( currentMatch.length === keywordTokens.length ) {
			result.matches.push( ...currentMatch );
			result.count++;
			keywordIndex = 0;
			currentMatch = [];
		}

		sentenceIndex++;
	}
	return result;
};

/**
 * Matches a word form of the keyphrase with the tokens from the sentence.
 *
 * @param {Token[]} tokens The array of tokens to check.
 * @param {string} wordForm The word form of the keyphrase.
 * @param {string} locale The locale used in the analysis.
 *
 * @returns {Token[]}	The array of the matched tokens.
 */
const matchTokensWithKeywordForm = ( tokens, wordForm, locale ) => {
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
 * @param {Sentence} sentence The sentence to check.
 * @param {string[]} wordForms	The word forms of the keyphrase to check.
 * @param {string} locale The locale used in the analysis.
 * @param {function} matchWordCustomHelper Custom function to match a word form with sentence.
 *
 * @returns {{count: number, matches: (Token|string)[]}} Object containing the number of the matches and the matched tokens.
 */
const matchWordFormsInSentence = ( sentence, wordForms, locale, matchWordCustomHelper ) => {
	const tokens = sentence.tokens.slice();
	let count = 0;
	let matches = [];

	wordForms.forEach( wordForm => {
		const occurrence = matchWordCustomHelper
			? matchWordCustomHelper( sentence.text, wordForm )
			: matchTokensWithKeywordForm( tokens, wordForm, locale );
		count += occurrence.length;
		matches = matches.concat( occurrence );
	} );

	return {
		count: count,
		matches: matches,
	};
};

/**
 * Matches the word forms of a keyphrase with a sentence object from the html parser.
 *
 * @param {Sentence} sentence The sentence to match against the keywordForms.
 * @param {string[]} wordForms The array of word forms of the keyphrase.
 * E.g. If the keyphrase is "key word", then (if premium is activated) this will be [ "key", "keys" ] OR [ "word", "words" ]
 * The forms are retrieved higher up (among others in keywordCount.js) with researcher.getResearch( "morphology" ).
 *
 * @param {string} locale The locale used for transliteration.
 * Depends on whether the keyphrase is enclosed in double quotes.
 * @param {function} matchWordCustomHelper Custom function to match a word form with sentence.
 * @param {boolean} useExactMatching Whether to match the keyword forms exactly or not.
 *
 * @returns {{count: number, matches: (Token|string)[]}} Object containing the number of the matches and the matched tokens.
 */
const matchWordFormsWithSentence = ( sentence, wordForms, locale, matchWordCustomHelper, useExactMatching = false ) => {
	/*
	 * Only use `findExactMatchKeyphraseInSentence` when the custom helper is not available.
	 * When the custom helper is available, the step for the exact matching happens in the helper.
	 */
	if ( useExactMatching && ! matchWordCustomHelper ) {
		return findExactMatchKeyphraseInSentence( sentence, wordForms, locale );
	}
	return matchWordFormsInSentence( sentence, wordForms, locale, matchWordCustomHelper );
};

export default matchWordFormsWithSentence;
