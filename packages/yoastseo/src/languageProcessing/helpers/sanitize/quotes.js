import { singleQuotesForRegex, doubleQuotesForRegex } from "../../../config/punctuation";
/**
 * Normalizes single quotes to 'regular' quotes.
 *
 * @param {string} text Text to normalize.
 * @returns {string} The normalized text.
 */
function normalizeSingleQuotes( text ) {
	return text.replace( /[‘’‛`‹›]/g, "'" );
	// return text.replace( new RegExp( `[${singleQuotesForRegex}]`, "g" ), "'" );
}

/**
 * Normalizes double quotes to 'regular' quotes.
 *
 * @param {string} text Text to normalize.
 * @returns {string} The normalized text.
 */
function normalizeDoubleQuotes( text ) {
	return text.replace( /[“”〝〞〟‟„『』«»]/g, "\"" );
	// return text.replace( new RegExp( `[${doubleQuotesForRegex}]`, "g" ), "\"" );
}

/**
 * Normalizes quotes to 'regular' quotes.
 *
 * @param {string} text Text to normalize.
 * @returns {string} The normalized text.
 */
function normalizeQuotes( text ) {
	return normalizeDoubleQuotes( normalizeSingleQuotes( text ) );
}

export {
	normalizeSingleQuotes as normalizeSingle,
	normalizeDoubleQuotes as normalizeDouble,
	normalizeQuotes as normalize,
};

export default {
	normalizeSingle: normalizeSingleQuotes,
	normalizeDouble: normalizeDoubleQuotes,
	normalize: normalizeQuotes,
};
