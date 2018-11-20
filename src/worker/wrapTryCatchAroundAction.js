import { compact } from "lodash-es";

/**
 * Wraps the given action in a try-catch that logs the error message.
 *
 * @param {Logger}   logger                  The logger instance to log with.
 * @param {Function} action                  The action to safely run.
 * @param {string}   [errorMessagePrefix=""] The prefix of the error message.
 *
 * @returns {Function} The wrapped action.
 */
export default function wrapTryCatchAroundAction( logger, action, errorMessagePrefix = "" ) {
	return ( ...args ) => {
		try {
			return action( ...args );
		} catch ( error ) {
			let errorMessage = [ errorMessagePrefix ];

			if ( error.name && error.message ) {
				if ( error.stack ) {
					logger.debug( error.stack );
				}
				// Standard JavaScript error (e.g. when calling `throw new Error( message )`).
				errorMessage.push( `${error.name}: ${error.message}` );
			}

			errorMessage = compact( errorMessage ).join( "\n\t" );
			logger.error( errorMessage );
			return { error: errorMessage };
		}
	};
}
