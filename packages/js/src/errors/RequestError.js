/**
 * An error that should be thrown when a request has failed.
 */
export default class RequestError extends Error {
	/**
	 * An error that should be thrown when a request has failed.
	 *
	 * @param {string} message The error message or response body.
	 * @param {string} url The URL of the request that failed.
	 * @param {"POST"|"GET"|"PUT"|"DELETE"} method The HTTP method of the failed request.
	 * @param {number} statusCode The status code of the failed request.
	 * @param {string} stackTrace The stack trace.
	 */
	constructor( message, url, method, statusCode, stackTrace ) {
		super( message );
		this.name = "RequestError";
		this.url = url;
		this.method = method;
		this.statusCode = statusCode;
		this.stackTrace = stackTrace;
	}
}
