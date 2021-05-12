/**
 * Takes an array cointaning validation functions. Then runs each of these functions and expects them to result in a string or a boolean.
 * When the result is a string it pushes this to an array. The final output will be this array.
 *
 * @param {Function[]} platformValidations Validation functions that resolve to a warningString | true.
 *
 * @returns {string[]} An array with warnings.
 */
const createImageValidator = ( platformValidations ) => {
	return image => platformValidations
		.map( test => test( image ) )
		.filter( result => result !== true );
};

export default createImageValidator;
