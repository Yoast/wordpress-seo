import React from 'react';

class Choice extends React.Component {
	constructor() {
		super();
	}

	/**
	 * Sets the current state
	 */
	componentWillMount() {
		this.setState( this.props );
	}

	/**
	 * Renders the choice component with a label and its radio buttons.
	 *
	 * @returns {XML}
	 */
	render() {
		let choices = this.state.properties.choices;
		let fieldKeys = Object.keys( choices );
		let fieldName = this.state.fieldName;

		return (
			<div>
				<h2>{this.state.properties.label}</h2>
				{fieldKeys.map( function ( choiceName, index ) {
					let choice   = choices[choiceName];
					let choiceId = choiceName + '-' + index;

					return (
						<div key={index}>
							<input id={choiceId} type="radio" name={fieldName} value={choiceName} />
							<label htmlFor={choiceId}>{choice.label}</label>
						</div>
					);
				} )}
			</div>
		)
	}
}

Choice.propTypes = {
	component: React.PropTypes.string,
	data: React.PropTypes.string,
	properties: React.PropTypes.object,
	default: React.PropTypes.string,
	fieldName: React.PropTypes.string
};

Choice.defaultProps = {
	component: '',
	data: '',
	properties: {},
	default: '',
	fieldName : ''
};

export default Choice;