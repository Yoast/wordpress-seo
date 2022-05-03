import { BlockValidation } from ".";
import { BlockInstance } from "@wordpress/blocks";
import { __, sprintf } from "@wordpress/i18n";
import { getHumanReadableBlockName } from "../../functions/BlockHelper";

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
	 * @param [blockPresence] The block type.
	 *
	 * @constructor
	 */
	static MissingAttribute( blockInstance: BlockInstance, name?: string, blockPresence?: BlockPresence ): BlockValidationResult {
		let blockValidation: BlockValidation = BlockValidation.Unknown;
		let message = "";

		switch ( blockPresence ) {
			case BlockPresence.Required :
				blockValidation = BlockValidation.MissingRequiredAttribute;
				message = sprintf(
					/* Translators: %1$s expands to the block name. */
					__( "The `%1$s` attribute is required but missing.", "wordpress-seo" ),
					getHumanReadableBlockName( name ),
				);
				break;

			case BlockPresence.Recommended :
				blockValidation = BlockValidation.MissingRecommendedAttribute;
				message = sprintf(
					/* Translators: %1$s expands to the block name. */
					__( "The `%1$s` attribute is recommended but missing.", "wordpress-seo" ),
					getHumanReadableBlockName( name ),
				);
				break;
		}

		return new BlockValidationResult(
			blockInstance.clientId,
			name || blockInstance.name,
			blockValidation,
			blockPresence || BlockPresence.Unknown,
			message,
		);
	}

	/**
	 * Named constructor for a 'missing recommended / required block' validation result.
	 *
	 * @param name The name of the missing block.
	 * @param blockPresence The block presence.
	 *
	 * @constructor
	 */
	static MissingBlock( name: string, blockPresence?: BlockPresence ): BlockValidationResult {
		if ( blockPresence === BlockPresence.Recommended ) {
			return BlockValidationResult.MissingRecommendedBlock( name, blockPresence === BlockPresence.Recommended );
		}

		return new BlockValidationResult(
			null,
			name,
			BlockValidation.MissingRequiredBlock,
			blockPresence || BlockPresence.Unknown,
			sprintf(
				/* Translators: %1$s expands to the block name. */
				__( "The `%1$s` block is required but missing.", "wordpress-seo" ),
				getHumanReadableBlockName( name ),
			),
		);
	}

	/**
	 * Named constructor for a 'missing recommended block' validation result.
	 *
	 * @param name The name of the missing block.
	 * @param recommended Wether the block is recommended or optional.
	 *
	 * @constructor
	 */
	private static MissingRecommendedBlock( name: string, recommended: boolean ) {
		return new BlockValidationResult(
			null,
			name,
			BlockValidation.MissingRecommendedBlock,
			recommended ? BlockPresence.Recommended : BlockPresence.Unknown,
			sprintf(
				/* Translators: %1$s expands to the block name. */
				__( "The `%1$s` block is recommended but missing.", "wordpress-seo" ),
				getHumanReadableBlockName( name ),
			),
		);
	}

	/**
	 * Named constructor for a 'valid' validation result.
	 *
	 * @param blockInstance The block instance.
	 * @param [name] Optional name.
	 * @param [blockPresence] Optional BlockPresence.
	 *
	 * @constructor
	 */
	static Valid( blockInstance: BlockInstance, name?: string, blockPresence? : BlockPresence ): BlockValidationResult {
		return new BlockValidationResult(
			blockInstance.clientId,
			name || blockInstance.name,
			BlockValidation.Valid,
			blockPresence || BlockPresence.Unknown,
		);
	}
}
