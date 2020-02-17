/** Takes an array cointaning validation functions. Then runs each of these functions and expects them to result in a string or a boolean.
 * When the result is a string it pushes this to an array. The final output will be this array.
 *
 * @param {Function[]} platformValidations Validation functions that resolve to a warningString | true.
 * @returns {String[]} An array with warnings.
 */
const createImageValidator = ( platformValidations ) => {
	return ( image ) => {
		const warnings = [];

		platformValidations.forEach( test => {
			const result = test( image );

			if ( result === true ) {
				return;
			}

			warnings.push( result );
		} );
		return warnings;
	};
};

export default createImageValidator;
