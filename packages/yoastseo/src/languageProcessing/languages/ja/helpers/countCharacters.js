import { languageProcessing } from "yoastseo";
const { sanitizeString } = languageProcessing;

/**
 * Calculates the character count of a text, including punctuation and numbers. Is used to determine length of text.
 *
 * @param {string} text The text to be counted.
 *
 * @returns {number} The word count of the given text.
 */
export default function( text ) {
	// This regex is used to match URLs in the text, either embedded in tags or not, so that they are excluded from the characters count.
	// eslint-disable-next-line max-len
	const urlRegex = new RegExp( "(http(s)?:\\/\\/.)?(www\\.|ftp:\\/\\/)?[-a-zA-Z0-9@:%._\\/+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\/+.~#?&()=]*)", "igm" );
	text = text.replace( urlRegex, "" );
	text = sanitizeString( text );

	return text.length;
}
