import { SchemaBlocksState, SchemaBlocksDefaultState } from "../SchemaBlocksState";
import { BlockValidationResult } from "../../../core/validation";
import { recursivelyFind } from "../../validators/recursivelyFind";
import logger from "../../logger";

export type ClientIdValidation = Record<string, BlockValidationResult>;

/**
 * The schema validation results.
 *
 * @param {object} state The current state.
 *
 * @returns The schema blocks validation results.
 */
export function getSchemaBlocksValidationResults( state: SchemaBlocksState ): ClientIdValidation {
	return state.validations || SchemaBlocksDefaultState.validations;
}

/**
 * Recursively traverses a BlockValidationResult's issues to finds the validation results for a specific clientId.
 *
 * @param state The entire Schema Blocks state.
 * @param clientId The clientId of the block you want validation results for.
 *
 * @returns The BlockValidationResult matching the clientId or null if none were found.
 */
export function getValidationResultForClientId( state: SchemaBlocksState, clientId: string ): BlockValidationResult {
	const stored = getSchemaBlocksValidationResults( state );
	logger.debug( "stored validations:", stored );
	const validationResults = Object.values( stored );

	return recursivelyFind( validationResults, ( result ) => result.clientId === clientId );
}

/**
 * Finds all validation results that match the names of given blocks.
 *
 * @param state      The entire Schema Blocks state.
 * @param blockNames The set of blocknames you're looking for.
 *
 * @returns The validation results for the list of given blocks.
 */
export function getValidationsForBlockNames( state: SchemaBlocksState, blockNames?: string[] ): BlockValidationResult[] {
	const validations = getSchemaBlocksValidationResults( state );
	return Object.values( validations ).filter( validation => blockNames.includes( validation.name ) );
}

/**
 * Returns a list of required blocks.
 *
 * @returns The list of required blocks.
 */
export function getRequiredBlockNames(): string[] {
	return [
		"yoast/job-description",
		"yoast/job-location",
	];
}

/**
 * Returns a list of recommended blocks.
 *
 * @returns The list of recommended blocks.
 */
export function getRecommendedBlockNames(): string[] {
	return [
		"yoast/job-closing-date",
		"yoast/job-employment-type",
		"yoast/job-salary",
		"yoast/job-requirements",
		"yoast/job-benefits",
		"yoast/job-apply-button",
	];
}

/**
 * Returns a list of all required and recommended blocks.
 *
 * @returns The list of required and recommended blocks.
 */
export function getBlockNames(): string[] {
	return [ ...getRecommendedBlockNames(), ... getRequiredBlockNames() ];
}

