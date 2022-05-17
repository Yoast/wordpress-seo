import { map } from "lodash-es";
import { isUndefined } from "lodash-es";
import { isNaN } from "lodash-es";

import { normalize as normalizeQuotes } from "../../../../helpers/sanitize/quotes.js";
import SentenceTokenizer from "../../../../helpers/sentence/SentenceTokenizer";

/*
 * \u2026 - ellipsis.
 * \u3002 - Japanese ideographic full stop.
 * \uFF61 - Japanese half-width ideographic full stop.
 * \uFF01 - Japanese full-width exclamation mark.
 * \u203C - Japanese double exclamation mark.
 * \uFF1F - Japanese fullwidth question mark.
 * \u2047 - Japanese double question mark.
 * \u2049 - Japanese exclamation question mark.
 * \u2048 - Japanese question exclamation mark.
 * \u2026 - Japanese horizontal ellipsis.
 * \u2025 - Japanese two dot leader.
 */
const sentenceDelimiters = "?!;\u2026\u3002\uFF61\uFF01\u203C\uFF1F\u2047\u2049\u2048\u2049\u2026\u2025";

/**
 * Class for tokenizing a (html) text into sentences.
 */
export default class JapaneseSentenceTokenizer extends SentenceTokenizer {
	/**
	 * Constructor
	 * @constructor
	 */
	constructor() {
		super();
		this.sentenceDelimiters = sentenceDelimiters;
	}

	/**
	 * Returns whether or not a certain character is a number.
	 *
	 * @param {string} character The character to check.
	 * @returns {boolean} Whether or not the character is a capital letter.
	 */
	isNumber( character ) {
		const japaneseNumbers = [
			// Full-width.
			/^[\uFF10-\uFF19]+$/i,
			// Circled digit, parenthesized digit, and digit with full stop.
			/^[\u2460-\u249B]+$/i,
			// Parenthesized ideograph.
			/^[\u3220-\u3229]+$/i,
			// Circled ideograph.
			/^[\u3280-\u3289]+$/i,
		];

		return ( ! isNaN( parseInt( character, 10 ) ) || japaneseNumbers.some( numberRange => numberRange.test( character ) ) );
	}

	/**
	 * Returns whether or not a given character is quotation mark.
	 *
	 * @param {string} character The character to check.
	 * @returns {boolean} Whether or not the given character is a quotation mark.
	 */
	isQuotation( character ) {
		character = normalizeQuotes( character );

		const japaneseOpeningQuotationMark = /^[\u300C\u300E\u3008\u3014\u3010\uFF5B\uFF3B]+$/i;

		return "'" === character || "\"" === character || japaneseOpeningQuotationMark.test( character );
	}

	/**
	 * Checks whether a character is from Japanese language that could be sentence beginning.
	 *
	 * @param {string} letter The letter to check.
	 *
	 * @returns {boolean} Whether the letter is from Japanese language that could be sentence beginning.
	 */
	isLetterFromSpecificLanguage( letter ) {
		const japaneseLetterRanges = [
			// Hiragana.
			/^[\u3040-\u3096]+$/i,
			// Katakana full-width.
			/^[\u30A1-\u30FA]+$/i,
			/^[\u31F0-\u31FF]+$/i,
			// Katakana half-width.
			/^[\uFF66-\uFF9D]+$/i,
			// Kanji.
			/^[\u4E00-\u9FFC]+$/i,
		];

		return (
			japaneseLetterRanges.some( ltrLetterRange => ltrLetterRange.test( letter ) )
		);
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

					if ( ! isUndefined( nextToken ) &&
						"block-end" !== nextToken.type &&
						"sentence-delimiter" !== nextToken.type ) {
						tokenSentences.push( currentSentence );
						currentSentence = "";
					}
					break;

				case "full-stop":
					currentSentence += token.src;

					nextCharacters = this.getNextTwoCharacters( [ nextToken, secondToNextToken ] );

					// For a new sentence we need to check the next two characters.
					hasNextSentence = nextCharacters.length >= 2;
					nextSentenceStart = hasNextSentence ? nextCharacters[ 1 ] : "";
					// If the next character is a number, never split. For example: IPv4-numbers.
					if ( hasNextSentence && this.isNumber( nextCharacters[ 0 ] ) ) {
						break;
					}
					// Only split on sentence delimiters when the next sentence looks like the start of a sentence and it's preceded by a whitespace.
					if ( ( hasNextSentence && this.isValidSentenceBeginning( nextSentenceStart ) ) ||
						this.isSentenceStart( nextToken ) ) {
						tokenSentences.push( currentSentence );
						currentSentence = "";
					}
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
}

