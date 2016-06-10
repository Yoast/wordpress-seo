/**
 * Checks if `n` is between `start` and up to, but not including, `start`.
 *
 * @param {number} number The number to check.
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 */
function inRangeEndInclusive( number, start, end ) {
	return number > start && number <= end;
}

/**
 * Checks if `n` is between `start` and up to, but not including, `end`.
 *
 * @param {number} number The number to check.
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 */
function inRangeStartInclusive( number, start, end ) {
	return number >= start && number < end;
}

/**
 * Checks if `n` is between `start` and up to, but not including, `start`.
 *
 * @param {number} number The number to check.
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 */
function inRange( number, start, end ) {
	return inRangeEndInclusive( number, start, end );
}

module.exports = {
	inRange: inRange,
	inRangeStartInclusive: inRangeStartInclusive,
	inRangeEndInclusive: inRangeEndInclusive
};
