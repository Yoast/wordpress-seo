/**
 * The schema validation results.
 *
 * @param {object} state The current state.
 *
 * @returns {object} The schema blocks validation results.
 */
export function getSchemaBlocksValidationResults( state ) {
	return state.schemaBlocks.validations;
}
