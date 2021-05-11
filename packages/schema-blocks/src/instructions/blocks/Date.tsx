import { BlockConfiguration, BlockInstance } from "@wordpress/blocks";
import { DateTimePicker, Dropdown } from "@wordpress/components";
import { createElement, useState } from "@wordpress/element";
import { __experimentalGetSettings, dateI18n, format } from "@wordpress/date";
import { __ } from "@wordpress/i18n";
import BlockInstruction from "../../core/blocks/BlockInstruction";
import { RenderEditProps, RenderSaveProps } from "../../core/blocks/BlockDefinition";
import { useCallback } from "react";
import { BlockValidationResult } from "../..";
import { getPresence } from "../../functions/validators/getPresence";
import { BlockPresence, BlockValidation } from "../../core/validation";

/**
 * Adds a date picker to the schema block.
 */
export default class Date extends BlockInstruction {
	options: {
		name: string;
		required?: boolean;
	};

	/**
	 * The React components to show in the editor when editing this block.
	 *
	 * @param props The block's properties.
	 *
	 * @return The React components to show in the editor when editing this block.
	 */
	edit( props: RenderEditProps ): JSX.Element {
		const { attributes, setAttributes } = props;

		const dateFormat = Date.getDateFormat();

		const currentlySelectedDate = dateI18n( dateFormat, attributes[ this.options.name ] as string, false );

		const [ selectedDate, setSelectedDate ] = useState( currentlySelectedDate );

		let currentValue = __( "Select a date", "yoast-schema-blocks" );
		if ( attributes[ this.options.name ] ) {
			currentValue = format( "Y-m-d", attributes[ this.options.name ] as string );
		}

		/**
		 * Sets the selected date.
		 *
		 * @param dateTime The selected date and time in the form 'yyyy-MM-ddThh:mm:ss' (only the date part is used).
		 */
		const setDate = useCallback( ( dateTime: string ) => {
			const date = dateTime ? dateTime.split( "T" )[ 0 ] : null;

			setAttributes( {
				[ this.options.name ]: date,
			} );
			setSelectedDate( dateI18n( dateFormat, date, false ) );
		}, [ props, dateFormat, setSelectedDate ] );

		/**
		 * Render toggle.
		 *
		 * @param renderProps The render props.
		 *
		 * @return The rendered toggle element.
		 */
		const renderToggle = useCallback( ( renderProps: Dropdown.RenderProps ): JSX.Element => {
			return <button
				onClick={ renderProps.onToggle }
				aria-expanded={ renderProps.isOpen }
			>
				{ currentValue }
			</button>;
		}, [ selectedDate ] );

		/**
		 * Renders the content of the dropdown element.
		 *
		 * @returns The rendered content of the dropdown element.
		 */
		const renderContent = useCallback( (): JSX.Element => {
			return <div className="yoast-block-date-picker">
				<DateTimePicker
					currentDate={ attributes[ this.options.name ] ? selectedDate : null }
					onChange={ setDate }
				/>
			</div>;
		}, [ selectedDate, setDate ] );

		return <Dropdown
			className="yoast-block-date-picker-container"
			position="bottom center"
			renderToggle={ renderToggle }
			renderContent={ renderContent }
		/>;
	}

	/**
	 * Get the date format as set in the WordPress settings.
	 *
	 * @return The date format.
	 */
	static getDateFormat(): string {
		/**
		 * The `getSettings` function has been marked as experimental, but
		 * no alternative (REST-endpoint, setting it on a Redux store)
		 * seems to be implemented yet.
		 *
		 * @see https://github.com/WordPress/gutenberg/pull/7996/files#r224152849
		 */
		const settings = __experimentalGetSettings();
		return settings.formats.date;
	}

	/**
	 * The HTML to save to the database, as a React element.
	 *
	 * @param props The properties.
	 *
	 * @return The HTML to save to the database.
	 */
	save( props: RenderSaveProps ): JSX.Element {
		const date = props.attributes[ this.options.name ] as string;

		if ( ! date ) {
			return null;
		}

		const dateFormat = Date.getDateFormat();

		return <time dateTime={ date }>{ dateI18n( dateFormat, date, false ) }</time>;
	}

	/**
	 * The partial configuration to add to the block instruction
	 * that contains this instruction.
	 *
	 * @return The partial configuration.
	 */
	configuration(): Partial<BlockConfiguration> {
		return {
			attributes: {
				[ this.options.name ]: {
					type: "string",
				},
			},
		};
	}

	/**
	 * Checks if the instruction block is valid.
	 *
	 * @param blockInstance The attributes from the block.
	 *
	 * @returns {BlockValidationResult} The validation result.
	 */
	validate( blockInstance: BlockInstance ): BlockValidationResult {
		const date = blockInstance.attributes[ this.options.name ] as string;
		const presence = getPresence( this.options );

		let validation = BlockValidation.Unknown;
		if ( date && date.trim().length > 0 ) {
			validation = BlockValidation.Valid;
		} else {
			if ( presence === BlockPresence.Required ) {
				validation = BlockValidation.MissingRequiredAttribute;
			} else {
				validation = BlockValidation.MissingRecommendedAttribute;
			}
		}

		return new BlockValidationResult( blockInstance.clientId, this.constructor.name, validation, presence );
	}
}

BlockInstruction.register( "date", Date );
