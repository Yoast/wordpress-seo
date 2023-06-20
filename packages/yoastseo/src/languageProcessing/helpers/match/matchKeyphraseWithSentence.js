import getWordsForHTMLParser from "../word/getWordsForHTMLParser";
import { escapeRegExp } from "lodash-es";
import matchTextWithTransliteration from "./matchTextWithTransliteration";

/**
 * Tokenizes keyword forms for exact matching. This function gets the keyword form and tokenizes it.
 * This function assumes that if a keyphrase needs to be matched exactly, there will be only one keyword form.
 * This is the result of how the focus keyword is processed in buildTopicStems.js in the buildStems function.
 *
 * @param {(string[])[]} keywordForms The keyword forms to tokenize.
 *
 * @returns {string[]} The tokenized keyword forms.
 */
export const tokenizeKeywordFormsForExactMatching = ( keywordForms ) => {
	// Tokenize keyword forms.
	const keywordFormsText = keywordForms[ 0 ][ 0 ];
	return getWordsForHTMLParser( keywordFormsText );
};

/**
 * Gets the exact matches of the keyphrase.
 * Exact matching happens when the user puts the keyword in double quotes.
 *
 * @param {(string[])[]} keywordForms The keyword forms to match.
 * @param {Sentence} sentence The sentence to match the keyword forms with.
 *
 * @returns {Token[]} The tokens that exactly match the keyword forms.
 */
export const getExactMatches = ( keywordForms, sentence ) => {
	// Tokenize keyword forms.
	const keywordTokens = tokenizeKeywordFormsForExactMatching( keywordForms );

	const sentenceTokens = sentence.tokens;

	// Check if tokenized keyword forms occur in the same order in the sentence tokens.
	let keywordIndex = 0;
	let sentenceIndex = 0;
	const matches = [];
	let currentMatch = [];

	while ( sentenceIndex < sentenceTokens.length ) {
		// If the current sentence token matches the current keyword token, add it to the current match.
		const sentenceTokenText = escapeRegExp( sentenceTokens[ sentenceIndex ].text );
		const keywordTokenText = escapeRegExp( keywordTokens[ keywordIndex ] );

		if ( sentenceTokenText.toLowerCase() === keywordTokenText.toLowerCase() ) {
			currentMatch.push( sentenceTokens[ sentenceIndex ] );
			keywordIndex++;
		} else {
			keywordIndex = 0;
			currentMatch = [];
		}

		// If the current match has the same length as the keyword tokens, the keyword forms have been matched.
		// Add the current match to the matches array and reset the keyword index and the current match.
		if ( currentMatch.length === keywordTokens.length ) {
			matches.push( ...currentMatch );
			keywordIndex = 0;
			currentMatch = [];
		}

		sentenceIndex++;
	}
	return matches;
};

/**
 * Free matching of keyword forms in a sentence.
 *
 * @param {(string[])[]} keywordForms The keyword forms to match.
 * @param {Sentence} sentence The sentence to match the keyword forms with.
 * @param {string} locale The locale used for transliteration.
 * @returns {Token[]} The tokens that match the keyword forms.
 */
export const getNonExactMatches = ( keywordForms, sentence, locale ) => {
	const tokens = sentence.tokens.slice();

	// Filter out all tokens that do not match the keyphrase forms.
	return tokens.filter( ( token ) => {
		const tokenText = escapeRegExp( token.text );
		return keywordForms.some( ( keywordForm ) => {
			return keywordForm.some( ( keywordFormPart ) => {
				return matchTextWithTransliteration( tokenText, keywordFormPart, locale ).length > 0;
			} );
		} );
	} );

	//
	// return keywordForms.map( formArray => formArray.map( form => {
	// 	let count = 0;
	// 	const matches = [];
	// 	tokens.forEach( token => {
	// 		const tokenText = escapeRegExp( token.text );
	// 		const match = matchTextWithTransliteration( tokenText, form, locale );
	// 		if ( match.length > 0 ) {
	// 			count++;
	// 			matches.push( match );
	// 		}
	// 	} );
	// 	return {
	// 		count: count,
	// 		matches: matches,
	// 	};
	// } )
	// );
};

/**
 * Matches a keyword with a sentence object from the html parser.
 *
 * @param {(string[])[]} keywordForms The keyword forms.
 * E.g. If the keyphrase is "key word", then (if premium is activated) this will be [ [ "key", "keys" ], [ "word", "words" ] ]
 * The forms are retrieved higher up (among others in keywordCount.js) with researcher.getResearch( "morphology" ).
 * @param {Sentence} sentence The sentence to match against the keywordForms.
 * @param {string} locale The locale used for transliteration.
 * @param {boolean} useExactMatching Whether to match the keyword forms exactly or not.
 * Depends on whether the user has put the keyphrase in double quotes.
 * @returns {Token[]} The tokens that match the keywordForms.
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
export const matchKeyphraseWithSentence = ( keywordForms, sentence, locale, useExactMatching = false ) => {
	if ( useExactMatching ) {
		return getExactMatches( keywordForms, sentence );
	}
	return getNonExactMatches( keywordForms, sentence, locale );
};
