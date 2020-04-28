import YoastError from "./YoastError";

/**
 * Class that adds the possibility to add an URL to an error.
 */
export default class ErrorWithUrl extends YoastError {
	/**
	 * Constructs the ErrorWithUrl class.
	 *
	 * @param {string} message The error message.
	 * @param {string} url The URL where help can be found.
	 */
	constructor( message, url ) {
		super( message );
		this.url = url;
		this.name = "ErrorWithUrl";
	}
}
