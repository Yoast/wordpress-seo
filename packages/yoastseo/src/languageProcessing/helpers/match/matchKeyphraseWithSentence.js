import { escapeRegExp } from "lodash-es";
import matchTextWithTransliteration from "./matchTextWithTransliteration";
import getWordsForHTMLParser from "../word/getWordsForHTMLParser";

/**
 * Tokenizes keyword forms for exact matching. This function gets the keyword form and tokenizes it.
 * This function assumes that if a keyphrase needs to be matched exactly, there will be only one keyword form.
 * This is the result of how the focus keyword is processed in buildTopicStems.js in the buildStems function.
 *
 * @param {(string[])} wordForms The keyword forms to tokenize.
 *
 * @returns {string[]} The tokenized keyword forms.
 */
export const tokenizeKeywordFormsForExactMatching = ( wordForms ) => {
	// Tokenize keyword forms.
	const keywordFormsText = wordForms[ 0 ];
	return getWordsForHTMLParser( keywordFormsText );
};

/**
 * Gets the exact matches of the keyphrase.
 * Exact matching happens when the user puts the keyword in double quotes.
 *
 * @param {Sentence} sentence The sentence to match the keyword forms with.
 * @param {string[]} wordForms The keyword forms to match.
 * @param {string} locale The locale used in the analysis.
 *
 * @returns {{count: number, matches: Token[]}} Object containing the number of the exact matches and the matched tokens.
 */
const findExactMatchKeyphraseInSentence = ( sentence, wordForms, locale ) => {
	const result = {
		count: 0,
		matches: [],
	};
	// Tokenize keyword form.
	const keywordTokens = tokenizeKeywordFormsForExactMatching( wordForms );

	const sentenceTokens = sentence.tokens;

	// Check if tokenized keyword forms occur in the same order in the sentence tokens.
	let keywordIndex = 0;
	let sentenceIndex = 0;
	let currentMatch = [];

	while ( sentenceIndex < sentenceTokens.length ) {
		// If the current sentence token matches the current keyword token, add it to the current match.
		const sentenceTokenText = sentenceTokens[ sentenceIndex ].text;
		const keywordTokenText = escapeRegExp( keywordTokens[ keywordIndex ] );

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
		// Escaping for the regex is only necessary when we want to create a regex out of a string.
		// In this case, we create a regex out of the keywordForm but not out of the token text.
		const occurrence = matchTextWithTransliteration( token.text, escapeRegExp( wordForm ), locale );
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
 *
 * @returns {{count: number, matches: Token[]}} Object containing the number of the matches and the matched tokens.
 */
const matchWordFormsInSentence = ( sentence, wordForms, locale ) => {
	const tokens = sentence.tokens.slice();

	let count = 0;
	let matches = [];

	wordForms.forEach( wordForm => {
		const occurrence = matchTokensWithKeywordForm( tokens, wordForm, locale );
		count += occurrence.length;
		matches = matches.concat( occurrence );
	} );
	return {
		count: count,
		matches: matches,
	};
};

/**
 * Matches a keyword with a sentence object from the html parser.
 *
 * @param {Sentence} sentence The sentence to match against the keywordForms.
 * @param {string[]} wordForms The keyword forms.
 * E.g. If the keyphrase is "key word", then (if premium is activated) this will be [ "key", "keys" ] OR [ "word", "words" ]
 * The forms are retrieved higher up (among others in keywordCount.js) with researcher.getResearch( "morphology" ).
 * @param {string} locale The locale used for transliteration.
 * @param {boolean} useExactMatching Whether to match the keyword forms exactly or not.
 * Depends on whether the keyphrase enclosed in double quotes.
 * @returns {{count: number, matches: Token[]}} Object containing the number of the matches and the matched tokens.
 *
 * The algorithm is as follows:
 *
 * It iterates over all tokens in the sentence. It compares the current token with the keyword forms.
 * If it matches, it adds the token to the matches array.
 *
 * The keyword forms are tokenized differently than the sentence.
 * The keyword forms are tokenized with researcher.getResearch( "morphology" ) and the sentence is tokenized with the html parser.
 * This leads to differences in tokenization. For example, the html parser tokenizes "key-word" as [ "key", "-", "word" ]. The morphology
 * tokenizes it as [ "key-word" ].
 * This function corrects for these differences by combining tokens that are separated by a word coupler (e.g. "-") into one token: the matchToken.
 * This matchToken is then compared with the keyword forms.
 */
const matchKeyphraseWithSentence = ( sentence, wordForms, locale, useExactMatching = false ) => {
	if ( useExactMatching ) {
		return findExactMatchKeyphraseInSentence( sentence, wordForms, locale );
	}
	return matchWordFormsInSentence( sentence, wordForms, locale );
};

export default matchKeyphraseWithSentence;
