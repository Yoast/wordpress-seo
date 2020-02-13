/**
 *
 * @param {Object} platformRequirements A.
 * @returns {String[]} A.
 */
const createImageValidator = ( platformRequirements  ) => {
	return ( image ) => {
		const warnings = [];
		platformRequirements.forEach( test => {
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
