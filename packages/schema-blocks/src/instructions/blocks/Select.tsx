import BlockInstruction from "../../core/blocks/BlockInstruction";
import { RenderEditProps, RenderSaveProps } from "../../core/blocks/BlockDefinition";
import { createElement, ReactElement } from "@wordpress/element";
import { BlockConfiguration, BlockInstance } from "@wordpress/blocks";
import { attributeExists, attributeNotEmpty } from "../../functions/validators";
import { arrayOrObjectToOptions } from "../../functions/select";

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
		options: string[] | Record<string, string>;
		/**
		 * The label that should be shown before this select control.
		 */
		label: string;
		/**
		 * If it is required that a value is selected.
		 */
		required?: boolean;
	};

	/**
	 * Renders saving the element.
	 *
	 * @param props The props.
	 *
	 * @returns {JSX.Element} The element to render.
	 */
	save( props: RenderSaveProps ): ReactElement | string {
		return <p data-id={ this.options.name } data-value={ this.value( props ) }>
			<b>{ this.options.label }:</b> { this.label( props ) }
		</p>;
	}

	/**
	 * Returns the value of the selected option.
	 *
	 * @param props The render props.
	 *
	 * @returns The value of the selected option.
	 */
	protected value( props: RenderSaveProps | RenderEditProps ): string {
		return props.attributes[ this.options.name ] as string;
	}

	/**
	 * Returns the label of the selected option.
	 *
	 * @param props The render props.
	 *
	 * @returns The label of the selected option.
	 */
	protected label( props: RenderSaveProps | RenderEditProps ): string {
		if ( Array.isArray( this.options.options ) ) {
			// Value is the same as the label, so just return the value.
			return this.value( props );
		}

		for ( const [ label, value ] of Object.entries( this.options.options ) ) {
			if ( this.value( props ) === value ) {
				return label;
			}
		}
	}

	/**
	 * Renders editing the element.
	 *
	 * @param props The props.
	 *
	 * @returns {JSX.Element} The element to render.
	 */
	edit( props: RenderEditProps ): ReactElement | string {
		const label = this.options.label;
		const value = props.attributes[ this.options.name ] as string | string[];
		const options = arrayOrObjectToOptions( this.options.options );

		/**
		 * Function that is called whenever a new value is selected in the select element.
		 *
		 * @param event The change event.
		 */
		const onInput = ( event: React.ChangeEvent<HTMLSelectElement> ): void => {
			props.setAttributes( { [ this.options.name ]: event.target.value } );
		};

		return <div>
			<label htmlFor={ label }>{ label }</label>
			<select className="yoast-schema-select" id={ label } onInput={ onInput } value={ value }>
				{
					options.map(
						( option, index ) => <option key={ index } value={ option.value }>{ option.label }</option>,
					)
				}
			</select>
		</div>;
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
