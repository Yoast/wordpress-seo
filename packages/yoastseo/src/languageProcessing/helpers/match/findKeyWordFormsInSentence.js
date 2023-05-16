import matchTextWithArray from "./matchTextWithArray";
import { uniq } from "lodash-es";
import matchTokenWithWordForms from "../keywordCount/matchTokenWithWordForms";
import { tokenizerSplitter } from "../../../parse/language/LanguageProcessor";
import removeConsecutiveKeyphraseFromResult from "../keywordCount/removeConsecutiveKeyphraseMatches";
import convertToPositionResult from "./convertMatchToPositionResult";

/**
 * (re-)Tokenizes the keyphrase forms in the same way that the tokens in the text are splitted.
 * This solves the problem that "key-word" would not match with "key-word" in the text,
 * because it would occur like ["key-word"] in the keyphraseForms and in ["key", "-", "word"] in the tokenized text.
 * @param {string[][]} keyphraseForms The keyphrase forms to tokenize.
 * @returns {array[]} The tokenized keyphrase forms.
 */
const tokenizeKeyphraseForms = ( keyphraseForms ) => {
	const newKeyphraseForms = [];
	keyphraseForms.forEach( word => {
		const tokenizedWord = word.map( form => {
			return form.split( tokenizerSplitter );
		} );

		const tokenizedWordTransposed = tokenizedWord[ 0 ].map( ( _, index ) => uniq( tokenizedWord.map( row => row[ index ] ) ) );

		tokenizedWordTransposed.forEach( newWord => newKeyphraseForms.push( newWord ) );
	} );

	// if a token ends with a single \ then prepend the \ to the next token and remove the \ it from the current token.
	// This is a fix because the tokenization does not work well for a situation where a fullstop is escaped.
	// For example: yoastseo 9.3 would be tokenized as ["yoastseo", "9\", ".", "3"]. This fix corrects this to ["yoastseo", "9", "\.", "3"].
	for ( let i = 0; i < newKeyphraseForms.length; i++ ) {
		if ( newKeyphraseForms[ i ][ 0 ].endsWith( "\\" ) && ! newKeyphraseForms[ i ][ 0 ].endsWith( "\\\\" )  ) {
			// Remove the \ from the current token.
			newKeyphraseForms[ i ][ 0 ] = newKeyphraseForms[ i ][ 0 ].slice( 0, -1 );
			// Prepend the \ to the next token.
			newKeyphraseForms[ i + 1 ][ 0 ] = "\\" + newKeyphraseForms[ i + 1 ][ 0 ];
		}
	}


	return newKeyphraseForms;
};


/**
 * Matches the keyphrase forms in an array of tokens.
 * @param {array[]} keyphraseForms The keyphrase forms to match.
 * @param {Token[]} tokens The tokens to match the keyphrase forms in.
 * @param {string} locale The locale used in the analysis.
 * @returns {{primaryMatches: *[], secondaryMatches: *[]}} The matches.
 */
const getMatchesInTokens = ( keyphraseForms, tokens, locale ) => {
	// TODO: write documentation for primary and secondary matches.
	const result = {
		primaryMatches: [],
		secondaryMatches: [],
	};

	// Index is the ith word from the wordforms. It indicates which word we are currently analyzing.
	let keyPhraseFormsIndex = 0;
	// positionInSentence keeps track of what word in the sentence we are currently at.
	let positionInSentence = 0;

	let foundWords = [];
	// eslint-disable-next-line no-constant-condition
	while ( true ) {
		// The head of the keyphrase form we are currently analyzing.
		// [["key"], ["word", "words"]]
		const head = keyphraseForms[ keyPhraseFormsIndex ];

		const foundPosition = tokens.slice( positionInSentence ).findIndex( token => matchTokenWithWordForms( head, token, locale ) );
		// If an occurence of a word is found, see if the subsequent word also is find.
		if ( foundPosition >= 0 ) {
			if ( keyPhraseFormsIndex > 0 ) {
				// if there are non keywords between two found keywords reset.

				const previousHead = keyphraseForms[ Math.max( 0, keyPhraseFormsIndex - 1 ) ]; // TODO: better way to extract previoushead.
				if ( tokens.slice( positionInSentence, foundPosition + positionInSentence ).some(
					t => {
						return matchTokenWithWordForms( previousHead, t, locale );
					} ) ) {
					result.secondaryMatches.push( tokens[ positionInSentence - 1 ] );
					keyPhraseFormsIndex = 0;
					foundWords = [];
					continue;
				}

				const previousToken = tokens[ Math.max( positionInSentence + foundPosition - 1, 0 ) ]; // TODO: better way to extract previous token.
				// if the previous token is an underscore and the previous head is not an underscore, reset.
				if ( previousToken.text === "_" && ! previousHead.includes( "_" ) ) {
					// result.secondaryMatches.push(  tokens[ positionInSentence - 1 ] );
					keyPhraseFormsIndex = 0;
					foundWords = [];
					continue;
				}
			}

			keyPhraseFormsIndex += 1;
			positionInSentence += foundPosition;
			foundWords.push( tokens[ positionInSentence ] );
			positionInSentence += 1;
		} else {
			if ( keyPhraseFormsIndex === 0 ) {
				break;
			}
			keyPhraseFormsIndex = 0;
		}

		if ( foundWords.length >= keyphraseForms.length ) {
			result.primaryMatches.push( foundWords );
			keyPhraseFormsIndex = 0;
			foundWords = [];
		}
	}

	return removeConsecutiveKeyphraseFromResult( result );
};


/**
 * Gets the matched keyphrase form(s).
 *
 * @param {Sentence} sentence The sentence to check.
 * @param {string[][]} keyphraseForms The keyphrase forms.
 * @param {string} locale The locale used in the analysis.
 * @param {function} matchWordCustomHelper  A custom helper to match words with a text.
 *
 * @returns {{primaryMatches: *[], secondaryMatches: *[], position: number}} The array of matched keyphrase form(s).
 */
function findKeyWordFormsInSentence( sentence, keyphraseForms, locale, matchWordCustomHelper ) {
	let matches, result;

	if ( keyphraseForms[ 0 ].length === 0 ) {
		return { primaryMatches: [], secondaryMatches: [] };
	}

	if ( matchWordCustomHelper ) {
		// In practice this branch of the code is only touched for japanese (the only language with a matchWordCustomHelper).
		// Since tokenization for Japanese will be implemented in the future, this branch will get obsolete.

		matches = keyphraseForms.map( forms => matchTextWithArray( sentence.text, forms, locale, matchWordCustomHelper ) );
		// If one of the forms is not found, return an empty result.
		if ( matches.some( match => match.position === -1 ) ) {
			return { primaryMatches: [], secondaryMatches: [], position: -1 };
		}

		result = convertToPositionResult( matches, sentence, keyphraseForms, locale );

		return result;
	}

	const tokens = sentence.tokens;

	const newKeyphraseForms = tokenizeKeyphraseForms( keyphraseForms );

	matches = getMatchesInTokens( newKeyphraseForms, tokens, locale );

	return matches;
}

export default findKeyWordFormsInSentence;
