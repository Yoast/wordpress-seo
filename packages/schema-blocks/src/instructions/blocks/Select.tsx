import BlockInstruction from "../../core/blocks/BlockInstruction";
import { RenderEditProps, RenderSaveProps } from "../../core/blocks/BlockDefinition";
import BlockLeaf from "../../core/blocks/BlockLeaf";
import { createElement, ReactElement } from "@wordpress/element";
import { BlockConfiguration, BlockInstance } from "@wordpress/blocks";
import attributeExists from "../../functions/validators/attributeExists";
import attributeNotEmpty from "../../functions/validators/attributeNotEmpty";
import { arrayOrObjectToOptions } from "../../functions/select";
import { SelectControl } from "@wordpress/components";

/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Select (a drop-down box) instruction.
 */
class Select extends BlockInstruction {
	public options: {
		/**
		 * The attribute name the value selected in the select control should be saved as.
		 */
		name: string;
		/**
		 * The available options within the select control.
		 */
		options: string[] | Record<string, string>;
		/**
		 * The label that should be shown before this select control.
		 */
		label: string;
		/**
		 * If it is required that a value is selected.
		 */
		required?: boolean;
		/**
		 * If multiple values may be selected.
		 */
		multiple?: boolean;
	};

	/**
	 * Renders saving the element.
	 *
	 * @param props The props.
	 * @param leaf  The leaf being rendered.
	 * @param i     The number the rendered element is of it's parent.
	 *
	 * @returns {JSX.Element} The element to render.
	 */
	save( props: RenderSaveProps, leaf: BlockLeaf, i: number ): ReactElement | string {
		return <p data-id={ this.options.name } data-value={ this.value( props ) }>
			<b>{ this.options.label }</b>
			<span>{ this.value( props ) }</span>
		</p>;
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
	 * Renders editing the element.
	 *
	 * @param props The props.
	 * @param leaf  The leaf being rendered.
	 * @param i     The number the rendered element is of it's parent.
	 *
	 * @returns {JSX.Element} The element to render.
	 */
	edit( props: RenderEditProps, leaf: BlockLeaf, i: number ): ReactElement | string {
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

		return <SelectControl { ...attributes } />;
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
	 * Checks if the instruction block is valid.
	 *
	 * @param blockInstance The attributes from the block.
	 *
	 * @returns `true` if the instruction block is valid, `false` if the block contains errors.
	 */
	valid( blockInstance: BlockInstance ): boolean {
		if ( this.options.required === true ) {
			return attributeExists( blockInstance, this.options.name as string ) &&
				attributeNotEmpty( blockInstance, this.options.name as string );
		}

		return true;
	}
}

BlockInstruction.register( "select", Select );
/* eslint-enable @typescript-eslint/no-unused-vars */
