import { maxBy } from "lodash";
import { BlockInstance } from "@wordpress/blocks";
import { attributeExists, attributeNotEmpty } from ".";
import { BlockValidationResult, BlockPresence, BlockValidation } from "../../core/validation";
import { BlockInstruction } from "../../core/blocks";
import { getPresence } from "./getPresence";

/**
 * Checks if the instruction block is valid.
 *
 * @param blockInstance The attributes from the block.
 * @param thisObj The this context.
 *
 * @returns The validation result.
 */
function defaultValidate( blockInstance: BlockInstance, thisObj: BlockInstruction ): BlockValidationResult {
	const issues: BlockValidationResult[] = [];

	let presence = BlockPresence.Unknown;
	if ( thisObj.options ) {
		presence = getPresence( thisObj.options );
		const attributeValid = attributeExists( blockInstance, thisObj.options.name as string ) &&
                            attributeNotEmpty( blockInstance, thisObj.options.name as string );
		if ( ! attributeValid ) {
			issues.push( BlockValidationResult.MissingAttribute( blockInstance, thisObj.constructor.name, presence ) );
		}
	}

	// Core blocks have their own validation
	if ( blockInstance.name.startsWith( "core/" ) && ! blockInstance.isValid ) {
		issues.push( new BlockValidationResult( blockInstance.clientId, thisObj.constructor.name, BlockValidation.Invalid, presence ) );
	}

	// No issues found? That means the block is valid.
	if ( issues.length < 1 ) {
		return BlockValidationResult.Valid( blockInstance, thisObj.constructor.name, presence );
	}

	// Make sure to report the worst case scenario as the final validation result.
	const worstCase: BlockValidationResult = maxBy( issues, issue => issue.result );

	const validation = new BlockValidationResult( blockInstance.clientId, thisObj.constructor.name, worstCase.result, worstCase.blockPresence );
	validation.issues = issues;

	return validation;
}

export { defaultValidate };
