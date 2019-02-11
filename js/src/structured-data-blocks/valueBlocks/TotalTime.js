/* External dependencies */
import { Component, Fragment } from "react";
import { __ } from "@wordpress/i18n";
import { RichText } from "@wordpress/editor";

/* Internal dependencies */
import buildDurationString from "./utils/buildDurationString";
import PropTypes from "prop-types";

/**
 * Represents a duration in the schema block suite.
 */
export default class Duration extends Component {
	/**
	 * Constructs a duration block instance.
	 *
	 * @param {Object} props The props for this React component.
	 */
	constructor( props ) {
		super( props );

		this.handleChangeDays = this.handleChangeDays.bind( this );
		this.handleChangeHours = this.handleChangeHours.bind( this );
		this.handleChangeMinutes = this.handleChangeMinutes.bind( this );
		this.handleLegendChange = this.handleLegendChange.bind( this );
	}

	/**
	 * Handles a change event on the days input.
	 *
	 * @param {Event} event The fired change event.
	 *
	 * @returns {void}
	 */
	handleChangeDays( event ) {
		const value = event.target.value;

		this.props.setAttributes( { days: value } );
	}

	/**
	 * Handles a change event on the hours input.
	 *
	 * @param {Event} event The fired change event.
	 *
	 * @returns {void}
	 */
	handleChangeHours( event ) {
		const value = event.target.value;

		this.props.setAttributes( { hours: value } );
	}

	/**
	 * Handles a change event on the minutes input.
	 *
	 * @param {Event} event The fired change event.
	 *
	 * @returns {void}
	 */
	handleChangeMinutes( event ) {
		const value = event.target.value;

		this.props.setAttributes( { minutes: value } );
	}

	/**
	 * Handles a change event on the legend rich text.
	 *
	 * @param {string} value The current value for the legend rich text.
	 *
	 * @returns {void}
	 */
	handleLegendChange( value ) {
		this.props.setAttributes( { legend: value } );
	}

	/**
	 * Returns the default value for the duration legend.
	 *
	 * @returns {string} The default value.
	 */
	static getDefaultDurationLegend() {
		return __( "Time needed:", "wordpress-seo" );
	}

	/**
	 * Renders the editing for the duration block.
	 *
	 * @returns {ReactElement} The rendered edit UI.
	 */
	render() {
		const { attributes } = this.props;

		return (
			<fieldset className="schema-how-to-duration">
				<legend
					className="schema-how-to-duration-legend"
				>
					<RichText
						tagName="span"
						value={ attributes.legend }
						onChange={ this.handleLegendChange }
						keepPlaceholderOnFocus={ true }
						placeholder={ Duration.getDefaultDurationLegend() }
					/>
				</legend>
				<span className="schema-how-to-duration-time-input">
					<label
						htmlFor="schema-how-to-duration-days"
						className="screen-reader-text"
					>
						{ __( "days", "wordpress-seo" ) }
					</label>
					<input
						id="schema-how-to-duration-days"
						className="schema-how-to-duration-input"
						type="number"
						value={ attributes.days }
						onChange={ this.handleChangeDays }
						placeholder="DD"
					/>
					<label
						htmlFor="schema-how-to-duration-hours"
						className="screen-reader-text"
					>
						{ __( "hours", "wordpress-seo" ) }
					</label>
					<input
						id="schema-how-to-duration-hours"
						className="schema-how-to-duration-input"
						type="number"
						value={ attributes.hours }
						onChange={ this.handleChangeHours }
						placeholder="HH"
					/>
					<span aria-hidden="true">:</span>
					<label
						htmlFor="schema-how-to-duration-minutes"
						className="screen-reader-text"
					>
						{ __( "minutes", "wordpress-seo" ) }
					</label>
					<input
						id="schema-how-to-duration-minutes"
						className="schema-how-to-duration-input"
						type="number"
						value={ attributes.minutes }
						onChange={ this.handleChangeMinutes }
						placeholder="MM"
					/>
				</span>
			</fieldset>
		);
	}

	/**
	 * Renders the front end content for the duration block.
	 *
	 * @param {Object} attributes The attributes for the Duration block.
	 *
	 * @returns {ReactElement} The rendered HTML for the front end.
	 */
	static Content( { attributes } ) {
		const { days, hours, minutes } = attributes;

		const timeString = buildDurationString( { days, hours, minutes } );

		return <Fragment>
			<p className="schema-how-to-total-time">
				<span className="schema-how-to-duration-time-text">
					{ <RichText.Content value={ attributes.legend } /> }
					{ RichText.isEmpty( attributes.legend ) && Duration.getDefaultDurationLegend() }
					&nbsp;
				</span>
				{ timeString + ". " }
			</p>
		</Fragment>;
	}
}

Duration.propTypes = {
	attributes: PropTypes.object.isRequired,
	setAttributes: PropTypes.func.isRequired,
};

