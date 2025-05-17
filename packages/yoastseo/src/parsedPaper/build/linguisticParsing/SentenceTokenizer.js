import { isNaN, isUndefined } from "lodash";

import core from "tokenizer2/core";
import { normalize as normalizeQuotes } from "../../../languageProcessing/helpers/sanitize/quotes";

import Sentence from "./Sentence";

// All characters that indicate a sentence delimiter.
const fullStop = ".";
// The \u2026 character is an ellipsis
const sentenceDelimiters = "?!;\u2026";

const fullStopRegex = new RegExp( "^[" + fullStop + "]$" );
const sentenceDelimiterRegex = new RegExp( "^[" + sentenceDelimiters + "]$" );
const sentenceRegex = new RegExp( "^[^" + fullStop + sentenceDelimiters + "\\(\\)\\[\\]]+$" );

const blockStartRegex = /^\s*[[({]\s*$/;
const blockEndRegex = /^\s*[\])}]\s*$/;

const whiteSpaceStartRegex = /^\s*/;
const whiteSpaceEndRegex = /\s*$/;

/**
 * Class for tokenizing a (html) text into sentences.
 */
export default class SentenceTokenizer {
	/**
	 * Returns whether or not a certain character is a number.
	 *
	 * @param {string} character The character to check.
	 * @returns {boolean} Whether or not the character is a capital letter.
	 */
	isNumber( character ) {
		return ! isNaN( parseInt( character, 10 ) );
	}

	/**
	 * Returns whether or not a given character is quotation mark.
	 *
	 * @param {string} character The character to check.
	 *
	 * @returns {boolean} Whether or not the given character is a quotation mark.
	 */
	isQuotation( character ) {
		character = normalizeQuotes( character );

		return "'" === character ||
			"\"" === character;
	}

	/**
	 * Returns whether or not a given character is a punctuation mark that can be at the beginning
	 * of a sentence, like ¿ and ¡ used in Spanish.
	 *
	 * @param {string} character The character to check.
	 *
	 * @returns {boolean} Whether or not the given character is a punctuation mark.
	 */
	isPunctuation( character ) {
		return "¿" === character ||
			"¡" === character;
	}

	/**
	 * Removes duplicate whitespace from a given text.
	 *
	 * @param {string} text The text with duplicate whitespace.
	 * @returns {string} The text without duplicate whitespace.
	 */
	removeDuplicateWhitespace( text ) {
		return text.replace( /\s+/, " " );
	}

	/**
	 * Returns whether or not a certain character is a capital letter.
	 *
	 * @param {string} character The character to check.
	 *
	 * @returns {boolean} Whether or not the character is a capital letter.
	 */
	isCapitalLetter( character ) {
		return character !== character.toLocaleLowerCase();
	}

	/**
	 * Retrieves the next two characters from an array with the two next tokens.
	 *
	 * @param {Array} nextTokens The two next tokens. Might be undefined.
	 *
	 * @returns {string} The next two characters.
	 */
	getNextTwoCharacters( nextTokens ) {
		let next = "";

		if ( ! isUndefined( nextTokens[ 0 ] ) ) {
			next += nextTokens[ 0 ].src;
		}

		if ( ! isUndefined( nextTokens[ 1 ] ) ) {
			next += nextTokens[ 1 ].src;
		}

		next = this.removeDuplicateWhitespace( next );

		return next;
	}

	/**
	 * Checks if the sentenceBeginning beginning is a valid beginning.
	 *
	 * @param {string} sentenceBeginning The beginning of the sentence to validate.
	 *
	 * @returns {boolean} Returns true if it is a valid beginning, false if it is not.
	 */
	isValidSentenceBeginning( sentenceBeginning ) {
		return (
			this.isCapitalLetter( sentenceBeginning ) ||
			this.isNumber( sentenceBeginning ) ||
			this.isQuotation( sentenceBeginning ) ||
			this.isPunctuation( sentenceBeginning )
		);
	}

	/**
	 * Checks if the token is a valid sentence ending.
	 *
	 * @param {Object} token The token to validate.
	 *
	 * @returns {boolean} Returns true if the token is valid ending, false if it is not.
	 */
	isSentenceStart( token ) {
		return ( ! isUndefined( token ) && (
			"html-start" === token.type ||
			"html-end" === token.type ||
			"block-start" === token.type
		) );
	}

	/**
	 * Creates a tokenizer.
	 *
	 * @returns {Object} The tokenizer and the tokens.
	 */
	createTokenizer() {
		const tokens = [];
		const tokenizer = core( function( token ) {
			tokens.push( token );
		} );

		tokenizer.addRule( fullStopRegex, "full-stop" );
		tokenizer.addRule( blockStartRegex, "block-start" );
		tokenizer.addRule( blockEndRegex, "block-end" );
		tokenizer.addRule( sentenceDelimiterRegex, "sentence-delimiter" );
		tokenizer.addRule( sentenceRegex, "sentence" );

		return {
			tokenizer,
			tokens,
		};
	}

	/**
	 * Tokenizes the given text using the given tokenizer.
	 *
	 * @param {Tokenizer} tokenizer The tokenizer to use.
	 * @param {string}    text      The text to tokenize.
	 *
	 * @returns {void}
	 */
	tokenize( tokenizer, text ) {
		tokenizer.onText( text );

		try {
			tokenizer.end();
		} catch ( e ) {
			console.error( "Tokenizer end error:", e, e.tokenizer2 );
		}
	}

