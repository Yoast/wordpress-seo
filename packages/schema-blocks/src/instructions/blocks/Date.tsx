// External imports.
import { BlockConfiguration } from "@wordpress/blocks";
import { DatePicker } from "@wordpress/components";
// @ts-ignore
import { __experimentalGetSettings, dateI18n } from "@wordpress/date";

// Internal imports.
import BlockInstruction from "../../core/blocks/BlockInstruction";
import { createElement, useCallback, useState } from "@wordpress/element";
import { RenderEditProps, RenderSaveProps } from "../../core/blocks/BlockDefinition";

/**
 * Adds a date picker to the schema block.
 */
class Date extends BlockInstruction {
	options: {
		name: string;
	};

	/**
	 * Sets the date using the given `setAttributes` function.
	 *
	 * @param date The date to set.
	 * @param setAttributes The function to use to set the attribute.
	 */
	setDate( date: string, setAttributes: ( newAttributes: object ) => void ) {
		setAttributes( {
			[ this.options.name ]: date,
		} );
	}

	/**
	 * The React components to show in the editor when editing this block.
	 *
	 * @param props The block's properties.
	 *
	 * @return The React components to show in the editor when editing this block.
	 */
	edit( props: RenderEditProps ): JSX.Element {
		const [ showDatePicker, setShowDatePicker ] = useState( false );

		const dateFormat = Date.getDateFormat();

		const currentlySelectedDate = dateI18n( dateFormat, props.attributes[ this.options.name ] );

		const [ selectedDate, setSelectedDate ] = useState( currentlySelectedDate || dateFormat );

		const onChange = useCallback(
			dateTime => {
				const date = dateTime.split( "T" )[ 0 ];
				this.setDate( date, props.setAttributes );
				setShowDatePicker( ! showDatePicker );
				setSelectedDate( dateI18n( dateFormat, date ) );
			},
			[ props.setAttributes, setShowDatePicker, showDatePicker, dateFormat ],
		);

		const onClick = useCallback(
			() => setShowDatePicker( ! showDatePicker ),
			[ showDatePicker ],
		);

		return <div className="yoast-block-date-picker">
			<button onClick={ onClick }>{ selectedDate }</button>
			{ showDatePicker && <DatePicker onChange={ onChange } /> }
		</div>;
	}

	/**
	 * Get the date format as set in the WordPress settings.
	 *
	 * @return The date format.
	 */
	static getDateFormat(): string {
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

		return <time dateTime={ date }>{ dateI18n( dateFormat, date ) }</time>;
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
