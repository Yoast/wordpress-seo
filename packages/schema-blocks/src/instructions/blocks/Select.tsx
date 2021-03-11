import { ReactElement } from "react";
import { createElement, useCallback } from "@wordpress/element";
import { BlockConfiguration, BlockInstance } from "@wordpress/blocks";
import { SelectControl } from "@wordpress/components";

import BlockInstruction from "../../core/blocks/BlockInstruction";
import { RenderEditProps, RenderSaveProps } from "../../core/blocks/BlockDefinition";
import { attributeExists, attributeNotEmpty } from "../../functions/validators";

/**
 * Select (a drop-down box) instruction.
 */
export default class Select extends BlockInstruction {
	public options: {
		/**
		 * The attribute name the value selected in the select control should be saved as.
		 */
		name: string;
		/**
		 * The available options within the select control.
		 */
		options: { label: string; value: string }[];
		/**
		 * The label that should be shown before this select control.
		 */
		label: string;
		/**
		 * If it is required that a value is selected.
		 */
		required?: boolean;
		/**
		 * Whether to visually hide the label.
		 */
		hideLabelFromVision: boolean;
		/**
		 * An optional extra class name or class names.
		 */
		className?: string;
		/**
		 * The default selected value.
		 */
		defaultValue?: string;
	};

	/**
	 * Renders saving the element.
	 *
	 * @param props The props.
	 *
	 * @returns {JSX.Element} The element to render.
	 */
	save( props: RenderSaveProps ): ReactElement | string {
		const { label, name, hideLabelFromVision } = this.options;

		const value = props.attributes[ name ] as string;

		return <span data-id={ name } data-value={ value }>
			{ ! hideLabelFromVision && <strong>{ label }:</strong> }
			{ this.label( value ) + " " }
		</span>;
	}

	/**
	 * Returns the label of the selected option.
	 *
	 * @param value The render props.
	 *
	 * @returns The label of the selected option.
	 */
	protected label( value: string ): string {
		const foundOption = this.options.options.find( option => option.value === value );
		if ( foundOption ) {
			return foundOption.label;
		}
		return null;
	}

	/**
	 * Renders editing the element.
	 *
	 * @param props The props.
	 *
	 * @returns {JSX.Element} The element to render.
	 */
	edit( props: RenderEditProps ): ReactElement | string {
		const { label, options, hideLabelFromVision, className, defaultValue } = this.options;

		const value = props.attributes[ this.options.name ] as string;

		if ( ! value ) {
			props.setAttributes( { [ this.options.name ]: defaultValue || options[ 0 ].value } );
		}

		/**
		 * Function that is called whenever a new value is selected in the select element.
		 *
		 * @param event The change event.
		 */
		const onChange = useCallback(
			newValue => {
				props.setAttributes( { [ this.options.name ]: newValue } );
			},
			[ props ],
		);

		return <SelectControl
			className={ [ className, "yoast-schema-select" ].join( " " ) }
			label={ label }
			value={ value }
			defaultValue={ defaultValue }
			onChange={ onChange }
			options={ options }
			hideLabelFromVision={ hideLabelFromVision }
		/>;
	}

	/**
	 * Adds the select to the block configuration.
	 *
	 * @returns The block configuration.
	 */
	configuration(): Partial<BlockConfiguration> {
		return {
			attributes: {
				[ this.options.name ]: {
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

		return attributeExists( blockInstance, this.options.name as string );
	}
}

BlockInstruction.register( "select", Select );
