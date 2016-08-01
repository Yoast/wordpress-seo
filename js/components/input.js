import React from 'react';
import Field from './field';

/**
 * Represents a text input interface, like a regular input field or a text area. Initially it should render a
 * normal text input. We might add other representations later on.
 */
class Input extends Field {

	render() {
		return (
			<div>
				<h2>{this.props.properties.label}</h2>
				<label htmlFor={this.props.name}>{this.props.label}</label>
				<input type={this.props.type} id={this.props.name} name={this.props.name} defaultValue={this.props.data} placeholder={this.props.placeholder} />
			</div>
		)
	}

}

Input.propTypes = {
	label: React.PropTypes.string,
	placeholder: React.PropTypes.string,
	type: React.PropTypes.string,
	name: React.PropTypes.string,
	value: React.PropTypes.string
};

Input.defaultProps = {
	label: 'input field: ',
	placeholder: 'enter text..',
	type: 'text',
	name: 'input',
	data: ''
};

export default Input;
