/**
 * Normalizes single quotes to 'regular' quotes.
 *
 * @param {string} text Text to normalize.
 * @returns {string} The normalized text.
 */
function normalizeSingleQuotes( text ) {
	return text.replace( /[‘’‛`]/g, "'" );
}

/**
 * Normalizes double quotes to 'regular' quotes.
 *
 * @param {string} text Text to normalize.
 * @returns {string} The normalized text.
 */
function normalizeDoubleQuotes( text ) {
	return text.replace( /[“”〝〞〟‟„]/g, "\"" );
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

export default {
	normalizeSingle: normalizeSingleQuotes,
	normalizeDouble: normalizeDoubleQuotes,
	normalize: normalizeQuotes,
};
