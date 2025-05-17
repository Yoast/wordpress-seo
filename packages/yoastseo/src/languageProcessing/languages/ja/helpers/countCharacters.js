import { languageProcessing } from "yoastseo";
const { sanitizeString } = languageProcessing;
import removeURLs from "../../../helpers/sanitize/removeURLs.js";

/**
 * Calculates the character count which serves as a measure of text length.
 * The character count includes letters and numbers. It doesn't include URLs, HTML tags, spaces, and common punctuation characters.
 *
 * @param {string} text The text to be counted.
 *
 * @returns {number} The character count of the given text.
 */
export default function( text ) {
	text = removeURLs( text );
	text = sanitizeString( text );
	text = text.replace( /\s/g, "" );
	// 1st 〜: wave dash (U+301C); 2nd ～: fullwidth tilde (U+FF5E)
	// The list includes a few "Western" punctuation marks, added at the end, because they pop up in online Japanese text from time to time.
	text = text.replace( /[。．？！…‥，、・―〜～：゠＝（）「」『』〝〟〔〕【】［］｛｝〈〉《》.?!:;()"'<>]/g, "" );

	return text.length;
}

