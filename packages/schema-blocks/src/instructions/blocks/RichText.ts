import BlockInstruction from "../../core/blocks/BlockInstruction";
import { RenderSaveProps, RenderEditProps } from "../../core/blocks/BlockDefinition";
import RichTextBase, { RichTextSaveProps, RichTextEditProps } from "./abstract/RichTextBase";

/**
 * RichText instruction
 */
class RichText extends RichTextBase {
	public options: {
		tag: keyof HTMLElementTagNameMap;
		name: string;
		class: string;
		default: string;
		placeholder: string;
		multiline: boolean | "li" | "p";
	};

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
			tagName: this.options.tag,
			value: props.attributes[ this.options.name ] as string,
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

BlockInstruction.register( "rich-text", RichText );
