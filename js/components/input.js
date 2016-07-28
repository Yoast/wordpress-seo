import React from 'react';

class Input extends React.Component {
	constructor() {
		super();
	}

	/**
	 * Sets the current state
	 */
	componentWillMount() {
		this.setState( this.props );
	}

	render() {
		return (
			<div>
				<h2>{this.state.properties.label}</h2>
				<label htmlFor={this.props.name}>{this.state.label}</label>
				<input type={this.state.type} id={this.state.name} name={this.state.name} defaultValue={this.state.value} placeholder={this.state.placeholder} />
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
	value: 'banaan'
};

export default Input;
