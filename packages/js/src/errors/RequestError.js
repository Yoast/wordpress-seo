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
	 * @param {Object} [failingObject] The object that could not be indexed, when the backend reported one.
	 * @param {number} [failingObject.objectId] The ID of the object that failed to be indexed.
	 * @param {string} [failingObject.objectType] The type of the object that failed to be indexed.
	 */
	constructor( message, url, method, statusCode, stackTrace, failingObject = {} ) {
		super( message );
		this.name = "RequestError";
		this.url = url;
		this.method = method;
		this.statusCode = statusCode;
		this.stackTrace = stackTrace;
		this.objectId = failingObject.objectId ?? null;
		this.objectType = failingObject.objectType ?? null;
	}
}
