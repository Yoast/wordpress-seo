// External dependencies
import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { clamp, get } from "lodash";
import { __ } from "@wordpress/i18n";

// Internal dependencies
import "./input.css";
import FieldGroup, { FieldGroupDefaultProps, FieldGroupProps } from "../field-group/FieldGroup";
import { getId } from "../GenerateId";

/**
 * Renders a input field of type text for use in our forms.
 *
 * @param {object} props The props required for rendering the component.
 *
 * @returns {React.Component} Component that can be used inside a form.
 */
const DurationInput = ( props ) => {
	const onChangeHandler = useCallback(
		( event ) => {
			let value = event.target.value;
			value = parseInt( event.target.value, 10 ) || 0;
			const min = get( event, "target.attributes.min.value", Number.MIN_VALUE );
			const max = get( event, "target.attributes.max.value", Number.MAX_VALUE );
			const name = get( event, "target.attributes.name.value", "" );
			value = clamp( value, min, max );
			props.onChange( value, name );
		},
		[ props.onChange ]
	);

	const id = getId( props.id );
	const fieldGroupProps = {
		...props,
		htmlFor: id,
	};

	return (
		<FieldGroup { ...fieldGroupProps }>
			<div className="duration-inputs__wrapper">
				<div className="duration-inputs__input-wrapper">
					<label htmlFor="duration-input-hours">{ __( "hours", "yoast-components" ) }</label>
					<input
						id={ id + "-hours" }
						name={ "hours" }
						value={ props.hours }
						type={ "number" }
						className="yoast-field-group__inputfield duration-inputs__input"
						aria-describedby={ props.hoursAriaDescribedBy }
						readOnly={ props.readOnly }
						min={ 0 }
						onChange={ onChangeHandler }
					/>
				</div>
				<div className="duration-inputs__input-wrapper">
					<label htmlFor="duration-input-minutes">{ __( "minutes", "yoast-components" ) }</label>
					<input
						id={ id + "-minutes" }
						name={ "minutes" }
						value={ props.minutes }
						type={ "number" }
						className="yoast-field-group__inputfield duration-inputs__input"
						aria-describedby={ props.minutesAriaDescribedBy }
						readOnly={ props.readOnly }
						min={ 0 }
						max={ 59 }
						onChange={ onChangeHandler }
					/>
				</div>
				<div className="duration-inputs__input-wrapper">
					<label htmlFor="duration-input-seconds">{ __( "seconds", "yoast-components" ) }</label>
					<input
						id={ id + "-seconds" }
						name={ "seconds" }
						value={ props.seconds }
						type={ "number" }
						className="yoast-field-group__inputfield duration-inputs__input"
						aria-describedby={ props.secondsAriaDescribedBy }
						readOnly={ props.readOnly }
						min={ 0 }
						max={ 59 }
						onChange={ onChangeHandler }
					/>
				</div>
			</div>
		</FieldGroup>
	);
};

DurationInput.propTypes = {
	hours: PropTypes.number.isRequired,
	minutes: PropTypes.number.isRequired,
	seconds: PropTypes.number.isRequired,
	hoursAriaDescribedBy: PropTypes.string,
	minutesAriaDescribedBy: PropTypes.string,
	secondsAriaDescribedBy: PropTypes.string,
	id: PropTypes.string,
	...FieldGroupProps,
};

DurationInput.defaultProps = {
	id: "",
	hoursAriaDescribedBy: "",
	minutesAriaDescribedBy: "",
	secondsAriaDescribedBy: "",
	...FieldGroupDefaultProps,
};

export default DurationInput;
