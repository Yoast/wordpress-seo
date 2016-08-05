import React from 'react';

/**
 * Lists the supported input types.
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
	'text',
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
		<input type={props.type} id={props.id} name={props.name} onChange={props.onChange} {...props.optionalAttributes} />
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
