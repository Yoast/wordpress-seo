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
		return <p className={ props.className }>{ sprintf( __( "%d minutes", "yoast-schema-block" ), value ) }</p>;
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
			( value = 0 ) => {
				props.setAttributes( {
					value,
					iso8601Duration: moment.duration( value, "minutes" ).toISOString(),
				} );
			},
			[ props.attributes.value ],
		);

		return (
			<div className="yoast-schema-flex yoast-schema-duration">
				<TextControl
					type="number"
					placeholder="#"
					aria-label={ __( "Cooking time", "yoast-schema-block" ) }
					className="minutes-input"
					onChange={ onChange }
					value={ props.attributes.value as number || "" }
				/>
				<p> { __( "minutes", "yoast-schema-block" ) }</p>
			</div>
		);
	}

	/**
	 * Adds the select to the block configuration.
	 *
	 * @returns The block configuration.
	 */
	configuration(): Partial<BlockConfiguration> {
		return {
			attributes: {
				value: {
					type: "number",
				},
				iso8601Duration: {
					type: "string",
				},
			},
		};
	}
}

BlockInstruction.register( "duration", Duration );
