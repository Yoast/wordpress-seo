/**
 * The MissingArgumentError is thrown when a required argument is not passed.
 */
export default class MissingArgumentError extends Error {
	/**
	 * Constructs a MissingArgumentError.
	 * @param {string} message The message to show when the error is thrown.
	 * @constructor
	 */
	constructor( message )  {
		super( message );
		this.name = "MissingArgumentError";
	}
}
