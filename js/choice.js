import React from 'react';

class Choice extends React.Component {
	constructor() {
		super();
	}

	componentWillMount() {
		this.setState( this.props );
	}

	createHTML() {
		let radio_buttons = [];

		let options = this.state.options;
		for ( let optionName in options ) {
			let option = options[optionName];
			radio_buttons.push( <input type="radio" name={optionName} value={optionName}></input> )
			radio_buttons.push( <label htmlFor={optionName}>{option.label}</label> )
		}
		//todo check how fieldsets work
		return <form>{radio_buttons}</form>;
	}

	render() {
		return (
			<div>
				{this.createHTML()}
			</div>
		)
	}
}

Choice.propTypes = {
};

Choice.defaultProps = {
	options: []
};

export default Choice;