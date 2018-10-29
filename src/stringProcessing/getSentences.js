import { map } from "lodash-es";
import { isUndefined } from "lodash-es";
import { forEach } from "lodash-es";
import { isNaN } from "lodash-es";
import { filter } from "lodash-es";
import { flatMap } from "lodash-es";
import { isEmpty } from "lodash-es";
import { negate } from "lodash-es";
import { memoize } from "lodash-es";

import core from "tokenizer2/core";
import { getBlocks } from "../helpers/html.js";
import { normalize as normalizeQuotes } from "../stringProcessing/quotes.js";
import { unifyNonBreakingSpace as unifyWhitespace } from "../stringProcessing/unifyWhitespace.js";

// All characters that indicate a sentence delimiter.
const fullStop = ".";
// The \u2026 character is an ellipsis
const sentenceDelimiters = "?!;\u2026";
const newLines = "\n\r|\n|\r";

const fullStopRegex = new RegExp( "^[" + fullStop + "]$" );
const sentenceDelimiterRegex = new RegExp( "^[" + sentenceDelimiters + "]$" );
const sentenceRegex = new RegExp( "^[^" + fullStop + sentenceDelimiters + "<\\(\\)\\[\\]]+$" );
const greaterThanContentRegex = /^<[^><]*$/;
const htmlStartRegex = /^<([^>\s/]+)[^>]*>$/mi;
const htmlEndRegex = /^<\/([^>\s]+)[^>]*>$/mi;
const newLineRegex = new RegExp( newLines );

const blockStartRegex = /^\s*[[({]\s*$/;
const blockEndRegex = /^\s*[\])}]\s*$/;

let tokens = [];
let sentenceTokenizer;

/**
 * Creates a tokenizer.
 *
 * @param {Array} tokenArray the empty array of tokens, to be filled by the tokenizer later on.
 * @returns {{addRule, onText, end}} the tokenizer.
 */
function createTokenizer( tokenArray ) {
	const tokenizer = core( function( token ) {
		tokenArray.push( token );
	} );

	tokenizer.addRule( greaterThanContentRegex, "greater-than-sign-content" );
	tokenizer.addRule( htmlStartRegex, "html-start" );
	tokenizer.addRule( htmlEndRegex, "html-end" );
	tokenizer.addRule( blockStartRegex, "block-start" );
	tokenizer.addRule( blockEndRegex, "block-end" );
	tokenizer.addRule( fullStopRegex, "full-stop" );
	tokenizer.addRule( sentenceDelimiterRegex, "sentence-delimiter" );
	tokenizer.addRule( sentenceRegex, "sentence" );

	return tokenizer;
}

/**
 * Returns whether or not a certain character is a capital letter.
 *
 * @param {string} character The character to check.
 * @returns {boolean} Whether or not the character is a capital letter.
 */
function isCapitalLetter( character ) {
	return character !== character.toLocaleLowerCase();
}

/**
 * Returns whether or not a certain character is a number.
 *
 * @param {string} character The character to check.
 * @returns {boolean} Whether or not the character is a capital letter.
 */
function isNumber( character ) {
	return ! isNaN( parseInt( character, 10 ) );
}

/**
 * Returns whether or not a given HTML tag is a break tag.
 *
 * @param {string} htmlTag The HTML tag to check.
 * @returns {boolean} Whether or not the given HTML tag is a break tag.
 */
function isBreakTag( htmlTag ) {
	return /<br/.test( htmlTag );
}

/**
 * Returns whether or not a given character is quotation mark.
 *
 * @param {string} character The character to check.
 * @returns {boolean} Whether or not the given character is a quotation mark.
 */
function isQuotation( character ) {
	character = normalizeQuotes( character );

	return "'" === character ||
		"\"" === character;
}

/**
 * Returns whether or not a given character is a punctuation mark that can be at the beginning
 * of a sentence, like ¿ and ¡ used in Spanish.
 *
 * @param {string} character The character to check.
 * @returns {boolean} Whether or not the given character is a punctuation mark.
 */
