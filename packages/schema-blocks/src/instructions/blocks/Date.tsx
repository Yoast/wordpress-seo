// External imports.
import { BlockConfiguration } from "@wordpress/blocks";
import { DateTimePicker, Dropdown } from "@wordpress/components";
import { createElement, useState } from "@wordpress/element";
import { __experimentalGetSettings, dateI18n } from "@wordpress/date";

// Internal imports.
import BlockInstruction from "../../core/blocks/BlockInstruction";
import { RenderEditProps, RenderSaveProps } from "../../core/blocks/BlockDefinition";
import { useCallback } from "react";

/**
 * Adds a date picker to the schema block.
 */
export default class Date extends BlockInstruction {
	options: {
		name: string;
	};

	/**
	 * The React components to show in the editor when editing this block.
	 *
	 * @param props The block's properties.
	 *
	 * @return The React components to show in the editor when editing this block.
	 */
	edit( props: RenderEditProps ): JSX.Element {
		const dateFormat = Date.getDateFormat();

		const currentlySelectedDate = dateI18n( dateFormat, props.attributes[ this.options.name ] );

		const [ selectedDate, setSelectedDate ] = useState( currentlySelectedDate || dateFormat );

		/**
		 * Sets the selected date.
		 *
		 * @param dateTime The selected date and time in the form 'yyyy-MM-ddThh:mm:ss' (only the date part is used).
		 */
		const setDate = useCallback( ( dateTime: string ) => {
			const date = dateTime.split( "T" )[ 0 ];
			props.setAttributes( {
				[ this.options.name ]: date,
			} );
			setSelectedDate( dateI18n( dateFormat, date ) );
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
				{ selectedDate }
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
					currentDate={ selectedDate }
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

		const dateFormat = Date.getDateFormat();

		return <div><time dateTime={ date }>{ dateI18n( dateFormat, date ) }</time></div>;
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
}

BlockInstruction.register( "date", Date );
