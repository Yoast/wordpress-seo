import React from "react";
import PropTypes from "prop-types";
import FieldGroup, { FieldGroupDefaultProps, FieldGroupProps } from "../field-group/FieldGroup";
// Import the required CSS.
import "./input.css";
import "../base";
import { getId } from "../GenerateId";

/**
 * Renders a textarea for use in our HTML forms.
 *
 * @param {object} props The properties required for rendering this component.
 *
 * @returns {React.Component} A react component that can be used in our forms.
 */
const TextArea = ( props ) => {
	const id = getId( props.id );
	const fieldGroupProps = {
		...props,
		htmlFor: id,
	};
	return (
		<FieldGroup { ...fieldGroupProps }>
			<textarea
				id={ id }
				name={ props.name }
				value={ props.value }
				className="yoast-field-group__textarea"
				aria-describedby={ props.ariaDescribedBy }
				onChange={ props.onChange }
				readOnly={ props.readOnly }
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

TextArea.defaultProps = {
	id: "",
	name: "",
	value: "",
	ariaDescribedBy: "",
	onChange: () => {},
	readOnly: false,
	/* eslint-disable no-undefined */
	placeholder: undefined,
	/* eslint-enable */
	...FieldGroupDefaultProps,
};

export default TextArea;
