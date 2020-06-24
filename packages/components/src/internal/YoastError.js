/**
 * Class that adds the possibility to add an URL to an error.
 */
export default class YoastError extends Error {
	/**
	 * Constructs the YoastError class.
	 *
	 * @param {string} message The error message.
	 */
	constructor( message ) {
		super( message );
		this.type = "YoastError";
	}
}
