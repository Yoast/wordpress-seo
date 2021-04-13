import { BlockValidation } from ".";
import { BlockInstance } from "@wordpress/blocks";
import { __, sprintf } from "@wordpress/i18n";

export enum BlockPresence {
	Required = "required",
	Recommended = "recommended",
	Optional = "optional",
	Unknown = "unknown"
}

/**
 * Contains the result of a block validation.
 */
export class BlockValidationResult {
	/**
	 * The name of the validated block.
	 */
	public name: string;

	/**
	 * The clientId of the validated block.
	 */
	public clientId: string;

	/**
	 * The validation result.
	 */
	public result: BlockValidation;

	/**
	 * The block presence.
	 */
	public blockPresence: BlockPresence;

	/**
	 * The validation issues for this block's innerblocks or attributes, if any.
	 */
	public issues: BlockValidationResult[];

	/**
	 * An optional message describing the result.
	 */
	public message: string;

	/**
	 * @param clientId      The clientId of the validated block.
	 * @param name          The name of the validated block.
	 * @param result        The validation result.
	 * @param blockPresence The block type.
	 * @param message       An optional message describing the result.
	 */
	constructor( clientId: string, name: string, result: BlockValidation, blockPresence: BlockPresence, message?: string ) {
		this.name = name;
		this.clientId = clientId;
		this.name = name;
		this.result = result;
		this.blockPresence = blockPresence;
		this.issues = [];
		this.message = message;
	}

	/**
	 * Named constructor for a 'missing attribute' validation result.
	 *
	 * @param blockInstance The block instance.
	 * @param [name] Optional name.
	 *
	 * @constructor
	 */
	static MissingAttribute( blockInstance: BlockInstance, name?: string ) {
		return new BlockValidationResult(
			blockInstance.clientId,
			name || blockInstance.name,
			BlockValidation.MissingAttribute,
			BlockPresence.Unknown,
		);
	}

	/**
	 * Named constructor for a 'missing required block' validation result.
	 *
	 * @param name The name of the missing block.
	 *
	 * @constructor
	 */
	static MissingRequiredBlock( name: string ) {
		return new BlockValidationResult(
			null,
			name,
			BlockValidation.MissingRequiredBlock,
			BlockPresence.Required,
			sprintf(
				/* Translators: %1$s expands to the block name. */
				__( "The `%1$s` block is required but missing.", "yoast-schema-blocks" ),
				name,
			),
		);
	}

	/**
	 * Named constructor for a 'missing recommended block' validation result.
	 *
	 * @param name The name of the missing block.
	 *
	 * @constructor
	 */
	static MissingRecommendedBlock( name: string ) {
		return new BlockValidationResult(
			null,
			name,
			BlockValidation.MissingRecommendedBlock,
			BlockPresence.Recommended,
			sprintf(
				/* Translators: %1$s expands to the block name. */
				__( "The `%1$s` block is recommended but missing.", "yoast-schema-blocks" ),
				name,
			),
		);
	}

	/**
	 * Named constructor for a 'valid' validation result.
	 *
	 * @param blockInstance The block instance.
	 * @param [name] Optional name.
	 *
	 * @constructor
	 */
	static Valid( blockInstance: BlockInstance, name?: string ) {
		return new BlockValidationResult(
			blockInstance.clientId,
			name || blockInstance.name,
			BlockValidation.Valid,
			BlockPresence.Unknown,
		);
	}
}
