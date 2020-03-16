import React from "react";
import PropTypes from "prop-types";
import FieldGroup from "../field-group/FieldGroup";

// Import the required CSS.
import "./input.css";

export const TextInput = ( props ) => {
	return (
		<FieldGroup
			htmlFor={ props.id }
			label={ props.label }
			description={ props.description }
			linkText={ props.linkText }
			linkTo={ props.linkTo }
		>
			<input
				type="text"
				value={ props.value }
				className="yoast-field-group__inputfield"
				name={ props.name }
				id={ props.id }
				aria-describedby={ props.ariaDescribedBy }
				placeholder={ props.placeholder }
			/>
		</FieldGroup>
	);
};

TextInput.propTypes = {
	id: PropTypes.string,
	label: PropTypes.string,
	name: PropTypes.name,
	value: PropTypes.string,
	ariaDescribedBy: PropTypes.string,
	description: PropTypes.string,
	placeholder: PropTypes.string,
};

TextInput.defaultProps = {
	// Generate a unique string of length 8.
	id: (+new Date).toString(36).slice(-8),
	label: "",
	name: "",
	value: "",
	ariaDescribedBy: "",
	placeholder: "",
};
