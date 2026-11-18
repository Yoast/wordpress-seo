const SINGLE_QUOTES_ARRAY = [ "'", "‘", "’", "‛", "`", "‹", "›" ];
const SINGLE_QUOTES_REGEX = new RegExp( "[" + SINGLE_QUOTES_ARRAY.join( "" ) + "]", "g" );

/**
 * Normalizes single quotes to 'regular' quotes.
 *
 * @param {string} text Text to normalize.
 * @returns {string} The normalized text.
 */
function normalizeSingleQuotes( text ) {
	return text.replace( SINGLE_QUOTES_REGEX, "'" );
}

/**
 * Normalizes double quotes to 'regular' quotes.
 *
 * @param {string} text Text to normalize.
 * @returns {string} The normalized text.
 */
function normalizeDoubleQuotes( text ) {
	return text.replace( /[“”〝〞〟‟„『』«»]/g, "\"" );
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
	SINGLE_QUOTES_REGEX,
	SINGLE_QUOTES_ARRAY,
};

export default {
	normalizeSingle: normalizeSingleQuotes,
	normalizeDouble: normalizeDoubleQuotes,
	normalize: normalizeQuotes,
};
