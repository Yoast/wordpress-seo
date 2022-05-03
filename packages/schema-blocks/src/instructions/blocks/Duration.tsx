import { BlockConfiguration } from "@wordpress/blocks";
import { __, sprintf } from "@wordpress/i18n";
import { TextControl } from "@wordpress/components";
import moment from "moment";

import { ReactElement, createElement, useCallback } from "react";
import BlockInstruction from "../../core/blocks/BlockInstruction";
import { RenderEditProps, RenderSaveProps } from "../../core/blocks/BlockDefinition";

/**
 * Duration instruction.
 */
export default class Duration extends BlockInstruction {
	public options: {
		/**
		 * The attribute name the value selected in the select control should be saved as.
		 */
		name: string;
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
		const value = props.attributes.value as number || 0;

		/* translators: %d will be replaced with the number of minutes. */
		return <p className={ props.className }>{ sprintf( __( "%d minutes", "wordpress-seo" ), value ) }</p>;
	}

	/**
	 * Renders editing the element.
	 *
	 * @param props The props.
	 *
	 * @returns {JSX.Element} The element to render.
	 */
	edit( props: RenderEditProps ): ReactElement | string {
		const onChange = useCallback(
			( value = "0" ) => {
				value = Math.abs( value );
				props.setAttributes( {
					// Prevent leading zero's in the input-field (e.g. "01").
					value: Number( value ).toString(),
					[ `${ this.options.name }-iso8601-duration` ]: this.convertToISOString( value ),
				} );
			},
			[ props.attributes.value ],
		);

		return (
			<div className="yoast-schema-flex yoast-schema-duration">
				<TextControl
					type="number"
					min={ 0 }
					placeholder="#"
					aria-label={ __( "Cooking time", "wordpress-seo" ) }
					className="minutes-input"
					onChange={ onChange }
					value={ props.attributes.value as string }
				/>
				<p> { __( "minutes", "wordpress-seo" ) }</p>
			</div>
		);
	}

	/**
	 * Adds the select to the block configuration.
	 *
	 * @returns The block configuration.
	 */
	configuration(): Partial<BlockConfiguration> {
		const defaultDurationMinutes = 0;

		return {
			attributes: {
				value: {
					type: "string",
					"default": Number( defaultDurationMinutes ).toString(),
				},
				[ `${ this.options.name }-iso8601-duration` ]: {
					type: "string",
					"default": this.convertToISOString( defaultDurationMinutes ),
				},
			},
		};
	}

	/**
	 * Converts a number of minutes to a ISO8601 duration value.
	 *
	 * @param value Number of minutes to be converted to a ISO8601 duration value.
	 *
	 * @returns The ISO8601 duration value.
	 */
	convertToISOString( value: number ): string {
		return moment.duration( value, "minutes" ).toISOString();
	}
}

BlockInstruction.register( "duration", Duration );
