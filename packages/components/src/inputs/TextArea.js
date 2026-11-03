import React from "react";
import PropTypes from "prop-types";
import FieldGroup, { FieldGroupProps } from "../field-group/FieldGroup";
// Import the required CSS.
import "./input.css";
import "../base";

// Stable reference matching the old defaultProps single instance, so it keeps a constant identity across renders.
const DEFAULT_ON_CHANGE = () => {};

/**
 * Renders a textarea for use in our HTML forms.
 *
 * @param {object} props The properties required for rendering this component.
 *
 * @returns {React.Component} A react component that can be used in our forms.
 */
const TextArea = ( {
	id = "",
	name = "",
	value = "",
	ariaDescribedBy = "",
	readOnly = false,
	onChange = DEFAULT_ON_CHANGE,
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