	/**
	 * Determines the start and end indices of a set of sentences form a text.
	 *
	 * @param {Sentence[]} sentences A set of sentences for which to determine indices.
	 *
	 * @returns {void}
	 */
	determineIndices( sentences ) {
		let currentIndex = 0;

		for ( const sentence of sentences ) {
			const startIndex = currentIndex;
			sentence.setStartIndex( currentIndex );
			const endIndex = startIndex + sentence.text.length - 1;
			sentence.setEndIndex( endIndex );
			currentIndex = endIndex + 1;
		}
	}

	/**
	 * Trims the white space from the beginning of a sentence and adjusts the sentence start index accordingly.
	 *
	 * @param {Sentence} sentence The sentence for which to trim the white space at the start.
	 *
	 * @returns {void}
	 */
	trimWhiteSpaceAtStart( sentence ) {
		const whiteSpaceLength = sentence.text.match( whiteSpaceStartRegex )[ 0 ].length;
		sentence.setText( sentence.getText().slice( whiteSpaceLength ) );
		sentence.setStartIndex( sentence.getStartIndex() + whiteSpaceLength  );
	}

	/**
	 * Trims the white space from the end of a sentence and adjusts the sentence end index accordingly.
	 *
	 * @param {Sentence} sentence The sentence for which to trim the white space at the end.
	 *
	 * @returns {void}
	 */
	trimWhiteSpaceAtEnd( sentence ) {
		const whiteSpaceLength = sentence.text.match( whiteSpaceEndRegex )[ 0 ].length;
		sentence.setText( sentence.getText().slice( 0, sentence.getText().length - whiteSpaceLength ) );
		sentence.setEndIndex( sentence.getEndIndex() - whiteSpaceLength );
	}

	/**
	 * Trims white space from the beginning and end of sentences and adjusts the indices
	 * of the sentence beginnings and ends accordingly.
	 *
	 * @param {Sentence[]} sentences The sentences for which to trim the whitespace.
	 *
	 * @returns {void}
	 */
	trimWhiteSpaces( sentences ) {
		for ( const sentence of sentences ) {
			this.trimWhiteSpaceAtStart( sentence );
			this.trimWhiteSpaceAtEnd( sentence );
		}
	}

	/**
	 * Returns an array of sentence objects for a given array of tokens; assumes that the text has already been split into blocks.
	 *
	 * @param {Object[]} tokenArray The tokens from the sentence tokenizer.
	 *
	 * @returns {Sentence[]} An array of sentence objects.
	 */
	getSentencesFromTokens( tokenArray ) {
		const tokenSentences = [];
		let currentSentence = new Sentence( "", 0, 0 ),
			nextSentenceStart;

		tokenArray.forEach( ( token, i ) => {
			let hasNextSentence, nextCharacters;
			const nextToken = tokenArray[ i + 1 ];
			const secondToNextToken = tokenArray[ i + 2 ];

			switch ( token.type ) {
				case "sentence":
					currentSentence.appendText( token.src );
					break;

				case "sentence-delimiter":
					currentSentence.appendText( token.src );
					if ( ! isUndefined( nextToken ) && "block-end" !== nextToken.type && "sentence-delimiter" !== nextToken.type ) {
						tokenSentences.push( currentSentence );
						currentSentence = new Sentence( "" );
					}
					break;

				case "full-stop":
					currentSentence.appendText( token.src );

					nextCharacters = this.getNextTwoCharacters( [ nextToken, secondToNextToken ] );

					// For a new sentence we need to check the next two characters.
					hasNextSentence = nextCharacters.length >= 2;
					nextSentenceStart = hasNextSentence ? nextCharacters[ 1 ] : "";
					// If the next character is a number, never split. For example: IPv4-numbers.
					if ( hasNextSentence && this.isNumber( nextCharacters[ 0 ] ) ) {
						break;
					}
					// Only split on sentence delimiters when the next sentence looks like the start of a sentence.
					if ( ( hasNextSentence && this.isValidSentenceBeginning( nextSentenceStart ) ) || this.isSentenceStart( nextToken ) ) {
						tokenSentences.push( currentSentence );
						currentSentence = new Sentence( "" );
					}
					break;

				case "block-start":
					currentSentence.appendText( token.src );
					break;

				case "block-end":
					currentSentence.appendText( token.src );
					nextCharacters = this.getNextTwoCharacters( [ nextToken, secondToNextToken ] );

					// For a new sentence we need to check the next two characters.
					hasNextSentence = nextCharacters.length >= 2;
					nextSentenceStart = hasNextSentence ? nextCharacters[ 0 ] : "";
					// If the next character is a number, never split. For example: IPv4-numbers.
					if ( hasNextSentence && this.isNumber( nextCharacters[ 0 ] ) ) {
						break;
					}

					if ( ( hasNextSentence && this.isValidSentenceBeginning( nextSentenceStart ) ) || this.isSentenceStart( nextToken ) ) {
						tokenSentences.push( currentSentence );
						currentSentence = new Sentence( "" );
					}
					break;
			}
		} );

		if ( currentSentence.getText()  !== ""  ) {
			tokenSentences.push( currentSentence );
		}

		this.determineIndices( tokenSentences );

		this.trimWhiteSpaces( tokenSentences );

		return tokenSentences;
	}
}
