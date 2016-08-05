var isUndefined = require( "lodash/isUndefined" );

/**
 * Shows and error trace of the error message in the console if the console is available.
 *
 * @param {string} [errorMessage=""] The error message.
 */
function showTrace( errorMessage ) {
	if ( isUndefined( errorMessage ) ) {
		errorMessage = "";
	}

	if (
		!isUndefined( console ) &&
		!isUndefined( console.trace )
	) {
		console.trace( errorMessage );
	}
}

module.exports = {
	showTrace: showTrace,
};
