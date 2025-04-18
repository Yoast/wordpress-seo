/**
 * @param {number} [min=0] The minimum number.
 * @param {number} [max=100] The maximum number.
 * @returns {number} The random number.
 */
export const getRandom = ( min = 0, max = 100 ) => Math.floor( Math.random() * ( max - min + 1 ) ) + min;

/**
 * @param {number} [min=0] The minimum number.
 * @param {number} [max=100] The maximum number.
 * @param {number} [amount=28] The amount of random numbers to generate.
 * @returns {number[]} An array of random numbers.
 */
export const getRandomArray = ( min = 0, max = 100, amount = 28 ) => Array.from(
	{ length: amount },
	getRandom.bind( null, min, max )
);