function isPunctuation( character ) {
	return "¿" === character ||
		"¡" === character;
}

/**
 * Removes duplicate whitespace from a given text.
 *
 * @param {string} text The text with duplicate whitespace.
 * @returns {string} The text without duplicate whitespace.
 */
function removeDuplicateWhitespace( text ) {
	return text.replace( /\s+/, " " );
}

/**
 * Retrieves the next two characters from an array with the two next tokens.
 *
 * @param {Array} nextTokens The two next tokens. Might be undefined.
 * @returns {string} The next two characters.
 */
function getNextTwoCharacters( nextTokens ) {
	let next = "";

	if ( ! isUndefined( nextTokens[ 0 ] ) ) {
		next += nextTokens[ 0 ].src;
	}

	if ( ! isUndefined( nextTokens[ 1 ] ) ) {
		next += nextTokens[ 1 ].src;
	}

	next = removeDuplicateWhitespace( next );

	return next;
}

/**
 * Checks if the sentenceBeginning beginning is a valid beginning.
 *
 * @param {string} sentenceBeginning The beginning of the sentence to validate.
 * @returns {boolean} Returns true if it is a valid beginning, false if it is not.
 */
function isValidSentenceBeginning( sentenceBeginning ) {
	return (
		isCapitalLetter( sentenceBeginning ) ||
		isNumber( sentenceBeginning ) ||
		isQuotation( sentenceBeginning ) ||
		isPunctuation( sentenceBeginning )
	);
}

/**
 * Checks if the token is a valid sentence ending.
 *
 * @param {Object} token The token to validate.
 * @returns {boolean} Returns true if the token is valid ending, false if it is not.
 */
function isSentenceStart( token ) {
	return ( ! isUndefined( token ) && (
		"html-start" === token.type ||
		"html-end" === token.type ||
		"block-start" === token.type
	) );
}

/**
 * Tokenizes the given text using the given tokenizer.
 *
 * @param {Object} tokenizer the tokenizer to use.
 * @param {Array} tokenArray an empty array, this gets filled with tokens.
 * @param {String} text the text to tokenize.
 * @returns {String[]} the tokens as retrieved from the text.
 */
function tokenize( tokenizer, tokenArray, text ) {
	tokenizer.onText( text );

	try {
		tokenizer.end();
	} catch ( e ) {
		console.error( "Tokenizer end error:", e, e.tokenizer2 );
	}

	return tokenArray;
}

/**
 * Returns an array of sentences for a given array of tokens, assumes that the text has already been split into blocks.
 *
 * @param {Array} tokenArray The tokens from the sentence tokenizer.
 * @returns {Array<string>} A list of sentences.
 */
