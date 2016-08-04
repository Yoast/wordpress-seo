import React from 'react';

/**
 * Lists the supported input types.Input.extractOptionalAttributes = ( optionalAttributes ) => {

}
 *
 * @type {string[]}
 */
const inputTypes = [
	'button',
	'checkbox',
	'number',
	'password',
	'progress',
	'radio',
	'submit',
	'text'
];

/**
 * Represents the input HTML element.
 *
 * @param {Object} props The properties to use.
 * @returns {JSX}
 * @constructor
 */
const Input = ( props ) => {
	return (
		<input type={props.type} id={props.name} name={props.name} value={props.value} onChange={props.onChange} {...props.optionalAttributes} />
	)
};

/**
 * Adds validation for the properties.
 *
 * @type {{type: string, name: string, placeholder: string, value: string, onChange: function, optionalAttributes:object}}
 */
Input.propTypes = {
	name: React.PropTypes.string.isRequired,
	type: React.PropTypes.oneOf( inputTypes ).isRequired,
	value: React.PropTypes.any.isRequired,
	onChange: React.PropTypes.func.isRequired,

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
