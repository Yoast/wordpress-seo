import React from "react";
import PropTypes from "prop-types";
import FieldGroup, { FieldGroupDefaultProps, FieldGroupProps } from "../field-group/FieldGroup";
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
	const fieldGroupProps = { ...props };
	if ( props.id ) {
		fieldGroupProps.htmlFor = props.id;
	}

	return (
		<FieldGroup { ...fieldGroupProps }>
			<input
				id={ props.id }
				name={ props.name }
				value={ props.value }
				type={ props.type }
				className="yoast-field-group__inputfield"
				aria-describedby={ props.ariaDescribedBy }
				placeholder={ props.placeholder }
				readOnly={ props.readOnly }
				min={ props.min }
				max={ props.max }
				step={ props.step }
				onChange={ onChangeHandler( props.onChange ) }
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

TextInput.defaultProps = {
	id: "",
	name: "",
	value: "",
	ariaDescribedBy: "",
	readOnly: false,
	type: "text",
	// React automatically removes these values when passed as props.
	/* eslint-disable no-undefined */
	placeholder: undefined,
	min: undefined,
	max: undefined,
	step: undefined,
	onChange: undefined,
	/* eslint-enable */
	...FieldGroupDefaultProps,
};

export default TextInput;
