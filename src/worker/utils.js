/**
 * Encodes the payload for transfer.
 *
 * @param {Object} payload The payload.
 *
 * @returns {string} Transferable string.
 */
export function encodePayload( payload ) {
	return JSON.stringify( payload );
}

/**
 * Decodes the payload for use.
 *
 * @param {string} payload The encoded payload.
 *
 * @returns {any} The parsed result.
 */
export function decodePayload( payload ) {
	try {
		return JSON.parse( payload );
	} catch( error ) {
		return payload;
	}
}
