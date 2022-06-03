import { map } from "lodash-es";
import { isUndefined } from "lodash-es";
import { isNaN } from "lodash-es";

import core from "tokenizer2/core";

import { normalize as normalizeQuotes } from "../sanitize/quotes.js";

// All characters that indicate a sentence delimiter.
const fullStop = ".";

const fullStopRegex = new RegExp( "^[" + fullStop + "]$" );
const smallerThanContentRegex = /^<[^><]*$/;
const htmlStartRegex = /^<([^>\s/]+)[^>]*>$/mi;
const htmlEndRegex = /^<\/([^>\s]+)[^>]*>$/mi;

const blockStartRegex = /^\s*[[({]\s*$/;
const blockEndRegex = /^\s*[\])}]\s*$/;

/**
 * Class for tokenizing a (html) text into sentences.
 */
export default class SentenceTokenizer {
	/**
	 * Constructor
	 * @constructor
	 */
	constructor() {
		/*
         * \u2026 - ellipsis.
         * \u06D4 - Urdu full stop.
         * \u061f - Arabic question mark.
        */
		this.sentenceDelimiters = "\"?!\u2026\u06d4\u061f";
	}

	/**
	 * Gets the sentence delimiters.
	 *
	 * @returns {string} The sentence delimiters.
	 */
	getSentenceDelimiters() {
		return this.sentenceDelimiters;
	}

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
	 * Returns whether or not a given HTML tag is a break tag.
	 *
	 * @param {string} htmlTag The HTML tag to check.
	 * @returns {boolean} Whether or not the given HTML tag is a break tag.
	 */
	isBreakTag( htmlTag ) {
		return /<br/.test( htmlTag );
	}

	/**
	 * Returns whether or not a given character is quotation mark.
	 *
	 * @param {string} character The character to check.
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
	 * @returns {boolean} Whether or not the character is a capital letter.
	 */
	isCapitalLetter( character ) {
		return character !== character.toLocaleLowerCase();
	}

	/**
	 * Checks whether the given character is a smaller than sign.
	 *
	 * This function is used to make sure that tokenizing the content after
	 * the smaller than sign works as expected.
	 * E.g. 'A sentence. < Hello world!' = ['A sentence.', '< Hello world!'].
	 *
	 * @param {string} character The character to check.
	 * @returns {boolean} Whether the character is a smaller than sign ('<') or not.
	 */
	isSmallerThanSign( character ) {
		return character === "<";
	}

	/**
	 * Retrieves the next two characters from an array with the two next tokens.
	 *
	 * @param {Array} nextTokens The two next tokens. Might be undefined.
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
	 * Checks whether a character is from a language that's written from right to left.
	 * These languages don't have capital letter forms. Therefore any letter from these languages is a
	 * potential sentence beginning.
	 *
	 * @param {string} letter The letter to check.
	 *
	 * @returns {boolean} Whether the letter is from an LTR language.
	 */
	isLetterFromSpecificLanguage( letter ) {
		const ltrLetterRanges = [
			// Hebrew characters.
			/^[\u0590-\u05fe]+$/i,
			// Arabic characters (used for Arabic, Farsi, Urdu).
			/^[\u0600-\u06FF]+$/i,
			// Additional Farsi characters.
			/^[\uFB8A\u067E\u0686\u06AF]+$/i,
		];

		return (
			ltrLetterRanges.some( ltrLetterRange => ltrLetterRange.test( letter ) )
		);
	}

	/**
	 * Checks if the sentenceBeginning beginning is a valid beginning.
	 *
	 * @param {string} sentenceBeginning The beginning of the sentence to validate.
	 * @returns {boolean} Returns true if it is a valid beginning, false if it is not.
	 */
	isValidSentenceBeginning( sentenceBeginning ) {
		return ( this.isCapitalLetter( sentenceBeginning ) ||
				this.isLetterFromSpecificLanguage( sentenceBeginning ) ||
				this.isNumber( sentenceBeginning ) ||
				this.isQuotation( sentenceBeginning ) ||
				this.isPunctuation( sentenceBeginning ) ||
				this.isSmallerThanSign( sentenceBeginning ) );
	}

	/**
	 * Checks if the token is a valid sentence start.
	 *
	 * @param {Object} token The token to validate.
	 * @returns {boolean} Returns true if the token is valid sentence start, false if it is not.
	 */
	isSentenceStart( token ) {
		return ( ! isUndefined( token ) && (
			"html-start" === token.type ||
			"html-end" === token.type ||
			"block-start" === token.type
		) );
	}

	/**
	 * Checks if the token is a valid sentence ending. A valid sentence ending is either a full stop or another
	 * delimiter such as "?", "!", etc.
	 *
	 * @param {Object} token The token to validate.
	 * @returns {boolean} Returns true if the token is valid sentence ending, false if it is not.
	 */
	isSentenceEnding( token ) {
		return (
			! isUndefined( token ) &&
			( token.type === "full-stop" || token.type === "sentence-delimiter" )
		);
	}

