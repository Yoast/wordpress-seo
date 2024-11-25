/**
 * Represents a timeout error.
 */
export class TimeoutError extends Error {
	/**
	 * @param {string} message The error message.
	 */
	constructor( message ) {
		super( message );
		this.name = "TimeoutError";
	}
}
