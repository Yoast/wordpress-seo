import React from "react";
import { noop } from "lodash";
import FieldGroup from "../field-group/FieldGroup";
// Import the required CSS.
import "./input.css";
import "../base";

/**
 * Renders a textarea for use in our HTML forms.
 *
 * @param {Object} props The properties required for rendering this component. Also accepts the FieldGroup props (see field-group/FieldGroup.js).
 * @param {string} [props.id=""] The id of the textarea.
 * @param {string} [props.name=""] The name of the textarea.
 * @param {string} [props.value=""] The value of the textarea.
 * @param {string} [props.ariaDescribedBy=""] The id of the element that describes the textarea.
 * @param {Function} [props.onChange=noop] The function to call when the textarea value changes.
 * @param {boolean} [props.readOnly=false] Whether the textarea is read-only.
 * @param {string} [props.placeholder] The placeholder text of the textarea.
 *
 * @returns {React.Component} A react component that can be used in our forms.
 */
const TextArea = ( {
	id = "",
	name = "",
	value = "",
	ariaDescribedBy = "",
	readOnly = false,
	onChange = noop,
	...props
} ) => {
	const fieldGroupProps = { ...props };
	if ( id ) {
		fieldGroupProps.htmlFor = id;
	}

	return (
		<FieldGroup { ...fieldGroupProps }>
			<textarea
				id={ id }
				name={ name }
				value={ value }
				className="yoast-field-group__textarea"
				aria-describedby={ ariaDescribedBy }
				onChange={ onChange }
				readOnly={ readOnly }
				placeholder={ props.placeholder }
			/>
		</FieldGroup>
	);
};

export default TextArea;
