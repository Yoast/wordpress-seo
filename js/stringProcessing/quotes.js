/**
 * Normalizes single quotes to 'regular' quotes
 *
 * @param {string} text Text to normalize.
 * @returns {string} text The normalized text.
 */
function normalizeSingleQuotes( text ) {
	return text
		.replace( "‘", "'" )
		.replace( "’", "'" )
		.replace( "‛", "'" )
		.replace( "`", "'" );
}

module.exports = {
	normalizeSingle: normalizeSingleQuotes
};
