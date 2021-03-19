import { BlockValidation } from ".";
import { BlockInstance } from "@wordpress/blocks";

export enum BlockType {
	Required,
	Recommended,
	Optional,
	Unknown
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
	 * The block type.
	 */
	public blockType: BlockType;

	/**
	 * The validation issues for this block's innerblocks or attributes, if any.
	 */
	public issues: BlockValidationResult[]

	/**
	 * @param clientId The clientId of the validated block.
	 * @param name     The name of the validated block.
	 * @param result   The validation result.
	 * @param blockType
	 */
	constructor( clientId: string, name: string, result: BlockValidation, blockType: BlockType ) {
		this.clientId = clientId;
		this.name = name;
		this.result = result;
		this.blockType = blockType;
		this.issues = [];
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
			BlockType.Unknown,
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
			BlockType.Unknown,
		);
	}
}
