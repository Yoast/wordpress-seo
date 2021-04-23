import { createElement } from "@wordpress/element";
import { TextControl } from "@wordpress/components";

import BlockInstruction from "../../core/blocks/BlockInstruction";
import { RenderSaveProps, RenderEditProps } from "../../core/blocks/BlockDefinition";
import { BlockEditProps, BlockConfiguration } from "@wordpress/blocks";
import SidebarBase, { SidebarBaseOptions } from "./abstract/SidebarBase";
import StringWithClickableQuestionMark from "../../functions/presenters/StringWithClickableQuestionMarkPresenter";

/**
 * SidebarInput instruction.
 */
class SidebarInput extends SidebarBase {
	public options: SidebarBaseOptions;

	/**
	 * Renders the sidebar.
	 *
	 * @param props The render props.
	 * @param i     The number sidebar element this is.
	 *
	 * @returns The sidebar element.
	 */
	sidebar( props: BlockEditProps<Record<string, unknown>>, i: number ): JSX.Element {
		const attributes: TextControl.Props = {
			label: this.options.label,
			value: props.attributes[ this.options.name ] as string,
			className: this.options.className,
			onChange: value => props.setAttributes( { [ this.options.name ]: this.options.type === "number" ? parseInt( value, 10 ) : value } ),
			key: i,
		};

		if ( this.options.help ) {
			attributes.help = this.options.help;
		}
		if ( this.options.type ) {
			attributes.type = this.options.type;
		}

		// If a help link was passed in the template, add the question mark icon with the link to the label.
		if ( this.options.helpLink ) {
			attributes.label = StringWithClickableQuestionMark( { text: attributes.label as string, URL: this.options.helpLink } );
		}

		return createElement( TextControl, attributes );
	}

	/**
	 * Adds the sidebar input to the block configuration.
	 *
	 * @returns The block configuration.
	 */
	configuration(): Partial<BlockConfiguration> {
		return {
			attributes: {
				[ this.options.name ]: {
					type: this.options.type === "number" ? "number" : "string",
					required: this.options.required === true,
				},
			},
		};
	}

	/**
	 * Renders the value of a sidebar input.
	 *
	 * @param props The render props.
	 *
	 * @returns The value of the sidebar input.
	 */
	protected value( props: RenderSaveProps | RenderEditProps ): string {
		return props.attributes[ this.options.name ] as string || this.options.default || "";
	}
}

BlockInstruction.register( "sidebar-input", SidebarInput );
