import React from 'react';

class Choice extends React.Component {
	constructor( props ) {
		super();
	}

	componentWillMount() {
		this.setState( this.props );
	}

	render() {
		let choices = this.state.properties.choices;
		let fieldKeys = Object.keys( choices );

		return (
			<div>
				{fieldKeys.map( function ( choiceName, index ) {
					let choice = choices[choiceName];
					return (
						<div key={index}>
							<input type="radio" name={choiceName} value={choiceName}/>
							<label htmlFor={choiceName}>{choice.label}</label>
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
	default: React.PropTypes.string
};

Choice.defaultProps = {
	component: '',
	data: '',
	properties: {},
	default: ''
};

export default Choice;