	/**
	 * Tokens that represent a '<', followed by content until it enters another '<' or '>'
	 * gets another pass by the tokenizer.
	 *
	 * @param {Object} token A token of type 'smaller-than-sign-content'.
	 * @param {string[]} tokenSentences The current array of found sentences. Sentences may get added by this method.
	 * @param {string} currentSentence The current sentence. Sentence parts may get appended by this method.
	 * @returns {{tokenSentences, currentSentence}} The found sentences and the current sentence, appended when necessary.
	 */
	tokenizeSmallerThanContent( token, tokenSentences, currentSentence ) {
		/*
			Remove the '<' from the text, to avoid matching this rule
			recursively again and again.
			We add it again later on.
		*/
		const localText = token.src.substring( 1 );

		// Tokenize the current smaller-than-content token without the first '<'.
		const tokenizerResult = this.createTokenizer();
		this.tokenize( tokenizerResult.tokenizer, localText );
		const localSentences = this.getSentencesFromTokens( tokenizerResult.tokens, false );

		localSentences[ 0 ] = isUndefined( localSentences[ 0 ] ) ? "<" : "<" + localSentences[ 0 ];

		/*
		 * When the first sentence has a valid sentence beginning.
		 * Add the currently build sentence to the sentences.
		 * Start building the next sentence.
		 */
		if ( this.isValidSentenceBeginning( localSentences[ 0 ] ) ) {
			tokenSentences.push( currentSentence );
			currentSentence = "";
		}
		currentSentence += localSentences[ 0 ];

		if ( localSentences.length > 1 ) {
			/*
				There is a new sentence after the first,
				add and reset the current sentence.
			 */
			tokenSentences.push( currentSentence );
			currentSentence = "";

			// Remove the first sentence (we do not need to add it again).
			localSentences.shift();
			// Last sentence gets special treatment.
			const lastSentence = localSentences.pop();

			// Add the remaining found sentences.
			localSentences.forEach( sentence => {
				tokenSentences.push( sentence );
			} );

			const sentenceEndRegex = new RegExp( "[" + fullStop + this.getSentenceDelimiters() + "]$" );

			// Check if the last sentence has a valid sentence ending.
			if ( lastSentence.match( sentenceEndRegex ) ) {
				// If so, add it as a sentence.
				tokenSentences.push( lastSentence );
			} else {
				// If not, start making a new one.
				currentSentence = lastSentence;
			}
		}
		return {
			tokenSentences,
			currentSentence,
		};
	}

