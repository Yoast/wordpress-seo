import { BlockInstance } from "@wordpress/blocks";
import { __, sprintf } from "@wordpress/i18n";

import { Heading } from "./Heading";
import { BlockValidation, BlockValidationResult } from "../../core/validation";
import BlockInstruction from "../../core/blocks/BlockInstruction";
import { BlockPresence } from "../../core/validation";
import { attributeExists, attributeNotEmpty } from "../../functions/validators";

/**
 * Title instruction. Is invalid when its content is empty.
 */
class Title extends Heading {
	public options: {
		tags: ( keyof HTMLElementTagNameMap )[] | Record<string, keyof HTMLElementTagNameMap>;
		defaultHeadingLevel: number;
		name: string;
		fieldName: string;
		class: string;
		default: string;
		placeholder: string;
		keepPlaceholderOnFocus?: boolean;
		multiline: boolean;
		label: string;
		value: string;
		required?: boolean;
	};

	/**
	 * Checks whether the title has been completed,
	 * e.g. whether it is not empty.
	 *
	 * @param blockInstance The block instance to check.
	 *
	 * @returns Whether the title is complete for the given block instance.
	 */
	private isCompleted( blockInstance: BlockInstance ) {
		return attributeExists( blockInstance, this.options.name ) && attributeNotEmpty( blockInstance, this.options.name );
	}

	/**
	 * Checks if the instruction is valid.
	 *
	 * @param blockInstance The attributes from the block.
	 *
	 * @returns The validation result.
	 */
	validate( blockInstance: BlockInstance ): BlockValidationResult {
		if ( this.isCompleted( blockInstance ) ) {
			return BlockValidationResult.Valid( blockInstance );
		}

		return new BlockValidationResult(
			blockInstance.clientId,
			blockInstance.name,
			BlockValidation.MissingRequiredAttribute,
			BlockPresence.Required,
			sprintf(
				/* Translators: %s expands to the label of the title field in the block sidebar. */
				__( "%s has been left empty.", "wordpress-seo" ),
				this.options.fieldName,
			),
		);
	}

	/**
	 * Returns whether or not this instruction should be included in the tree.
	 *
	 * @returns Whether or not to render this instruction.
	 */
	renderable(): boolean {
		return false;
	}
}

BlockInstruction.register( "title", Title );
