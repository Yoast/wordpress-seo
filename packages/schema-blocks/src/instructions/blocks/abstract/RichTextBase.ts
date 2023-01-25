import { BlockConfiguration, BlockInstance } from "@wordpress/blocks";
import { RichText as WordPressRichText } from "@wordpress/block-editor";
import { createElement } from "@wordpress/element";
import { BlockLeaf, BlockInstruction } from "../../../core/blocks";
import { RenderSaveProps, RenderEditProps } from "../../../core/blocks/BlockDefinition";
import { BlockPresence, BlockValidation, BlockValidationResult } from "../../../core/validation";
import { getPresence } from "../../../functions/validators/getPresence";

export interface RichTextSaveProps extends WordPressRichText.ContentProps<keyof HTMLElementTagNameMap> {
	"data-id": string;
}

export interface RichTextEditProps extends WordPressRichText.Props<keyof HTMLElementTagNameMap> {
	"data-id": string;
}

/**
 * RichTextBase instruction.
 */
export default abstract class RichTextBase extends BlockInstruction {
	public options: {
		name: string;
		default: string;
		placeholder: string;
		keepPlaceholderOnFocus?: boolean;
		required?: boolean;
	};

	/**
	 * Renders saving the rich text.
	 *
	 * @param props The render props.
	 * @param leaf  The leaf being rendered.
	 * @param i     The number child this is.
	 *
	 * @returns The RichText element.
	 */
	save( props: RenderSaveProps, leaf: BlockLeaf, i: number ): JSX.Element {
		return createElement( WordPressRichText.Content, this.getBaseAttributes( props, i ) as RichTextSaveProps );
	}

	/**
	 * Renders editing the rich text.
	 *
	 * @param props The render props.
	 * @param leaf  The leaf being rendered.
	 * @param i     The number child this is.
	 *
	 * @returns The RichText element.
	 */
	edit( props: RenderEditProps, leaf: BlockLeaf, i: number ): JSX.Element {
		const attributes = this.getBaseAttributes( props, i ) as RichTextEditProps;
		attributes.onChange = ( value ) => props.setAttributes( { [ this.options.name ]: value } );
		if ( this.options.placeholder ) {
			attributes.placeholder = this.options.placeholder;
			attributes.keepPlaceholderOnFocus = this.options.keepPlaceholderOnFocus;
		}

		return createElement( WordPressRichText, attributes );
	}

	/**
	 * Adds the RichText attributes to the block configuration.
	 *
	 * @returns The block configuration.
	 */
	configuration(): Partial<BlockConfiguration> {
		return {
			attributes: {
				[ this.options.name ]: {
					type: "string",
					source: "html",
					selector: `[data-id=${this.options.name}]`,
					"default": this.options.default,
					required: this.options.required === true,
				},
			},
		};
	}

	/**
	 * Checks if the instruction block is valid.
	 *
	 * @param blockInstance The attributes from the block.
	 *
	 * @returns {BlockValidationResult} The validation result.
	 */
	validate( blockInstance: BlockInstance ): BlockValidationResult {
		const presence = getPresence( this.options );
		// Get the current editor content of this block from the store.
		const content: string = blockInstance.attributes[ this.options.name ];
		if ( content && content.trim().length > 0 ) {
			return BlockValidationResult.Valid( blockInstance, this.options.name, presence );
		}

		const validation = ( presence === BlockPresence.Required )
			? BlockValidation.MissingRequiredAttribute
			: BlockValidation.MissingRecommendedAttribute;

		return new BlockValidationResult( blockInstance.clientId, this.options.name, validation, presence );
	}

	/**
	 * Gets the base attributes of the rich text.
	 *
	 * @param props The props.
	 * @param i     The number child this is.
	 *
	 * @returns The base attributes.
	 */
	protected abstract getBaseAttributes( props: RenderSaveProps | RenderEditProps, i: number ): RichTextSaveProps | RichTextEditProps
}
