const { toPaper } = require( "yoastseo/contract" );

/**
 * Builds a Paper from the request body via the PaperDTO contract (`yoastseo/contract`).
 *
 * On a structurally invalid body (wrong types, unknown keys, missing `text`) it responds with a 400 and
 * returns null, so callers should bail when the result is falsy.
 *
 * @param {Object} request  The Express request.
 * @param {Object} response The Express response.
 * @returns {Object|null} The constructed Paper, or null when the body was rejected.
 */
const paperFromRequest = ( request, response ) => {
	try {
		return toPaper( request.body || {} );
	} catch ( error ) {
		response.status( 400 ).json( { error: "Invalid request body", details: error.issues || String( error ) } );
		return null;
	}
};

module.exports = { paperFromRequest };
