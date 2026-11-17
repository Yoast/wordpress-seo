import React from "react";
import FieldGroup from "../field-group/FieldGroup";
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
 * @param {Function} onChange The onChange function.
 *
 * @returns {Function} Function that call the onChange function with event.target.value.
 */
const onChangeHandler = onChange => {
	return event => {
		onChange( event.target.value );
	};
};

/**
 * Renders a input field of type text for use in our forms.
 *
 * @param {Object} props The props required for rendering the component. Also accepts the FieldGroup props (see field-group/FieldGroup.js).
 * @param {string} [props.id=""] The id of the input.
 * @param {string} [props.name=""] The name of the input.
 * @param {string} [props.value=""] The value of the input.
 * @param {string} [props.type="text"] The type of the input. One of the values in inputTypes.
 * @param {string} [props.ariaDescribedBy=""] The id of the element that describes the input.
 * @param {string} [props.placeholder] The placeholder text of the input.
 * @param {boolean} [props.readOnly=false] Whether the input is read-only.
 * @param {number} [props.min] The minimum value of the input.
 * @param {number} [props.max] The maximum value of the input.
 * @param {number} [props.step] The step interval of the input.
 * @param {Function} [props.onChange] The function to call with the new value when the input changes.
 *
 * @returns {React.Component} Component that can be used inside a form.
 */
const TextInput = ( {
	id = "",
	name = "",
	value = "",
	ariaDescribedBy = "",
	readOnly = false,
	type = "text",
	...props
} ) => {
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
				placeholder={ props.placeholder }
				readOnly={ readOnly }
				min={ props.min }
				max={ props.max }
				step={ props.step }
				onChange={ onChangeHandler( props.onChange ) }
			/>
		</FieldGroup>
	);
};

export default TextInput;
