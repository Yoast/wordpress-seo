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
 * \u2025 - Japanese two dot leader.
 */
const sentenceDelimiters = "?!;\u2026\u3002\uFF61\uFF01\u203C\uFF1F\u2047\u2049\u2048\u2049\u2025";

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
	 * Returns whether a certain character is a number.
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
	 * Returns whether a given character is quotation mark.
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
	 * Always returns true as Japanese sentence beginning doesn't need to be preceded by a whitespace to be a valid one.
	 *
	 * @returns {true}  Always true.
	 */
	isCharacterASpace() {
		return true;
	}
}

