import React from "react";
import PropTypes from "prop-types";
import FieldGroup, { FieldGroupProps } from "../field-group/FieldGroup";
// Import the required CSS.
import "./input.css";

// A list defining all the possible inputs for which this component can be used.
export const inputTypes = [
	"text",
	"color",
	"date",
	"datetime-local",
	"email",
	"hidden",
	"month",
	"number",
	"password",
	"search",
	"tel",
	"time",
	"url",
	"week",
	"range",
];

/**
 * Handles the onChange event.
 *
 * @param {func} onChange The onChange function.
 *
 * @returns {func} Function that call the onChange function with event.target.value.
 */
const onChangeHandler = onChange => {
	return event => {
		onChange( event.target.value );
	};
};

/**
 * Renders a input field of type text for use in our forms.
 *
 * @param {object} props The props required for rendering the component.
 *
 * @returns {React.Component} Component that can be used inside a form.
 */
const TextInput = ( props ) => {
	const {
		id = "",
		name = "",
		value = "",
		type = "text",
		ariaDescribedBy = "",
		placeholder,
		readOnly = false,
		min,
		max,
		step,
		onChange = () => {},
	} = props;

	const fieldGroupProps = { ...props };
	if ( id ) {
		fieldGroupProps.htmlFor = id;
	}

	return (
		<FieldGroup { ...fieldGroupProps }>
			<input
				id={ id }
				name={ name }
				value={ value }
				type={ type }
				className="yoast-field-group__inputfield"
				aria-describedby={ ariaDescribedBy }
				placeholder={ placeholder }
				readOnly={ readOnly }
				min={ min }
				max={ max }
				step={ step }
				onChange={ onChangeHandler( onChange ) }
			/>
		</FieldGroup>
	);
};

TextInput.propTypes = {
	id: PropTypes.string,
	name: PropTypes.string,
	value: PropTypes.string,
	type: PropTypes.oneOf( inputTypes ),
	ariaDescribedBy: PropTypes.string,
	placeholder: PropTypes.string,
	readOnly: PropTypes.bool,
	min: PropTypes.number,
	max: PropTypes.number,
	step: PropTypes.number,
	onChange: PropTypes.func,
	...FieldGroupProps,
};

export default TextInput;
