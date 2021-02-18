import BlockInstruction from "../../core/blocks/BlockInstruction";
import { RenderSaveProps, RenderEditProps } from "../../core/blocks/BlockDefinition";
import RichTextBase, { RichTextEditProps, RichTextSaveProps } from "./abstract/RichTextBase";
import { BlockConfiguration, BlockEditProps } from "@wordpress/blocks";
import { createElement } from "@wordpress/element";
import { SelectControl } from "@wordpress/components";
import { arrayOrObjectToOptions } from "../../functions/select";

/**
 * VariableTagRichText instruction.
 */
class VariableTagRichText extends RichTextBase {
	public options: {
		tags: ( keyof HTMLElementTagNameMap )[] | Record<string, keyof HTMLElementTagNameMap>;
		name: string;
		class: string;
		default: string;
		placeholder: string;
		multiline: boolean;
		label: string;
		value: string;
	};

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
					"default": this.options.default,
					selector: `[data-id=${this.options.name}]`,
				},
				[ this.options.name + "_tag" ]: {
					type: "string",
				},
			},
		};
	}

	/**
	 * Renders the sidebar.
	 *
	 * @param props The render props.
	 * @param i     The number sidebar element this is.
	 *
	 * @returns The sidebar element.
	 */
	sidebar( props: BlockEditProps<Record<string, unknown>>, i: number ): JSX.Element {
		return createElement( SelectControl, {
			label: this.options.label,
			value: props.attributes[ this.options.name + "_tag" ] as string,
			options: arrayOrObjectToOptions( this.options.tags ),
			onChange: value => props.setAttributes( { [ this.options.name + "_tag" ]: value } ),
			key: i,
		} );
	}

	/**
	 * Gets the base attributes of the rich text.
	 *
	 * @param props The props.
	 * @param i     The number child this is.
	 *
	 * @returns The base attributes.
	 */
	protected getBaseAttributes( props: RenderSaveProps | RenderEditProps, i: number ): RichTextSaveProps | RichTextEditProps {
		const attributes: RichTextSaveProps | RichTextEditProps = {
			tagName:
				props.attributes[ this.options.name + "_tag" ] as keyof HTMLElementTagNameMap ||
				arrayOrObjectToOptions( this.options.tags )[ 0 ].value,
			value: props.attributes[ this.options.name ] as string || this.options.value,
			className: this.options.class,
			placeholder: this.options.placeholder,
			"data-id": this.options.name,
			key: i,
		};

		if ( this.options.multiline ) {
			attributes.multiline = this.options.multiline;
		}

		return attributes;
	}
}

BlockInstruction.register( "variable-tag-rich-text", VariableTagRichText );
