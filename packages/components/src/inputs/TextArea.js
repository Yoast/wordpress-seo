import React from "react";
import PropTypes from "prop-types";
import FieldGroup, { FieldGroupDefaultProps, FieldGroupProps } from "../field-group/FieldGroup";

// Import the required CSS.
import "./input.css";

/**
 * Renders a textarea for use in our HTML forms.
 *
 * @param {object} props The properties required for rendering this component.
 *
 * @return {React.Component} A react component that can be used in our forms.
 */
export const TextArea = ( props ) => {
	return (
		<FieldGroup { ...props } >
			<textarea
				id={ props.id }
				name={ props.name }
				value={ props.value }
				aria-describedby={ props.ariaDescribedBy }
			/>
		</FieldGroup>
	);
};

TextArea.propTypes = {
	id: PropTypes.string,
	name: PropTypes.name,
	value: PropTypes.string,
	ariaDescribedBy: PropTypes.string,
	...FieldGroupProps,
};

TextArea.defaultProps = {
	// Generate a unique string of length 8.
	id: ( +new Date ).toString( 36 ).slice( -8 ),
	name: "",
	value: "",
	ariaDescribedBy: "",
	...FieldGroupDefaultProps,
};
