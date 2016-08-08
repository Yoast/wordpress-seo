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
		<textarea name={props.name} value={props.value} onChange={props.onChange} {...props.optionalAttributes}></textarea>
	);
};

/**
 * Adds validation for the properties.
 *
 * @type {{name: string, value: string, onChange:function, optionalAttributes: object}}
 */
Textarea.propTypes = {
	name: React.PropTypes.string.isRequired,

	value: React.PropTypes.string,
	onChange: React.PropTypes.func,
	optionalAttributes: React.PropTypes.object,
};

/**
 * Defines the default values for the properties.
 *
 * @type {{name: string, value: string, optionalAttributes: object}}
 */
Textarea.defaultProps = {
	name: "textarea",
	value: "",
};

export default Textarea;
