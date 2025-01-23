/**
 * Convert position number.
 *
 * @param {number} position The number of position.
 *
 * @returns {string} The formatted position.
 */
export const positionFormatter = ( position, languageCode ) => {
	return new Intl.NumberFormat( languageCode, { minimumFractionDigits: 2, maximumFractionDigits: 2 } ).format( position );
};
