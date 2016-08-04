import React from 'react';

/**
 * Represents a text input interface, like a regular input field or a text area. Initially it should render a
 * normal text input. We might add other representations later on.
 *
 * @param {Object} props The properties to use.
 * @returns {JSX}
 * @constructor
 */
const Input = ( props ) => {

	return (
	<div>
			<h2>{props.properties.label}</h2>
			<label htmlFor={props.name}>{props.label}</label>
			<input onChange={props.onChange} type={props.type} id={props.fieldName} name={props.fieldName} defaultValue={props.data} placeholder={props.placeholder} />
		</div>
	)

}

Input.propTypes = {
	label: React.PropTypes.string.isRequired,
	placeholder: React.PropTypes.string,
	type: React.PropTypes.string.isRequired,
	name: React.PropTypes.string.isRequired,
	value: React.PropTypes.string,
	properties: React.PropTypes.shape(
		{
			label: React.PropTypes.string.isRequired
		}
	),
	data: React.PropTypes.string,
	onChange: React.PropTypes.func,
	fieldName: React.PropTypes.string.isRequired
};

Input.defaultProps = {
	label: 'input field: ',
	placeholder: 'enter text..',
	type: 'text',
	name: 'input',
	data: '',
	fieldName : ''
};

export default Input;
