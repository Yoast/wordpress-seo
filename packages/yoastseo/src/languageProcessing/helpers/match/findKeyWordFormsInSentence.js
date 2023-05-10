import matchTextWithArray from "./matchTextWithArray";
import { uniq } from "lodash-es";
import Token from "../../../parse/structure/Token";
import matchTokenWithWordForms from "../keywordCount/matchTokenWithWordForms";
import { tokenizerSplitter } from "../../../parse/language/LanguageProcessor";
import removeConsecutiveKeyphraseFromResult from "../keywordCount/removeConsecutiveKeyphraseMatches";

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
		// const newWord = []
		const tokenizedWord = word.map( form => {
			return form.split( tokenizerSplitter );
		} );

		const tokenizedWordTransposed = tokenizedWord[ 0 ].map( ( _, index ) => uniq( tokenizedWord.map( row => row[ index ] ) ) );

		tokenizedWordTransposed.forEach( newWord => newKeyphraseForms.push( newWord ) );
	} );
	return newKeyphraseForms;
};


/**
 * Gets all indices of a word in a sentence.
 * @param {string} word The word.
 * @param {Sentence} sentence The sentence.
 * @returns {array} The indices.
 */
const getAllIndicesOfWord = ( word, sentence ) => {
	// TODO: more fuzzy matching. Agnostic to capitalization.
	const text = sentence.text;

	// get all the indices of the word in the sentence.
	const indices = [];
	let index = text.indexOf( word );
	while ( index > -1 ) {
		indices.push( index );
		index = text.indexOf( word, index + 1 );
	}

	return indices;
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
		const head = keyphraseForms[ keyPhraseFormsIndex ];

		const foundPosition = tokens.slice( positionInSentence ).findIndex( t => matchTokenWithWordForms( head, t, locale ) );
		// If an occurence of a word is found, see if the subsequent word also is find.
		if ( foundPosition >= 0 ) {
			if ( keyPhraseFormsIndex > 0 ) {
				// if there are non keywords between two found keywords reset.

				const previousHead = keyphraseForms[ Math.max( 0, keyPhraseFormsIndex - 1 ) ]; // TODO: better way to extract previoushead.
				if ( tokens.slice( positionInSentence, foundPosition + positionInSentence ).some(
					t => {
						return matchTokenWithWordForms( previousHead, t, locale );
					} ) ) {
					result.secondaryMatches.push(  tokens[ positionInSentence - 1 ] );
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
 * Converts the matches to the format that is used in the assessment.
 * This function is for compatibility. If matches were found with the old method with a custom match helper,
 * this function converts them to the new format that is used for the position based highlighting.
 * @param {array} matches The matches.
 * @param {Sentence} sentence The sentence.
 * @param {string[][]} keyPhraseForms The keyphrase forms.
 * @param {string} locale The locale.
 * @returns {{primaryMatches: *[], secondaryMatches: *[], position: number}} The matches in the format that is used in the assessment.
 */
const convertToPositionResult = ( matches, sentence, keyPhraseForms, locale ) => {
	const matchTokens = [];
	matches.forEach( matchObject => {
		const matchWords = matchObject.matches;

		uniq( matchWords ).forEach( matchWord => {
			const indices = getAllIndicesOfWord( matchWord, sentence );
			indices.forEach( index => {
				const startOffset = sentence.sourceCodeRange.startOffset + index;
				const endOffset = sentence.sourceCodeRange.startOffset + index + matchWord.length;

				const matchToken = new Token( matchWord, { startOffset: startOffset, endOffset: endOffset } );

				matchTokens.push( matchToken );
			} );
		} );
	} );

	// Sort tokens on startOffset.
	matchTokens.sort( ( a, b ) => a.sourceCodeRange.startOffset - b.sourceCodeRange.startOffset );

	const primaryMatches = [];
	const secondaryMatches = [];

	let currentMatch = [];
	let keyPhraseFormsIndex = 0;

	// A primary match is a match that contains all the keyphrase forms in the same order as they occur in the keyphrase.
	// A secondary match is any other match.
	matchTokens.forEach( ( token ) => {
		const head = keyPhraseForms[ keyPhraseFormsIndex ];
		if ( head && matchTokenWithWordForms( head, token, locale ) ) {
			// If the token matches the head of the keyphrase form.
			currentMatch.push( token );
			keyPhraseFormsIndex += 1;
			if ( currentMatch.length === keyPhraseForms.length ) {
				primaryMatches.push( currentMatch );
				currentMatch = [];
				keyPhraseFormsIndex = 0;
			}
		} else {
			// If the token does not match the head of the keyphrase form.
			if ( currentMatch.length > 0 ) {
				// If there is a current match, add the current token to the secondary matches.
				if ( currentMatch.length === keyPhraseForms.length ) {
					primaryMatches.push( currentMatch );
				} else {
					secondaryMatches.push( currentMatch );
				}
			} else {
				secondaryMatches.push( [ token ] );
			}
			currentMatch = [];
			keyPhraseFormsIndex = 0;
		}
	} );


	return {
		primaryMatches: primaryMatches,
		secondaryMatches: secondaryMatches,
		position: 0,
	};
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
function findKeyWordFormsInSentence( sentence, keyphraseForms, locale,  matchWordCustomHelper ) {
	let matches, result;

	if ( keyphraseForms[ 0 ].length === 0 ) {
		return { primaryMatches: [], secondaryMatches: [] };
	}

	if ( matchWordCustomHelper ) {
		matches = keyphraseForms.map( forms => matchTextWithArray( sentence.text,  forms, locale, matchWordCustomHelper ) );
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
