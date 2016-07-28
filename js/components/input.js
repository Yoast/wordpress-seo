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
				<h2>{this.state.properties.label}</h2>
				<label htmlFor={this.props.name}>{this.state.label}</label>
				<input type={this.state.type} id={this.state.name} name={this.state.name} defaultValue={this.state.data} placeholder={this.state.placeholder} />
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
