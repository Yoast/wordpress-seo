/**
 * An error that should be thrown when parsing something has failed.
 */
export default class ParseError extends Error {
	/**
	 * An error that should be thrown when parsing something has failed.
	 *
	 * @param {string} message The error message.
	 * @param {string} parseString The string that could not be parsed.
	 */
	constructor( message, parseString ) {
		super( message );
		this.name = "ParseError";
		this.parseString = parseString;
	}
}
