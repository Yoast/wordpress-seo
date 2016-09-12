import React from "react";

/**
 * Lists the supported input types.
 *
 * @type {string[]}
 */
const inputTypes = [
	"button",
	"checkbox",
	"number",
	"password",
	"progress",
	"radio",
	"submit",
	"text",
];

/**
 * Represents the input HTML element.
 *
 * @param {Object} props The properties to use.
 * @returns {JSX} A representation of the input HTML element based on the passed props.
 * @constructor
 */
const Input = ( props ) => {
	return (
		<input type={props.type} name={props.name} defaultValue={props.value} onChange={props.onChange} {...props.optionalAttributes} />
	);
};

/**
 * Adds validation for the properties.
 *
 * @type {{type: string, name: string, placeholder: string, value: string, onChange: function, optionalAttributes:object}}
 */
Input.propTypes = {
	name: React.PropTypes.string.isRequired,
	type: React.PropTypes.oneOf( inputTypes ).isRequired,

	value: React.PropTypes.any,
	onChange: React.PropTypes.func,
	optionalAttributes: React.PropTypes.object,
};

/**
 * Defines the default values for the properties.
 *
 * @type {{type: string, name: string}}
 */
Input.defaultProps = {
	name: "input",
	type: "text",
	value: "",
};

export default Input;
