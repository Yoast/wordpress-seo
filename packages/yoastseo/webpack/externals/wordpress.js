/**
 * Replaces any import from `@wordpress/{xyz}` with `wp.{xyz}`.
 *
 * @param {string} context The directory of the file that contains the import.
 * @param {string} request The requested import.
 * @param {Function} callback The callback function to generate the external.
 *
 * @returns {*} The external.
 */
module.exports = function wordpressExternals( context, request, callback ) {
	if ( /^@wordpress\//.test( request ) ) {
		return callback( null, [ "wp", request.replace( "@wordpress/", "" ) ] );
	}
	callback();
};
