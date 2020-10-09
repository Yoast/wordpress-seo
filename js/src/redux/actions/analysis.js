export const ANALYZE_DATA_REQUEST = "ANALYZE_DATA_REQUEST";
export const ANALYZE_DATA_SUCCESS = "ANALYZE_DATA_SUCCESS";

/**
 * The analysisRequest action creator.
 *
 * @returns {Object} The analysisRequest action.
 */
function analysisRequest() {
	return { type: ANALYZE_DATA_REQUEST };
}

/**
 * The analysisSuccess action creator.
 *
 * @param {Object} results The results of the analysis.
 *
 * @returns {Object} The analysisSuccess action.
 */
function analysisSuccess( results ) {
	return {
		type: ANALYZE_DATA_SUCCESS,
		payload: results,
	};
}


/**
 * An action that orchestrates data analysis.
 *
 * @param {*} worker An instance of the analysis webworker.
 * @param {*} paper The Paper used by the analysis.
 *
 * @returns {Function} A function that orchestrates data analysis.
 */
export function analyzeData( worker, paper ) {
	return async dispatch => {
		// Let store know we are starting analysis
		dispatch( analysisRequest() );

		// Start analysis in worker
		try {
			const request = worker.analyze( paper );
			const results = await request;
			dispatch( analysisSuccess( results ) );
		} catch ( error ) {
			console.error( "An error occurred in the data analysis.", error );
		}
	};
}

