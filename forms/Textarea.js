import React from "react";

/**
 * Represents the textarea HTML element.
 *
 * @param {Object} props The properties to use.
 * @returns {JSX} A representation of the textarea HTML element based on the passed props.
 * @constructor
 */
const Textarea = ( props ) => {
	return (
		<textarea name={props.name} onChange={props.onChange} {...props.optionalAttributes}>{props.value}</textarea>
	);
};

/**
 * Adds validation for the properties.
 *
 * @type {{type: string, name: string, placeholder: string, value: string, optionalAttributes: object}}
 */
Textarea.propTypes = {
	name: React.PropTypes.string.isRequired,

	optionalAttributes: React.PropTypes.object,
	value: React.string,
	onChange: React.PropTypes.func,
};

/**
 * Defines the default values for the properties.
 *
 * @type {{type: string, name: string}}
 */
Textarea.defaultProps = {
	name: "",
	value: "",
	optionalAttributes: {
		className: "",
		placeholder: "",
	},
};

export default Textarea;
