/**
 * Returns true or false, based on the length of the value text and the recommended value.
 *
 * @param {number} recommendedValue The recommended value.
 * @param {number} valueLength      The length of the value to check.
 * @returns {boolean} True if the length is greater than the recommendedValue, false if it is smaller.
 */
module.exports = function( recommendedValue, valueLength ) {
	return valueLength > recommendedValue;
};
