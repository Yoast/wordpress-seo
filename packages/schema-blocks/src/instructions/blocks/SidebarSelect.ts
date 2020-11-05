import { BlockEditProps, BlockConfiguration } from "@wordpress/blocks";
import { createElement } from "@wordpress/element";
import { SelectControl } from "@wordpress/components";

import BlockInstruction from "../../core/blocks/BlockInstruction";
import { RenderEditProps, RenderSaveProps } from "../../core/blocks/BlockDefinition";
import { arrayOrObjectToOptions } from "../../functions/select";
import SidebarBase from "./abstract/SidebarBase";
import attributeNotEmpty from "../../functions/validators/attributeNotEmpty";
import attributeExists from "../../functions/validators/attributeExists";

/**
 * SidebarSelect class
 */
class SidebarSelect extends SidebarBase {
	public options: {
		name: string;
		options: string[] | Record<string, string>;
		label?: string;
		help?: string;
		output?: boolean;
		multiple?: boolean;
		required?: boolean;
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
		const attributes: SelectControl.Props<string | string[]> = {
			label: this.options.label,
			value: props.attributes[ this.options.name ] as string | string[],
			options: arrayOrObjectToOptions( this.options.options ),
			onChange: value => props.setAttributes( { [ this.options.name ]: value } ),
			key: i,
		};

		if ( this.options.multiple === true ) {
			( attributes as SelectControl.Props<string[]> ).multiple = true;
		}

		return createElement( SelectControl, attributes );
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
					type: this.options.multiple === true ? "array" : "string",
					required: this.options.required === true,
				},
			},
		};
	}

	/**
	 * Renders the value of a sidebar select.
	 *
	 * @param props The render props.
	 *
	 * @returns The value of the sidebar select.
	 */
	protected value( props: RenderSaveProps | RenderEditProps ): string {
		return props.attributes[ this.options.name ] as string || arrayOrObjectToOptions( this.options.options )[ 0 ].value;
	}

	/**
	 * Checks if the instruction block is valid.
	 *
	 * @param props de attributes uit RenderSaveProps of RenderEditProps.
	 *
	 * @returns `true` if the instruction block is valid, `false` if the block contains errors.
	 */
	valid( props: RenderSaveProps | RenderEditProps ): boolean {
		if ( this.options.required === true ) {
			return attributeExists( props.attributes, this.options.name ) && attributeNotEmpty( props.attributes, this.options.name );
		}

		return true;
	}
}

BlockInstruction.register( "sidebar-select", SidebarSelect );
