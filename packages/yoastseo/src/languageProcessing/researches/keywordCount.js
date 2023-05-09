import { flatten, uniq } from "lodash-es";
import matchTextWithArray from "../helpers/match/matchTextWithArray";
import getSentencesFromTree from "../helpers/sentence/getSentencesFromTree";
import { tokenizerSplitter } from "../../parse/language/LanguageProcessor";
import { normalizeSingle } from "../helpers/sanitize/quotes";
import Token from "../../parse/structure/Token";
import removeConsecutiveKeyphraseFromResult from "../helpers/keywordCount/removeConsecutiveKeyphraseMatches";
import matchTokenWithWordForms from "../helpers/keywordCount/matchTokenWithWordForms";
import getMarkingsInSentence from "../helpers/highlighting/getMarkingsInSentence";

/**
 * (re-)Tokenizes the keyphrase forms in the same way that the tokens in the text are splitted.
 * This solves the problem that "key-word" would not match with "key-word" in the text,
 * because it would occur like ["key-word"] in the keyphraseForms and in ["key", "-", "word"] in the tokenized text.
 * @param {array[]} keyphraseForms The keyphrase forms to tokenize.
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
 * Matches the keyphrase forms in an array of tokens.
 * @param {array[]} keyphraseForms The keyphrase forms to match.
 * @param {Token[]} tokens The tokens to match the keyphrase forms in.
 * @param {string} locale The locale used in the analysis.
 * @returns {{primaryMatches: *[], secondaryMatches: *[]}} The matches.
 */
const getMatchesInTokens = ( keyphraseForms, tokens, locale ) => {
	const result = {
		primaryMatches: [],
		secondaryMatches: [],
	};

	// Index is the ith word from the wordforms. It indicates which word we are currently analyzing.
	let keyPhraseFormsIndex = 0;
	// positionInSentence keeps track of what word in the sentence we are currently at.
	let positionInSentence = 0;  // TODO: rename naar sentencePosition?

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
	// return sentence.text.split( "" ).map( ( x, i ) => x === word ? i : "" ).filter( Boolean );
};

/**
 * Converts the matches to the format that is used in the assessment.
 * @param {array} matches The matches.
 * @param {Sentence} sentence The sentence.
 * @param {array[]} keyPhraseForms The keyphrase forms.
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
			currentMatch.push( token );
			keyPhraseFormsIndex += 1;
			if ( currentMatch.length === keyPhraseForms.length ) {
				primaryMatches.push( currentMatch );
				currentMatch = [];
				keyPhraseFormsIndex = 0;
			}
		} else {
			if ( currentMatch.length > 0 ) {
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
 * @param {string} sentence The sentence to check.
 * @param {Array} keyphraseForms The keyphrase forms.
 * @param {string} locale The locale used in the analysis.
 * @param {function} matchWordCustomHelper  A custom helper to match words with a text.
 *
 * @returns {Array} The array of matched keyphrase form(s).
 */
function getMatchesInSentence( sentence, keyphraseForms, locale,  matchWordCustomHelper ) {
	let matches, result;

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

	const newKeyphraseForms = tokenizeKeyphraseForms( keyphraseForms, locale );

	matches = getMatchesInTokens( newKeyphraseForms, tokens, locale );

	return matches;
}


/**
 * Counts the occurrences of the keyphrase in the text and creates the Mark objects for the matches.
 *
 * @param {Array} sentences The sentences to check.
 * @param {Array} topicForms The keyphrase forms.
 * @param {string} locale The locale used in the analysis.
 * @param {function} matchWordCustomHelper  A custom helper to match words with a text.
 *
 * @returns {{markings: Mark[], count: number}} The number of keyphrase occurrences in the text and the Mark objects of the matches.
 */
export function countKeyphraseInText( sentences, topicForms, locale, matchWordCustomHelper ) {
	const result = { count: 0, markings: [] };

	sentences.forEach( sentence => {
		const matchesInSentence = getMatchesInSentence( sentence, topicForms.keyphraseForms, locale, matchWordCustomHelper );

		const markings = getMarkingsInSentence( sentence, matchesInSentence, matchWordCustomHelper, locale );

		result.markings.push( markings );
		result.count += matchesInSentence.primaryMatches.length;
	} );

	return result;
}

/**
 * Calculates the keyphrase count, takes morphology into account.
 *
 * @param {Paper}       paper       The paper containing keyphrase and text.
 * @param {Researcher}  researcher  The researcher.
 *
 * @returns {Object} An object containing an array of all the matches, markings and the keyphrase count.
 */
export default function keyphraseCount( paper, researcher ) {
	const topicForms = researcher.getResearch( "morphology" );
	topicForms.keyphraseForms = topicForms.keyphraseForms.map( word => word.map( form => normalizeSingle( form ) ) );
	const matchWordCustomHelper = researcher.getHelper( "matchWordCustomHelper" );
	const locale = paper.getLocale();
	const sentences = getSentencesFromTree( paper );

	const keyphraseFound = countKeyphraseInText( sentences, topicForms, locale, matchWordCustomHelper );

	return {
		count: keyphraseFound.count,
		markings: flatten( keyphraseFound.markings ),
		length: topicForms.keyphraseForms.length,
	};
}

/**
 * Calculates the keyphrase count, takes morphology into account.
 *
 * @deprecated Since version 20.8. Use keywordCountInSlug instead.
 *
 * @param {Paper}       paper       The paper containing keyphrase and text.
 * @param {Researcher}  researcher  The researcher.
 *
 * @returns {Object} An array of all the matches, markings and the keyphrase count.
 */
export function keywordCount( paper, researcher ) {
	console.warn( "This function is deprecated, use keyphraseCount instead." );
	return keyphraseCount( paper, researcher );
}
