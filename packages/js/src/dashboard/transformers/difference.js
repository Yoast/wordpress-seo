/**
 * @param {number} number The number to check.
 * @returns {boolean} True if not falsy except 0.
 */
const isValidNumber = ( number ) => ! number && number !== 0;

/**
 * @param {number} current The current.
 * @param {number} previous The previous.
 * @returns {number} The difference, as percentage.
 */
export const getDifference = ( current, previous ) => {
	// Invalid values (falsy except 0) => return NaN.
	// Because there is nothing to say about the difference.
	if ( isValidNumber( current ) || isValidNumber( previous ) ) {
		return NaN;
	}

	// No difference, preventing the both 0 divide by 0.
	if ( current === previous ) {
		return 0;
	}

	// Divide by 0. Instead of Infinite, we go for "logical" 100% increase instead.
	if ( previous === 0 ) {
		return 1;
	}

	return ( current - previous ) / previous;
};