function getSentencesFromTokens( tokenArray ) {
	let tokenSentences = [], currentSentence = "", nextSentenceStart;

	let sliced;

	// Drop the first and last HTML tag if both are present.
	do {
		sliced = false;
		const firstToken = tokenArray[ 0 ];
		const lastToken = tokenArray[ tokenArray.length - 1 ];

		if ( firstToken.type === "html-start" && lastToken.type === "html-end" ) {
			tokenArray = tokenArray.slice( 1, tokenArray.length - 1 );

			sliced = true;
		}
	} while ( sliced && tokenArray.length > 1 );

	forEach( tokenArray, function( token, i ) {
		let hasNextSentence;
		const nextToken = tokenArray[ i + 1 ];
		const secondToNextToken = tokenArray[ i + 2 ];
		let nextCharacters;

		let localText, localTokenizer, localSentences;
		let localTokens = [];

		switch ( token.type ) {
			case "html-start":
			case "html-end":
				if ( isBreakTag( token.src ) ) {
					tokenSentences.push( currentSentence );
					currentSentence = "";
				} else {
					currentSentence += token.src;
				}
				break;

			case "greater-than-sign-content":

				/*
					Remove the '<' from the text, to avoid matching this rule
					recursively again and again.
					We add it again later on.
				*/
				localText = token.src.substring( 1 );

				localTokenizer = createTokenizer( localTokens );
				localTokens = tokenize( localTokenizer, localTokens, localText );
				localSentences = getSentencesFromTokens( localTokens );

				// Always append first sentence to current one.
				currentSentence += " < "  + localSentences[ 0 ];

				if ( localSentences.length > 1 ) {
					/*
						There is a new sentence after the first,
						add and reset the current sentence.
					 */
					tokenSentences.push( currentSentence );
					currentSentence = "";

					// Remove the first sentence (we do not need to add it again).
					localSentences.shift();

					// Add the remaining found sentences.
					localSentences.forEach( sentence => {
						tokenSentences.push( sentence );
					} );
				}

				break;
			case "sentence":
				currentSentence += token.src;
				break;

			case "sentence-delimiter":
				currentSentence += token.src;

				if ( ! isUndefined( nextToken ) && "block-end" !== nextToken.type && "sentence-delimiter" !== nextToken.type ) {
					tokenSentences.push( currentSentence );
					currentSentence = "";
				}
				break;

			case "full-stop":
				currentSentence += token.src;

				nextCharacters = getNextTwoCharacters( [ nextToken, secondToNextToken ] );

				// For a new sentence we need to check the next two characters.
				hasNextSentence = nextCharacters.length >= 2;
				nextSentenceStart = hasNextSentence ? nextCharacters[ 1 ] : "";
				// If the next character is a number, never split. For example: IPv4-numbers.
				if ( hasNextSentence && isNumber( nextCharacters[ 0 ] ) ) {
					break;
				}
				// Only split on sentence delimiters when the next sentence looks like the start of a sentence.
				if ( ( hasNextSentence && isValidSentenceBeginning( nextSentenceStart ) ) || isSentenceStart( nextToken ) ) {
					tokenSentences.push( currentSentence );
					currentSentence = "";
				}
				break;

			case "block-start":
				currentSentence += token.src;
				break;

			case "block-end":
				currentSentence += token.src;

				nextCharacters = getNextTwoCharacters( [ nextToken, secondToNextToken ] );

				// For a new sentence we need to check the next two characters.
				hasNextSentence = nextCharacters.length >= 2;
				nextSentenceStart = hasNextSentence ? nextCharacters[ 0 ] : "";
				// If the next character is a number, never split. For example: IPv4-numbers.
				if ( hasNextSentence && isNumber( nextCharacters[ 0 ] ) ) {
					break;
				}

				if ( ( hasNextSentence && isValidSentenceBeginning( nextSentenceStart ) ) || isSentenceStart( nextToken ) ) {
					tokenSentences.push( currentSentence );
					currentSentence = "";
				}
				break;
		}
	} );

	if ( "" !== currentSentence ) {
		tokenSentences.push( currentSentence );
	}

	tokenSentences = map( tokenSentences, function( sentence ) {
		return sentence.trim();
	} );

	return tokenSentences;
}

/**
 * Returns the sentences from a certain block.
 *
 * @param {string} block The HTML inside a HTML block.
 * @returns {Array<string>} The list of sentences in the block.
 */
function getSentencesFromBlock( block ) {
	tokens = [];
	sentenceTokenizer = createTokenizer( tokens );
	tokens = tokenize( sentenceTokenizer, tokens, block );

	return tokens.length === 0 ? [] : getSentencesFromTokens( tokens );
}

const getSentencesFromBlockCached = memoize( getSentencesFromBlock );

/**
 * Returns sentences in a string.
 *
 * @param {String} text The string to count sentences in.
 * @returns {Array} Sentences found in the text.
 */
export default function( text ) {
	text = unifyWhitespace( text );
	let blocks = getBlocks( text );

	// Split each block on newlines.
	blocks = flatMap( blocks, function( block ) {
		return block.split( newLineRegex );
	} );

	const sentences = flatMap( blocks, getSentencesFromBlockCached );

	return filter( sentences, negate( isEmpty ) );
}
