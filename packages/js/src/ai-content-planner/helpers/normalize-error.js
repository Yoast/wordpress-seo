/**
 * Normalizes an error payload to the structured shape expected by `ContentPlannerError`.
 * Handles plain `Error` instances, raw strings, and partial error objects by filling in defaults.
 *
 * @param {*} payload The raw error payload from the fetch generator.
 * @returns {{ errorCode: number, errorIdentifier: string, errorMessage: string }} The structured error.
 */
export const normalizeError = ( payload ) => {
	const source = payload || {};
	// Bad gateway error will not have a payload, so we set a default error.
	return {
		errorCode: source.errorCode || 502,
		errorIdentifier: source.errorIdentifier || "",
		errorMessage: source.errorMessage || source.message || "",
	};
};
