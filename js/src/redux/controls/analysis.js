import { Paper } from "yoastseo";
import handleWorkerError from "../../analysis/handleWorkerError";

/**
 * Runs the analysis.
 *
 * @param {Object} data The data to analyze.
 * @param {AnalysisWorkerWrapper} worker The analysis worker.
 *
 * @returns {Object} The analysis results or the error that occurred.
 */
export function RUN_ANALYSIS( { data, worker } ) {
	const { text, ...paperAttributes } = data;
	const paper = new Paper( text, paperAttributes );

	try {
		return worker.analyze( paper );
	} catch ( error ) {
		handleWorkerError();
		return error;
	}
}
