import React from "react";
import PropTypes from "prop-types";
import { FieldGroupLabelIcon } from "../field-group/FieldGroup";

// Import the required CSS.
import "./input.css";

const Input = ( { id, label, type, name, value, ariaDescribedBy } ) => {
	return (
		<FieldGroupLabelIcon htmlFor={ id } label={ label }>
			<input
				type={ type }
				value={ value }
				name={ name }
				id={ id }
				aria-describedby={ ariaDescribedBy }
			/>
		</FieldGroupLabelIcon>
	);
};

Input.propTypes = {
	id: PropTypes.string,
	label: PropTypes.string,
	type: PropTypes.string,
	name: PropTypes.name,
	value: PropTypes.string,
	ariaDescribedBy: PropTypes.string,
};

Input.defaultProps = {
	// Generate a unique string of length 8.
	id: (+new Date).toString(36).slice(-8),
	label: "",
	type: "text",
	name: "",
	value: "",
	ariaDescribedBy: "",
};

export default Input;
