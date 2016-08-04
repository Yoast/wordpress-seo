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
	'radio',
	'submit',
	'text',
	'textarea'
];

/**
 * Represents the input HTML element.
 *
 * @param {Object} props The properties to use.
 * @returns {JSX}
 * @constructor
 */
const Input = ( props ) => {
	if ( props.type === "textarea" ) {
		return (
			<textarea
				id={props.name}
			    name={props.name}
			    placeholder={props.placeholder}>{props.value}</textarea>
		)
	}

	return (
		<input
			type={props.type}
		    id={props.name}
		    name={props.name}
		    placeholder={props.placeholder}
		    value={props.value} />
	)
};

/**
 * Adds validation for the properties.
 *
 * @type {{type: string, name: string, placeholder: string, value: string}}
 */
Input.propTypes = {
	type: React.PropTypes.oneOf( inputTypes ).isRequired,
	name: React.PropTypes.string.isRequired,
	placeholder: React.PropTypes.string,
	value: React.PropTypes.string
};

/**
 * Defines the default values for the properties.
 *
 * @type {{type: string, name: string}}
 */
Input.defaultProps = {
	type: 'text',
	name: 'input'
};

export default Input;
