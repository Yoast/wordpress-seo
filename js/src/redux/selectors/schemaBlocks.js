import { get } from "lodash";

/**
 * Gets the validation results for a blockinstance with a given clientId from the store.
 *
 * @param {Object} state    The state.
 * @param {string} clientId The clientId to read validation results for.
 *
 * @returns {BlockValidationResult} The validation results for the blockinstance with clientId, if any.
 */
export function getValidationResult( state, clientId ) {
	const result = get( state, "schemaBlocks[" + clientId + "]", null );
	console.log("getValidationResult:", result);
	return result;
}
