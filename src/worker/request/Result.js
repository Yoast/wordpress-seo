/**
 * Result serves as data structure for the AnalysisWorkerWrapper request result.
 */
export default class Result {
	/**
	 * Initializes a result.
	 *
	 * @param {Object} result The result.
	 * @param {Object} [data] Optional extra data.
	 */
	constructor( result, data = {} ) {
		this.result = result;
		this.data = data;
	}
}
