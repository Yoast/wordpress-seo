import React from 'react';
import ReactDOM from 'react-dom';

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

const Input = { props }=> {
	if( props.type === "textarea" ) {
		return (
			<textarea id={props.name} name={props.name} placeholder={props.placeholder} value={props.value} ></textarea>
		)
	}
	return (
		<input type={props.type} id={props.name} name={props.name} placeholder={props.placeholder} value={props.value} />
	)
}

Input.propTypes = {
	type: React.PropTypes.string.isRequired.oneOf( [ 'text', 'checkbox', 'password', 'button', 'slider', 'number', 'submit', 'radio' ] ),
	name: React.PropTypes.string.isRequired,
	placeholder: React.PropTypes.string,
	value: React.PropTypes.string
};

