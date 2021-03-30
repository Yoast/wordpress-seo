import { BlockInstance } from "@wordpress/blocks";
import { select } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";

import { VariableTagRichText } from "./VariableTagRichText";
import { BlockValidation, BlockValidationResult } from "../../core/validation";
import BlockInstruction from "../../core/blocks/BlockInstruction";
import { BlockPresence } from "../../core/validation/BlockValidationResult";

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
class Title extends VariableTagRichText {
	public options: {
		tags: ( keyof HTMLElementTagNameMap )[] | Record<string, keyof HTMLElementTagNameMap>;
		name: string;
		blockName: string;
		class: string;
		default: string;
		placeholder: string;
		keepPlaceholderOnFocus?: boolean;
		multiline: boolean;
		label: string;
		value: string;
	};

	/**
	 * Checks if the instruction block is valid.
	 *
	 * @param blockInstance The attributes from the block.
	 *
	 * @returns {BlockValidationResult} The validation result.
	 */
	validate( blockInstance: BlockInstance ): BlockValidationResult {
		const post: Post = select( "core/editor" ).getCurrentPost();

		const hasSameTitle = blockInstance.attributes[ this.options.name ] === post.title;

		if ( hasSameTitle ) {
			return new BlockValidationResult(
				blockInstance.clientId,
				blockInstance.name,
				BlockValidation.Invalid,
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
