/**
 * An error that should be thrown when an import validation has failed.
 */
export default class ImportValidationError extends Error {
	/**
	 * An error that should be thrown when an import validation has failed.
	 *
	 * @param {string} message The error message or response body.
	 */
	constructor( message ) {
		super( message );
		this.name = "ImportValidationError";
	}
}
