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

var fullStopRegex = new RegExp( "^[" + fullStop + "]$" );
var sentenceDelimiterRegex = new RegExp( "^[" + sentenceDelimiters + "]$" );
var sentenceRegex = new RegExp( "^[^" + fullStop + sentenceDelimiters + "<\\(\\)\\[\\]]+$" );
var greaterThanContentRegex = /^<[^><]*$/;
var htmlStartRegex = /^<([^>\s/]+)[^>]*>$/mi;
var htmlEndRegex = /^<\/([^>\s]+)[^>]*>$/mi;
var newLineRegex = new RegExp( newLines );
const sentenceEndRegex = new RegExp( "([" + fullStop + sentenceDelimiters + "])$" );

const blockStartRegex = /^\s*[[({]\s*$/;
const blockEndRegex = /^\s*[\])}]\s*$/;

let tokens = [];
let sentenceTokenizer;

/**
 * Creates a tokenizer to create tokens from a sentence.
 *
 * @returns {void}
 */
function createTokenizer() {
	tokens = [];

	sentenceTokenizer = core( function( token ) {
		tokens.push( token );
	} );

	sentenceTokenizer.addRule( greaterThanContentRegex, "greater-than-sign-content" );
	sentenceTokenizer.addRule( htmlStartRegex, "html-start" );
	sentenceTokenizer.addRule( htmlEndRegex, "html-end" );
	sentenceTokenizer.addRule( blockStartRegex, "block-start" );
	sentenceTokenizer.addRule( blockEndRegex, "block-end" );
	sentenceTokenizer.addRule( fullStopRegex, "full-stop" );
	sentenceTokenizer.addRule( sentenceDelimiterRegex, "sentence-delimiter" );
	sentenceTokenizer.addRule( sentenceRegex, "sentence" );
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
 * Tokenizes a sentence, assumes that the text has already been split into blocks.
 *
 * @param {string} text The text to tokenize.
 * @returns {Array} An array of tokens.
 */
function tokenizeSentences( text ) {
	createTokenizer();
	sentenceTokenizer.onText( text );

	try {
		sentenceTokenizer.end();
	} catch ( e ) {
		console.error( "Tokenizer end error:", e, e.tokenizer2 );
	}

	return tokens;
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

function greaterThanSignContentTokenizer( tokens ) {
	let tokenizer = core( function( token ) {
		tokens.push( token );
	} );

	tokenizer.addRule( htmlStartRegex, "html-start" );
	tokenizer.addRule( htmlEndRegex, "html-end" );
	tokenizer.addRule( blockStartRegex, "block-start" );
	tokenizer.addRule( blockEndRegex, "block-end" );
	tokenizer.addRule( fullStopRegex, "full-stop" );
	tokenizer.addRule( sentenceDelimiterRegex, "sentence-delimiter" );
	tokenizer.addRule( sentenceRegex, "sentence" );

	return tokenizer;
}

function tokenize( tokenizer, tokens, text ) {
	tokenizer.onText( text );

	try {
		tokenizer.end();
	} catch ( e ) {
		console.error( "Tokenizer end error:", e, e.tokenizer2 );
	}

	return tokens;
}

/**
 * Returns an array of sentences for a given array of tokens, assumes that the text has already been split into blocks.
 *
 * @param {Array} tokens The tokens from the sentence tokenizer.
 * @returns {Array<string>} A list of sentences.
 */
function getSentencesFromTokens( tokens ) {
	let tokenSentences = [], currentSentence = "", nextSentenceStart;

	let sliced;

	// Drop the first and last HTML tag if both are present.
	do {
		sliced = false;
		const firstToken = tokens[ 0 ];
		const lastToken = tokens[ tokens.length - 1 ];

		if ( firstToken.type === "html-start" && lastToken.type === "html-end" ) {
			tokens = tokens.slice( 1, tokens.length - 1 );

			sliced = true;
		}
	} while ( sliced && tokens.length > 1 );

	forEach( tokens, function( token, i ) {
		let hasNextSentence;
		const nextToken = tokens[ i + 1 ];
		const secondToNextToken = tokens[ i + 2 ];
		let nextCharacters;

		// console.log( token );

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
				let localTokens = [];

				// Remove the '<' from the text, to make tokenization easier.
				// We add it again later on.
				let text = token.src.substring(1);

				let localTokenizer = greaterThanSignContentTokenizer( localTokens );
				localTokens = tokenize( localTokenizer, localTokens, text );
				let localSentences = getSentencesFromTokens( localTokens );

				console.log( localSentences );

				const firstSentence = localSentences.shift();
				const lastSentence = localSentences.pop();

				// Check if the '<' was at the beginning of the sentence.
				// E.g. 'Sentence.[ <Another sentence.]'.
				// Treat the first sentence as a new sentence.
				if( isValidSentenceBeginning( firstSentence[0] ) ) {
					tokenSentences.push( " < " + firstSentence );
					currentSentence = "";
				} else {
					currentSentence += " < " + firstSentence;
				}


				if( sentenceEndRegex.test( currentSentence ) ) {
					tokenSentences.push( currentSentence );
					currentSentence = lastSentence ? lastSentence : "";
				}

				localSentences.forEach( sent => {
					tokenSentences.push( sent );
				} );

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
	const tokens = tokenizeSentences( block );

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
	let sentences, blocks = getBlocks( text );

	// Split each block on newlines.
	blocks = flatMap( blocks, function( block ) {
		return block.split( newLineRegex );
	} );

	sentences = flatMap( blocks, getSentencesFromBlockCached );

	return filter( sentences, negate( isEmpty ) );
}
