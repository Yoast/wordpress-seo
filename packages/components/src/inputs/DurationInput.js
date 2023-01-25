// External dependencies
import React from "react";
import PropTypes from "prop-types";
import { clamp, isEqual } from "lodash";
import { __ } from "@wordpress/i18n";

// Internal dependencies
import "./input.css";
import FieldGroup, { FieldGroupDefaultProps, FieldGroupProps } from "../field-group/FieldGroup";

/**
 * Calculates the duration in hours, minutes and seconds from a duration in seconds.
 *
 * @param {Number} duration The duration in seconds.
 *
 * @returns {Object} An object with the duration's hours, minutes, and seconds.
 */
function splitDuration( duration ) {
	return {
		hours: Math.floor( duration / 3600 ),
		minutes: Math.floor( ( duration % 3600 ) / 60 ),
		seconds: ( duration % 3600 ) % 60,
	};
}

/**
 * Renders a input field of type text for use in our forms.
 *
 * @param {object} props The props required for rendering the component.
 *
 * @returns {React.Component} Component that can be used inside a form.
 */
class DurationInput extends React.Component {
	/**
	 * Constructs the class
	 *
	 * @param {Object} props The props.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.state = {
			...splitDuration( props.duration ),
		};

		this.onHoursChange = this.onHoursChange.bind( this );
		this.onMinutesChange = this.onMinutesChange.bind( this );
		this.onSecondsChange = this.onSecondsChange.bind( this );
	}

	/**
	 * Formats a value from one of the inputs.
	 *
	 * @param {Event}  event                        The input event.
	 * @param {Number} min   [min=Number.MIN_VALUE] The minimum for this number. Optional, defaults to Number.MIN_VALUE.
	 * @param {Number} max   [max=Number.MAX_VALUE] The maximum for this number. Optional, defaults to Number.MAX_VALUE.
	 *
	 * @returns {Number} The formatted number, parsed and clamped.
	 */
	formatValue( event, min = Number.MIN_VALUE, max = Number.MAX_VALUE ) {
		const value = parseInt( event.target.value, 10 ) || 0;
		return clamp( value, min, max );
	}

	/**
	 * Handles onChange events for the hours input.
	 * This works by taking the state of the other two time-units, and adding the new event target value.
	 * This calls the external onChange function, which changes the duration prop.
	 * The getDerivedStateFromProps function then recalculates the state if needed.
	 *
	 * @param {Event} event The input event.
	 *
	 * @returns {void}
	 */
	onHoursChange( event ) {
		this.props.onChange( this.formatValue( event, 0 ) * 3600 + this.state.minutes * 60 + this.state.seconds );
	}

	/**
	 * Handles onChange events for the minutes input.
	 * This works by taking the state of the other two time-units, and adding the new event target value.
	 * This calls the external onChange function, which changes the duration prop.
	 * The getDerivedStateFromProps function then recalculates the state if needed.
	 *
	 * @param {Event} event The input event.
	 *
	 * @returns {void}
	 */
	onMinutesChange( event ) {
		this.props.onChange( this.state.hours * 3600 + this.formatValue( event, 0, 59 ) * 60 + this.state.seconds );
	}

	/**
	 * Handles onChange events for the seconds input.
	 * This works by taking the state of the other two time-units, and adding the new event target value.
	 * This calls the external onChange function, which changes the duration prop.
	 * The getDerivedStateFromProps function then recalculates the state if needed.
	 *
	 * @param {Event} event The input event.
	 *
	 * @returns {void}
	 */
	onSecondsChange( event ) {
		this.props.onChange( this.state.hours * 3600 + this.state.minutes * 60 + this.formatValue( event, 0, 59 ) );
	}

	/**
	 * Adjusts the state when the duration prop changes externally.
	 *
	 * @param {Object} props The props object.
	 * @param {Object} state The state object.
	 *
	 * @returns {Object|null} The new state or null.
	 */
	static getDerivedStateFromProps( props, state ) {
		const newDuration = splitDuration( props.duration );
		if ( ! isEqual( newDuration, state ) ) {
			return { ...newDuration };
		}
		return null;
	}

	/**
	 * Renders the DurationInput component.
	 *
	 * @returns {ReactElement} The DurationInput component.
	 */
	render() {
		const props = this.props;
		const id = props.id;

		return (
			<FieldGroup { ...props }>
				<div className="duration-inputs__wrapper">
					<div className="duration-inputs__input-wrapper">
						<label htmlFor={ id + "-hours" }>{ __( "hours", "wordpress-seo" ) }</label>
						<input
							id={ id + "-hours" }
							name={ "hours" }
							value={ this.state.hours }
							type={ "number" }
							className="yoast-field-group__inputfield duration-inputs__input"
							aria-describedby={ props.hoursAriaDescribedBy }
							readOnly={ props.readOnly }
							min={ 0 }
							onChange={ this.onHoursChange }
						/>
					</div>
					<div className="duration-inputs__input-wrapper">
						<label htmlFor={ id + "-minutes" }>{ __( "minutes", "wordpress-seo" ) }</label>
						<input
							id={ id + "-minutes" }
							name={ "minutes" }
							value={ this.state.minutes }
							type={ "number" }
							className="yoast-field-group__inputfield duration-inputs__input"
							aria-describedby={ props.minutesAriaDescribedBy }
							readOnly={ props.readOnly }
							min={ 0 }
							max={ 59 }
							onChange={ this.onMinutesChange }
						/>
					</div>
					<div className="duration-inputs__input-wrapper">
						<label htmlFor={ id + "-seconds" }>{ __( "seconds", "wordpress-seo" ) }</label>
						<input
							id={ id + "-seconds" }
							name={ "seconds" }
							value={ this.state.seconds }
							type={ "number" }
							className="yoast-field-group__inputfield duration-inputs__input"
							aria-describedby={ props.secondsAriaDescribedBy }
							readOnly={ props.readOnly }
							min={ 0 }
							max={ 59 }
							onChange={ this.onSecondsChange }
						/>
					</div>
				</div>
			</FieldGroup>
		);
	}
}

DurationInput.propTypes = {
	duration: PropTypes.number.isRequired,
	hoursAriaDescribedBy: PropTypes.string,
	minutesAriaDescribedBy: PropTypes.string,
	secondsAriaDescribedBy: PropTypes.string,
	id: PropTypes.string.isRequired,
	...FieldGroupProps,
};

DurationInput.defaultProps = {
	hoursAriaDescribedBy: "",
	minutesAriaDescribedBy: "",
	secondsAriaDescribedBy: "",
	...FieldGroupDefaultProps,
};

export default DurationInput;
