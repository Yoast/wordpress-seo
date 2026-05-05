import { mapValues } from "lodash";

/**
 * Normalizes an error payload to the structured shape expected by `ContentPlannerError`.
 * Handles plain `Error` instances, raw strings, and partial error objects by filling in defaults.
 *
 * @param {*} payload The raw error payload from the fetch generator.
 * @returns {{ errorCode: number, errorIdentifier: string, errorMessage: string, missingLicenses: string[] }} The structured error.
 */
export const normalizeError = ( payload ) => {
	const defaultError = {
		errorCode: 502,
		errorIdentifier: "",
		errorMessage: "",
		missingLicenses: [],
	};

	// Bad gateway error will not have a payload, so we set a default error.
	// Normalize errorMessage to also accept the plain Error `message` property.
	const source = { ...( payload || {} ), errorMessage: payload?.errorMessage || payload?.message };

	return mapValues( defaultError, ( defaultVal, key ) => source[ key ] || defaultVal );
};