	/**
	 * Creates a tokenizer.
	 *
	 * @returns {Object} The tokenizer and the tokens.
	 */
	createTokenizer() {
		const sentenceDelimiterRegex = new RegExp( "^[" + this.getSentenceDelimiters() + "]$" );
		const sentenceRegex = new RegExp( "^[^" + fullStop + this.getSentenceDelimiters() + "<\\(\\)\\[\\]]+$" );

		const tokens = [];
		const tokenizer = core( function( token ) {
			tokens.push( token );
		} );

		tokenizer.addRule( fullStopRegex, "full-stop" );
		tokenizer.addRule( smallerThanContentRegex, "smaller-than-sign-content" );
		tokenizer.addRule( htmlStartRegex, "html-start" );
		tokenizer.addRule( htmlEndRegex, "html-end" );
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
	 * @param {Object} tokenizer The tokenizer to use.
	 * @param {string} text The text to tokenize.
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
	 * Returns an array of sentences for a given array of tokens, assumes that the text has already been split into blocks.
	 *
	 * @param {Object[]} tokenArray The tokens from the sentence tokenizer.
	 * @param {boolean} [trimSentences=true] Whether to trim the sentences at the end or not.
	 *
	 * @returns {string[]} A list of sentences.
	 */
	getSentencesFromTokens( tokenArray, trimSentences = true ) {
		let tokenSentences = [], currentSentence = "", nextSentenceStart, sliced;
		console.log( tokenArray );

		// Drop the first and last HTML tag if both are present.
		do {
			sliced = false;
			const firstToken = tokenArray[ 0 ];
			const lastToken = tokenArray[ tokenArray.length - 1 ];

			if ( firstToken && lastToken && firstToken.type === "html-start" && lastToken.type === "html-end" ) {
				tokenArray = tokenArray.slice( 1, tokenArray.length - 1 );

				sliced = true;
			}
		} while ( sliced && tokenArray.length > 1 );

		tokenArray.forEach( ( token, i ) => {
			let hasNextSentence, nextCharacters, tokenizeResults;
			const nextToken = tokenArray[ i + 1 ];
			const previousToken = tokenArray[ i - 1 ];
			const secondToNextToken = tokenArray[ i + 2 ];

			nextCharacters = this.getNextTwoCharacters( [ nextToken, secondToNextToken ] );

			// For a new sentence we need to check the next two characters.
			hasNextSentence = nextCharacters.length >= 2;
			nextSentenceStart = hasNextSentence ? nextCharacters[ 1 ] : "";

			switch ( token.type ) {
				case "html-start":
				case "html-end":
					if ( this.isBreakTag( token.src ) ) {
						tokenSentences.push( currentSentence );
						currentSentence = "";
					} else {
						currentSentence += token.src;
					}
					break;

				case "smaller-than-sign-content":
					tokenizeResults = this.tokenizeSmallerThanContent( token, tokenSentences, currentSentence );
					tokenSentences = tokenizeResults.tokenSentences;
					currentSentence = tokenizeResults.currentSentence;
					break;
				case "sentence":
					currentSentence += token.src;
					break;
				case "sentence-delimiter":
					currentSentence += token.src;

					/*
				     * Only split text into sentences if:
				     * the next token is defined, AND
				     * the next token type is neither "block-end" nor "sentence-delimiter", AND
				     * the next token first character is a white space
				    */
					if ( ! isUndefined( nextToken ) &&
						"block-end" !== nextToken.type &&
						"sentence-delimiter" !== nextToken.type &&
						this.isCharacterASpace( nextToken.src[ 0 ] ) ) {
						/*
				         * Only split on ellipsis when:
					     * a) There is a next sentence, and the next character is a valid sentence beginning preceded by a white space, OR
					     * b) The next token is a sentence start
					    */
						if ( ( token.src === "\"" && previousToken.src !== "." ) ) {
							break;
						}
						console.log( previousToken.src, token.src );
						if ( token.src === "…" || token.src === "\"" ) {
							currentSentence = this.getValidSentence( hasNextSentence,
								nextSentenceStart,
								nextCharacters,
								nextToken,
								tokenSentences,
								currentSentence );
						} else {
							tokenSentences.push( currentSentence );
							currentSentence = "";
						}
					}
					break;

				case "full-stop":
					currentSentence += token.src;

					// It should not split the text if the first character of the potential next sentence is a number.
					if ( hasNextSentence && this.isNumber( nextCharacters[ 0 ] ) ) {
						break;
					}
					/*
					 * Only split on full stop when:
					 * a) There is a next sentence, and the next character is a valid sentence beginning preceded by a white space, OR
					 * b) The next token is a sentence start
					 */
					currentSentence = this.getValidSentence( hasNextSentence,
						nextSentenceStart,
						nextCharacters,
						nextToken,
						tokenSentences,
						currentSentence );
					break;

				case "block-start":
					currentSentence += token.src;
					break;

				case "block-end":
					currentSentence += token.src;

					nextCharacters = this.getNextTwoCharacters( [ nextToken, secondToNextToken ] );

					// For a new sentence we need to check the next two characters.
					hasNextSentence = nextCharacters.length >= 2;
					nextSentenceStart = hasNextSentence ? nextCharacters[ 0 ] : "";

					/* Don't split if:
					 * - The next character is a number. For example: IPv4-numbers.
					 * - The block end is preceded by a valid sentence ending, but not followed by a valid sentence beginning.
					 */
					if (
						hasNextSentence && this.isNumber( nextCharacters[ 0 ] ) ||
						( this.isSentenceEnding( previousToken ) &&
							( ! ( this.isValidSentenceBeginning( nextSentenceStart ) || this.isSentenceStart( nextToken ) ) ) )
					) {
						break;
					}

					/*
					 * Split if:
					 * - The block end is preceded by a sentence ending and followed by a valid sentence beginning.
					 */
					if (
						this.isSentenceEnding( previousToken ) &&
						( this.isSentenceStart( nextToken ) || this.isValidSentenceBeginning( nextSentenceStart ) )
					) {
						tokenSentences.push( currentSentence );
						currentSentence = "";
					}
					break;
			}
		} );

		if ( "" !== currentSentence ) {
			tokenSentences.push( currentSentence );
		}

		if ( trimSentences ) {
			tokenSentences = map( tokenSentences, function( sentence ) {
				return sentence.trim();
			} );
		}

		return tokenSentences;
	}

	/**
	 * Gets the current sentence when:
	 * a) There is a next sentence, and the next character is a valid sentence beginning preceded by a white space, OR
	 * b) The next token is a sentence start
	 *
	 * @param {boolean} hasNextSentence     Whether the next characters are more than two.
	 * @param {string} nextSentenceStart    The second character of the next characters.
	 * @param {string} nextCharacters       The string values of the next two tokens.
	 * @param {object} nextToken            The next token object.
	 * @param {array} tokenSentences        The array of pushed valid sentences.
	 * @param {string} currentSentence      The current sentence.
	 *
	 * @returns {string} The current sentence.
	 */
	getValidSentence( hasNextSentence, nextSentenceStart, nextCharacters, nextToken, tokenSentences, currentSentence ) {
		if ( ( hasNextSentence && this.isValidSentenceBeginning( nextSentenceStart ) && this.isCharacterASpace( nextCharacters[ 0 ] ) ) ||
			this.isSentenceStart( nextToken ) ) {
			tokenSentences.push( currentSentence );
			currentSentence = "";
		}
		return currentSentence;
	}

	/**
	 * Checks if the character is a whitespace.
	 *
	 * @param {string} character    The character to check.
	 * @returns {boolean}   Whether the character is a whitespace.
	 */
	isCharacterASpace( character ) {
		return /\s/.test( character );
	}
}
