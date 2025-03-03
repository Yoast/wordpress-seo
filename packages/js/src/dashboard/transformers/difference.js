/**
 * @param {number} current The current.
 * @param {number} previous The previous.
 * @returns {number} The difference, as percentage.
 */
export const getDifference = ( current, previous ) => {
	// No difference, preventing the both 0 divide by 0.
	if ( current === previous ) {
		return 0;
	}

	return ( current - previous ) / previous;
};
