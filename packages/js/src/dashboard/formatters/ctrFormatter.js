/**
 * Convert decimal position number.
 *
 * @param {number} ctr The number of ctr.
 *
 * @returns {string} The formatted ctr.
 */
export const ctrFormatter = ( ctr, languageCode ) => {
	return new Intl.NumberFormat( languageCode, { style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 } ).format( ctr );
};
