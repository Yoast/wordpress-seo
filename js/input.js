import React from 'react';

class TextInput extends React.Component {
	constructor() {
		super();
	}

	render() {
		return (
			<div>
				<label htmlFor={this.props.name}>{this.props.label}</label>
				<input name={this.props.name} value={this.props.placeholder}/>
			</div>
		)
	}
}

TextInput.propTypes = {};

TextInput.defaultProps = {
	label: 'input field: ',
	placeholder: 'enter text..',
	type: '',
	name: 'input'
};

export default TextInput;