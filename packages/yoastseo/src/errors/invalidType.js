/**
 * The InvalidTypeError is thrown when an invalid type is passed as an argument.
 */
export default class InvalidTypeError extends Error {
	/**
	 * Constructs an InvalidTypeError.
	 * @param {string} message The message to show when the error is thrown.
	 * @constructor
	 */
	constructor( message )  {
		super( message );
		this.name = "InvalidTypeError";
	}
}
