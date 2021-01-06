import React, { useCallback } from "react";
import PropTypes from "prop-types";
import FieldGroup, { FieldGroupDefaultProps, FieldGroupProps } from "../field-group/FieldGroup";
// Import the required CSS.
import "./input.css";
import { getId } from "../GenerateId";
import { clamp } from "lodash";

const getValidTimeValue = ( value, min, max ) => {
	console.log();
	if ( min && value < min ) {
		return min;
	}
	if ( max && value > max ) {
		return max;
	}
	return value;
}

/**
 * Handles the onChange event.
 *
 * @param {func} onChange The onChange function.
 *
 * @returns {func} Function that call the onChange function with event.target.value.
 */
const onChangeHandler = ( onChange, field, min = 0, max = Number.MAX_VALUE ) => {
	return event => {
		let value = parseInt( event.target.value, 10 );
		console.log( event.target );
		value = getValidTimeValue( value, min, max );
		onChange( value, field );
	};
};

// useCallback (ALS DAT MAG VAN MENEER REACT )
// clamp
// getAttr van target

/**
 * Renders a input field of type text for use in our forms.
 *
 * @param {object} props The props required for rendering the component.
 *
 * @returns {React.Component} Component that can be used inside a form.
 */
const DurationInput = ( props ) => {
	const memoizedOnChange = useCallback( ( event, field ) => {
		let value = parseInt( event.target.value, 10 );
		// value = getValidTimeValue( value, min, max );
		// onChange( value, field );
	} );

	const id = getId( props.id );
	const fieldGroupProps = {
		...props,
		htmlFor: id,
	};

	console.log( typeof props.hours, typeof props.minutes, typeof props.seconds );
	console.log( props );

	return (
		<FieldGroup { ...fieldGroupProps }>
			<div
				style={ {
					display: "flex",
					flexDirection: "row",
				} }
			>
				<input
					id={ id + "-hours" }
					name={ "hours" }
					value={ props.hours }
					type={ "number" }
					className="yoast-field-group__inputfield duration-input"
					aria-describedby={ props.ariaDescribedBy }
					placeholder={ "HH" }
					readOnly={ props.readOnly }
					min={ 0 }
					max={ props.max }
					step={ props.step }
					onChange={ onChangeHandler( props.onChange, "hours", 0 ) }
				/>
				<input
					id={ id + "-minutes" }
					name={ "minutes" }
					value={ props.minutes }
					type={ "number" }
					className="yoast-field-group__inputfield duration-input"
					aria-describedby={ props.ariaDescribedBy }
					placeholder={ "MM" }
					readOnly={ props.readOnly }
					min={ 0 }
					max={ 59 }
					step={ props.step }
					onChange={ onChangeHandler( props.onChange, "minutes", 0, 59 ) }
				/>
				<input
					id={ id + "-seconds" }
					name={ "seconds" }
					value={ props.seconds }
					type={ "number" }
					className="yoast-field-group__inputfield duration-input"
					aria-describedby={ props.ariaDescribedBy }
					placeholder={ "SS" }
					readOnly={ props.readOnly }
					min={ 0 }
					max={ 59 }
					step={ props.step }
					onChange={ onChangeHandler( props.onChange, "seconds", 0, 59 ) }
				/>
			</div>
		</FieldGroup>
	);
};

DurationInput.propTypes = {
	...FieldGroupProps,
};

DurationInput.defaultProps = {
	...FieldGroupDefaultProps,
};

export default DurationInput;
