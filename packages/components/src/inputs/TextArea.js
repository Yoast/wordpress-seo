import React from "react";
import PropTypes from "prop-types";
import FieldGroup, { FieldGroupProps } from "../field-group/FieldGroup";
// Import the required CSS.
import "./input.css";
import "../base";

/**
 * Renders a textarea for use in our HTML forms.
 *
 * @param {object} props The properties required for rendering this component.
 *
 * @returns {React.Component} A react component that can be used in our forms.
 */
const TextArea = ( props ) => {
	const {
		id = "",
		name = "",
		value = "",
		ariaDescribedBy = "",
		onChange = () => {},
		readOnly = false,
		placeholder,
	} = props;

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
				placeholder={ placeholder }
			/>
		</FieldGroup>
	);
};

TextArea.propTypes = {
	id: PropTypes.string,
	name: PropTypes.string,
	value: PropTypes.string,
	ariaDescribedBy: PropTypes.string,
	onChange: PropTypes.func,
	readOnly: PropTypes.bool,
	placeholder: PropTypes.string,
	...FieldGroupProps,
};

export default TextArea;
