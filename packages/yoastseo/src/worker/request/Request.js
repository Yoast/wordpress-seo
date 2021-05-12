import Result from "./Result";

/**
 * Request serves as helper for the AnalysisWorkerWrapper.
 *
 * It holds the resolve and reject functions that it needs to fulfill the
 * promise. Any optional data will get included in the Result it can generate.
 */
export default class Request {
	/**
	 * Initializes a request.
	 *
	 * @param {Function} resolve The resolve function.
	 * @param {Function} reject  The reject function.
	 * @param {Object}  [data]   Optional extra data.
	 */
	constructor( resolve, reject, data = {} ) {
		this._resolve = resolve;
		this._reject = reject;
		this._data = data;
	}

	/**
	 * Resolves the request with a result.
	 *
	 * @param {Object} [payload] Optional payload.
	 *
	 * @returns {void}
	 */
	resolve( payload = {} ) {
		const result = new Result( payload, this._data );
		this._resolve( result );
	}

	/**
	 * Rejects the request with a result.
	 *
	 * @param {Object} [payload] Optional payload.
	 *
	 * @returns {void}
	 */
	reject( payload = {} ) {
		const result = new Result( payload, this._data );
		this._reject( result );
	}
}
