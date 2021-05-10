import { BlockInstance } from "@wordpress/blocks";
import { select } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";

import { Heading } from "./Heading";
import { BlockValidation, BlockValidationResult } from "../../core/validation";
import BlockInstruction from "../../core/blocks/BlockInstruction";
import { BlockPresence } from "../../core/validation/BlockValidationResult";
import { attributeExists, attributeNotEmpty } from "../../functions/validators";
import { getPresence } from "../../functions/validators/getPresence";

/**
 * Interface for a WordPress post object.
 */
interface Post {
	title: string;
}

/**
 * Job title instruction.
 * Is invalid when its contents is the same as the post title.
 */
class Title extends Heading {
	public options: {
		tags: ( keyof HTMLElementTagNameMap )[] | Record<string, keyof HTMLElementTagNameMap>;
		defaultHeadingLevel: number;
		name: string;
		blockName: string;
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
	 * Whether the block is completed.
	 *
	 * E.g. whether the block's attribute in which the schema value is stored is filled in.
	 *
	 * @param blockInstance The block instance to check.
	 *
	 * @returns Whether the block is completed.
	 */
	private isCompleted( blockInstance: BlockInstance ): boolean {
		return attributeExists( blockInstance, this.options.name ) && attributeNotEmpty( blockInstance, this.options.name );
	}

	/**
	 * Checks if the instruction block is valid.
	 *
	 * @param blockInstance The attributes from the block.
	 *
	 * @returns The validation result.
	 */
	validate( blockInstance: BlockInstance ): BlockValidationResult {
		const blockTitle: string = blockInstance.attributes[ this.options.name ];
		const postTitle: string = select( "core/editor" ).getEditedPostAttribute( "title" );

		if ( ! this.isCompleted( blockInstance ) ) {
			const presence = getPresence( this.options );
			return BlockValidationResult.MissingAttribute( blockInstance, this.constructor.name, presence );
		}

		if ( blockTitle.toLocaleLowerCase() === postTitle.toLocaleLowerCase() ) {
			return new BlockValidationResult(
				blockInstance.clientId,
				blockInstance.name,
				BlockValidation.OK,
				BlockPresence.Recommended,
				sprintf(
					/* Translators: %s expands to the block's name. */
					__( "Post title and %s are the same.", "yoast-schema-blocks" ),
					this.options.blockName,
				),
			);
		}

		return BlockValidationResult.Valid( blockInstance );
	}
}

BlockInstruction.register( "title", Title );
