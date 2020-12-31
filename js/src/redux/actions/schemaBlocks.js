const PREFIX = "WPSEO_";

export const SET_BLOCK_VALID = `${ PREFIX }SET_BLOCK_VALIDATION`;

export class SetBlockValidation {
	/**
	 * The type of action, always set to SET_BLOCK_VALIDATION.
	 * @type {string}
	 */
	type;
	/**
	 * The clientId of the validated BlockInstance.
	 * @type {string}
	 */
	clientId;

	/**
	 * The validation results.
	 * @type {BlockValidation[]}
	 */
	validation;

	/**
	 * Creates a new SetBlockValidation action.
	 * @param {string} clientId              The clientId of the validated BlockInstance.
	 * @param {BlockValidation[]} validation The validation results.
	 */
	constructor( clientId, validation ) {
		this.type = SET_BLOCK_VALID;
		this.clientId = clientId;
		this.validation = validation;
	}
}

/**
 * Updates whether a block is valid.
 *
 * @param {string} clientID   The client ID of the block.
 * @param {BlockValidation[]} validation The validation result for the block.
 *
 * @returns {SetBlockValidation} An action for redux.
 */
export function setBlockValidation( clientID, validation ) {
	return new SetBlockValidation( clientID, validation );
}
