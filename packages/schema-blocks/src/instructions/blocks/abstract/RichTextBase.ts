import { createElement } from "@wordpress/element";
import { RichText as WordPressRichText } from "@wordpress/block-editor";

import BlockInstruction from "../../../core/blocks/BlockInstruction";
import { RenderSaveProps, RenderEditProps } from "../../../core/blocks/BlockDefinition";
import BlockLeaf from "../../../core/blocks/BlockLeaf";
import { BlockConfiguration } from "@wordpress/blocks";

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
	 * Gets the base attributes of the rich text.
	 *
	 * @param props The props.
	 * @param i     The number child this is.
	 *
	 * @returns The base attributes.
	 */
	protected abstract getBaseAttributes( props: RenderSaveProps | RenderEditProps, i: number ): RichTextSaveProps | RichTextEditProps
}
