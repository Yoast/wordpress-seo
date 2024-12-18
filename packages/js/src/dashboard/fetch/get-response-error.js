import { TimeoutError } from "./timeout-error";

/**
 * @param {Response} response The response.
 * @returns {Error} The error that corresponds to the response.
 */
export const getResponseError = ( response ) => {
	switch ( response.status ) {
		case 408:
			return new TimeoutError( "request timed out" );
		default:
			return new Error( "not ok" );
	}
};
